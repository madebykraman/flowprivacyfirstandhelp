/* Ritmi: local-first, iPhone-first cycle tracker. */
(function () {
  'use strict';

  var DB_NAME = 'nijritu-local';
  var DB_VERSION = 4;
  var STORE = 'state';
  var KEY = 'state';
  var now = new Date();
  var state = {
    version: '0.13.0',
    profile: null,
    logs: {},
    settings: { persistentStorageRequested: false },
    customSymptoms: []
  };
  var view = 'today';
  var month = new Date(now.getFullYear(), now.getMonth(), 1);
  var memoryOnly = false;

  function $(id) { return document.getElementById(id); }
  function all(selector) { return Array.prototype.slice.call(document.querySelectorAll(selector)); }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function key(date) { var d = new Date(date); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fromKey(value) { var p = value.split('-'); return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])); }
  function addDays(value, amount) { var d = fromKey(value); d.setDate(d.getDate() + amount); return key(d); }
  function diff(a, b) { return Math.round((fromKey(b) - fromKey(a)) / 86400000); }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(value, options) { return fromKey(value).toLocaleDateString(undefined, options); }
  function todayLabel() { return now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }); }
  function starts() { return Object.keys(state.logs).filter(function (k) { return state.logs[k] && state.logs[k].period; }).sort(); }
  function lengths() { var s = starts(), out = [], i, n; for (i = 1; i < s.length; i++) { n = diff(s[i - 1], s[i]); if (n >= 15 && n <= 90) out.push(n); } return out.slice(-8); }
  function average(values, fallback) { if (!values.length) return fallback; var total = 0; values.forEach(function (n) { total += n; }); return Math.round(total / values.length); }
  function metrics() {
    var s = starts(), ls = lengths();
    var cycle = Number(state.profile && state.profile.cycleLength) || average(ls, 28);
    var period = Number(state.profile && state.profile.periodLength) || 5;
    var last = s.length ? s[s.length - 1] : null;
    var next = last ? addDays(last, cycle) : null;
    var day = last ? diff(last, key(now)) + 1 : null;
    return { starts: s, lengths: ls, cycle: cycle, period: period, last: last, next: next, day: day };
  }
  function phase(day, cycle) {
    if (!day) return 'Waiting for day 1';
    if (day <= 5) return 'Menstrual';
    if (day <= Math.round(cycle * 0.5)) return 'Follicular';
    if (day <= Math.round(cycle * 0.6)) return 'Ovulatory estimate';
    return 'Luteal';
  }
  function phaseIndex(day, cycle) {
    if (!day) return 0;
    if (day <= 5) return 1;
    if (day <= Math.round(cycle * 0.5)) return 2;
    if (day <= Math.round(cycle * 0.6)) return 3;
    return 4;
  }

  function openDB() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) { memoryOnly = true; reject(new Error('IndexedDB unavailable')); return; }
      var request;
      try { request = indexedDB.open(DB_NAME, DB_VERSION); } catch (e) { memoryOnly = true; reject(e); return; }
      request.onupgradeneeded = function () { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE); };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error('Storage unavailable')); };
    });
  }
  function readState() {
    if (memoryOnly) return Promise.resolve(null);
    return openDB().then(function (db) { return new Promise(function (resolve, reject) { var request = db.transaction(STORE, 'readonly').objectStore(STORE).get(KEY); request.onsuccess = function () { resolve(request.result || null); }; request.onerror = function () { reject(request.error); }; }); });
  }
  function writeState() {
    if (memoryOnly) return Promise.resolve();
    return openDB().then(function (db) { return new Promise(function (resolve, reject) { var tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(state, KEY); tx.oncomplete = resolve; tx.onerror = function () { reject(tx.error); }; }); });
  }
  function normalize(saved) {
    if (!saved || typeof saved !== 'object') return;
    state = Object.assign(state, saved);
    state.logs = saved.logs && typeof saved.logs === 'object' ? saved.logs : {};
    state.settings = Object.assign({ persistentStorageRequested: false }, saved.settings || {});
    state.customSymptoms = Array.isArray(saved.customSymptoms) ? saved.customSymptoms : [];
  }

  function icon(name) {
    var paths = {
      today: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>',
      calendar: '<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M7 2v4M17 2v4M3 9h18"/>',
      insights: '<path d="M4 19V9M10 19V5M16 19v-8M22 19H2"/>',
      settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6.3v-2.6h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.6v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.6H21a1.7 1.7 0 0 0-1.6 1z"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + paths[name] + '</svg>';
  }

  function render() {
    var app = $('app');
    if (!app) return;
    if (view === 'calendar') app.innerHTML = calendarView();
    else if (view === 'insights') app.innerHTML = insightsView();
    else if (view === 'settings') app.innerHTML = settingsView();
    else app.innerHTML = todayView();
    all('.nav-item').forEach(function (button) { button.classList.toggle('active', button.getAttribute('data-view') === view); });
    bindView();
  }

  function todayView() {
    var m = metrics(), k = key(now), log = state.logs[k] || {};
    var day = m.day || '—';
    var progress = m.day ? Math.max(0, Math.min(100, (m.day / m.cycle) * 100)) : 0;
    var pIndex = phaseIndex(m.day, m.cycle);
    var next = m.next ? fmt(m.next, { month: 'short', day: 'numeric' }) : 'Set your baseline';
    var name = state.profile && state.profile.name ? esc(state.profile.name) : '';
    var status = log.period ? 'Period day' : (log.flow || log.pain || log.notes ? 'Logged today' : 'Nothing logged');
    return '<section class="today-page">' +
      '<header class="today-head"><div><span class="eyebrow">' + todayLabel() + '</span><h1>' + (name ? name + '<br>' : '') + 'Your rhythm.</h1></div><button class="avatar-mark" data-action="profile" aria-label="Open cycle setup">' + (name ? name.charAt(0).toUpperCase() : 'R') + '</button></header>' +
      '<section class="cycle-orbit" aria-label="Current cycle">' +
        '<div class="orbit-copy"><span class="eyebrow">Cycle day</span><div class="day-number">' + day + '</div><div class="phase-name">' + esc(phase(m.day, m.cycle)) + '</div></div>' +
        '<div class="orbit" style="--progress:' + progress + '%"><div class="orbit-ring"></div><div class="orbit-marker"><span></span></div><div class="orbit-center"><span>' + (m.day ? m.cycle : '28') + '</span><small>day cycle</small></div></div>' +
      '</section>' +
      '<div class="phase-track" aria-hidden="true"><i class="phase-a"></i><i class="phase-b"></i><i class="phase-c"></i><i class="phase-d"></i><b style="left:' + Math.max(2, Math.min(98, progress)) + '%"></b></div>' +
      '<section class="next-line"><div><span>Next period</span><strong>' + esc(next) + '</strong></div><div><span>Typical cycle</span><strong>' + m.cycle + ' days</strong></div></section>' +
      '<section class="today-log"><div class="log-heading"><div><span class="eyebrow">Today</span><strong>' + status + '</strong></div><button class="circle-plus" data-action="log" aria-label="Log today">+</button></div>' + todaySummary(log) + '</section>' +
      '<section class="privacy-note"><span class="privacy-glyph">●</span><div><strong>On this iPhone</strong><p>Ritmi has no account and no health-data server. Your entries stay in this browser until you export them.</p></div></section>' +
      '<button class="quiet-setup" data-action="profile">Edit cycle baseline <span>›</span></button>' +
      '</section>';
  }

  function todaySummary(log) {
    if (!log.period && !log.flow && !log.pain && !log.notes) return '<p class="empty-log">Tap + to record flow, pain or a note.</p>';
    var bits = [];
    if (log.period) bits.push('<b>Period</b>');
    if (log.flow) bits.push('<b>' + esc(log.flow) + ' flow</b>');
    if (log.pain) bits.push('<b>' + esc(log.pain) + ' pain</b>');
    if (log.notes) bits.push('<span>' + esc(log.notes) + '</span>');
    return '<div class="log-summary">' + bits.join('<i></i>') + '</div>';
  }

  function calendarView() {
    var y = month.getFullYear(), mo = month.getMonth(), first = new Date(y, mo, 1), last = new Date(y, mo + 1, 0);
    var offset = first.getDay(), total = Math.ceil((offset + last.getDate()) / 7) * 7;
    var m = metrics(), predicted = {}, html = '';
    if (m.next) { for (var p = 0; p < m.period; p++) predicted[addDays(m.next, p)] = true; }
    html += '<section class="page-head"><div><span class="eyebrow">Your history</span><h1>Calendar</h1></div><button class="today-jump" data-action="today-month">Today</button></section>';
    html += '<section class="month-head"><button data-action="prev-month" aria-label="Previous month">‹</button><strong>' + month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) + '</strong><button data-action="next-month" aria-label="Next month">›</button></section>';
    html += '<section class="calendar"><div class="weekday-row">' + ['S','M','T','W','T','F','S'].map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div><div class="calendar-grid">';
    for (var i = 0; i < total; i++) {
      if (i < offset || i >= offset + last.getDate()) { html += '<span class="blank"></span>'; continue; }
      var date = new Date(y, mo, i - offset + 1), k = key(date), log = state.logs[k], cls = '';
      if (k === key(now)) cls += ' is-today';
      if (log && log.period) cls += ' is-period';
      if (predicted[k] && !(log && log.period)) cls += ' is-predicted';
      html += '<button class="calendar-day' + cls + '" data-action="log-date" data-date="' + k + '"><span>' + date.getDate() + '</span>' + ((log && (log.period || log.flow || log.pain)) ? '<i></i>' : '') + '</button>';
    }
    html += '</div></section><div class="calendar-legend"><span><i class="legend-period"></i>Logged</span><span><i class="legend-predicted"></i>Estimated</span></div>';
    return html;
  }

  function insightsView() {
    var m = metrics(), ls = m.lengths, spread = ls.length ? Math.max.apply(null, ls) - Math.min.apply(null, ls) : null;
    var count = {};
    Object.keys(state.logs).forEach(function (k) { var log = state.logs[k]; if (log && log.symptoms) log.symptoms.forEach(function (s) { count[s] = (count[s] || 0) + 1; }); });
    var symptoms = Object.keys(count).sort(function (a, b) { return count[b] - count[a]; }).slice(0, 5);
    var max = ls.length ? Math.max.apply(null, ls) : 0;
    return '<section class="page-head insights-head"><span class="eyebrow">Patterns, not predictions</span><h1>Insights</h1><p>Only what you have recorded. Ritmi does not diagnose or promise outcomes.</p></section>' +
      '<section class="metric-duo"><div><span>Typical cycle</span><strong>' + m.cycle + '<small>days</small></strong></div><div><span>Observed range</span><strong>' + (ls.length ? Math.min.apply(null, ls) + '–' + max : '—') + '<small>days</small></strong></div></section>' +
      '<section class="insight-section"><span class="eyebrow">Recent cycle lengths</span>' + (ls.length ? '<div class="bars">' + ls.map(function (n) { return '<div class="bar-row"><span>' + n + 'd</span><div><i style="width:' + Math.max(8, Math.min(100, (n / Math.max(1, m.cycle * 1.25)) * 100)) + '%"></i></div></div>'; }).join('') + '</div>' : '<p class="muted-copy">Log at least two period starts to see your recorded cycle lengths.</p>') + '</section>' +
      '<section class="insight-section"><span class="eyebrow">Cycle starts</span>' + (m.starts.length ? '<div class="history-list">' + m.starts.slice().reverse().slice(0, 8).map(function (s) { return '<div><span>' + fmt(s, { month: 'short', day: 'numeric', year: 'numeric' }) + '</span><b>Day 1</b></div>'; }).join('') + '</div>' : '<p class="muted-copy">Your history will appear here.</p>') + '</section>' +
      '<section class="insight-section"><span class="eyebrow">Consistency</span><h2>' + (spread == null ? 'Not enough history' : spread + ' day spread') + '</h2><p class="muted-copy">A simple description of the cycle lengths you have recorded.</p></section>' +
      '<section class="insight-section"><span class="eyebrow">Most logged symptoms</span>' + (symptoms.length ? '<div class="history-list">' + symptoms.map(function (s) { return '<div><span>' + esc(s) + '</span><b>' + count[s] + '</b></div>'; }).join('') + '</div>' : '<p class="muted-copy">Symptoms you record can appear here.</p>') + '</section>';
  }

  function settingsView() {
    return '<section class="page-head"><span class="eyebrow">Private controls</span><h1>Settings</h1><p>Nothing requires an account. You decide what leaves this device.</p></section>' +
      '<section class="settings-group"><span class="eyebrow">Your baseline</span><button class="setting-line" data-action="profile"><span><b>Cycle baseline</b><small>' + (state.profile ? state.profile.cycleLength + ' day cycle · ' + state.profile.periodLength + ' day period' : 'Not set yet') + '</small></span><em>›</em></button></section>' +
      '<section class="settings-group"><span class="eyebrow">Your data</span><button class="setting-line" data-action="export"><span><b>Export a backup</b><small>Save a copy as JSON</small></span><em>›</em></button><label class="setting-line"><span><b>Import a backup</b><small>Restore from a JSON file</small></span><em>›</em><input id="import-file" type="file" accept="application/json,.json"></label></section>' +
      '<section class="settings-group"><span class="eyebrow">Storage</span><button class="setting-line" data-action="persist"><span><b>Protect local storage</b><small>' + (state.settings.persistentStorageRequested ? 'Persistent storage requested' : 'Ask iPhone to keep this data') + '</small></span><em>›</em></button></section>' +
      '<section class="trust-block"><div class="trust-mark">R</div><div><strong>Local by design</strong><p>Ritmi does not need an account or a health-data backend. Clearing Safari data can remove local entries, so keep an export if the history matters.</p></div></section>';
  }

  function bindView() {
    all('.nav-item').forEach(function (button) { button.onclick = function () { view = button.getAttribute('data-view'); render(); }; });
    all('[data-action="log"]').forEach(function (b) { b.onclick = function () { openLog(key(now)); }; });
    all('[data-action="log-date"]').forEach(function (b) { b.onclick = function () { openLog(b.getAttribute('data-date')); }; });
    all('[data-action="prev-month"]').forEach(function (b) { b.onclick = function () { month = new Date(month.getFullYear(), month.getMonth() - 1, 1); render(); }; });
    all('[data-action="next-month"]').forEach(function (b) { b.onclick = function () { month = new Date(month.getFullYear(), month.getMonth() + 1, 1); render(); }; });
    all('[data-action="today-month"]').forEach(function (b) { b.onclick = function () { month = new Date(now.getFullYear(), now.getMonth(), 1); render(); }; });
    all('[data-action="profile"]').forEach(function (b) { b.onclick = openOnboarding; });
    all('[data-action="export"]').forEach(function (b) { b.onclick = exportData; });
    all('[data-action="persist"]').forEach(function (b) { b.onclick = persistStorage; });
    var file = $('import-file'); if (file) file.onchange = importData;
  }

  function openLog(date) {
    var log = state.logs[date] || {}, sheet = $('sheet');
    $('log-date').value = date;
    $('sheet-kicker').textContent = fmt(date, { weekday: 'short', month: 'short', day: 'numeric' });
    $('sheet-title').textContent = date === key(now) ? 'How was today?' : 'Log this day';
    $('flow').value = log.flow || '';
    $('pain').value = log.pain || '';
    $('notes').value = log.notes || '';
    var toggle = $('period-toggle'); toggle.classList.toggle('selected', !!log.period); toggle.setAttribute('aria-pressed', log.period ? 'true' : 'false'); toggle.querySelector('b').textContent = log.period ? '✓' : '○';
    sheet.hidden = false; document.body.classList.add('sheet-open');
  }
  function closeLog() { $('sheet').hidden = true; document.body.classList.remove('sheet-open'); }
  function openOnboarding() {
    var p = state.profile || {};
    $('onboard-start').value = p.lastStart || (metrics().last || key(now));
    $('cycle-length').value = p.cycleLength || 28;
    $('period-length').value = p.periodLength || 5;
    $('consent').checked = !!state.profile;
    $('onboarding').hidden = false; document.body.classList.add('sheet-open');
  }
  function closeOnboarding() { $('onboarding').hidden = true; document.body.classList.remove('sheet-open'); }

  function saveLog(event) {
    event.preventDefault();
    var date = $('log-date').value, existing = state.logs[date] || {}, selected = $('period-toggle').classList.contains('selected');
    var next = { period: selected, flow: $('flow').value, pain: $('pain').value, notes: $('notes').value.trim() };
    if (!next.period && !next.flow && !next.pain && !next.notes && !existing.symptoms) delete state.logs[date];
    else state.logs[date] = Object.assign(existing, next);
    writeState().then(function () { closeLog(); render(); }).catch(function () { closeLog(); render(); });
  }
  function saveProfile(event) {
    event.preventDefault();
    state.profile = {
      name: state.profile && state.profile.name ? state.profile.name : '',
      lastStart: $('onboard-start').value,
      cycleLength: Number($('cycle-length').value),
      periodLength: Number($('period-length').value)
    };
    state.version = '0.13.0';
    writeState().then(function () { closeOnboarding(); render(); }).catch(function () { closeOnboarding(); render(); });
  }
  function exportData() {
    var payload = JSON.stringify({ app: 'Ritmi', version: state.version, exportedAt: new Date().toISOString(), state: state }, null, 2);
    var blob = new Blob([payload], { type: 'application/json' });
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'ritmi-backup-' + key(now) + '.json'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function importData(event) {
    var file = event.target.files && event.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function () { try { var parsed = JSON.parse(reader.result); normalize(parsed.state || parsed); writeState().then(function () { render(); }); } catch (e) { alert('That backup could not be read.'); } event.target.value = ''; };
    reader.readAsText(file);
  }
  function persistStorage() {
    if (!navigator.storage || !navigator.storage.persist) return;
    navigator.storage.persist().then(function (granted) { state.settings.persistentStorageRequested = !!granted; return writeState(); }).then(function () { render(); });
  }

  function boot() {
    render();
    readState().then(function (saved) {
      normalize(saved);
      render();
      if (!state.profile) setTimeout(openOnboarding, 120);
    }).catch(function () {
      memoryOnly = true;
      render();
      if (!state.profile) setTimeout(openOnboarding, 120);
    });
  }

  $('period-toggle').onclick = function () { var selected = !$('period-toggle').classList.contains('selected'); $('period-toggle').classList.toggle('selected', selected); $('period-toggle').setAttribute('aria-pressed', selected ? 'true' : 'false'); $('period-toggle').querySelector('b').textContent = selected ? '✓' : '○'; };
  $('log-form').onsubmit = saveLog;
  $('onboarding-form').onsubmit = saveProfile;
  all('[data-close-sheet]').forEach(function (b) { b.onclick = closeLog; });
  all('[data-close-onboarding]').forEach(function (b) { b.onclick = closeOnboarding; });
  $('sheet').querySelector('.icon-button').onclick = closeLog;
  boot();
})();