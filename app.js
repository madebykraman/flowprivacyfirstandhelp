/* Ritmi 0.12: intentionally small, iPhone-first tracker. No framework, no account, no backend. */
(function () {
  'use strict';

  var DB_NAME = 'nijritu-local';
  var DB_VERSION = 4;
  var STORE = 'state';
  var KEY = 'state';
  var today = new Date();
  var state = {
    version: '0.12.0',
    profile: null,
    logs: {},
    settings: { persistentStorageRequested: false },
    customSymptoms: []
  };
  var view = 'today';
  var month = new Date(today.getFullYear(), today.getMonth(), 1);
  var memoryOnly = false;

  function $(id) { return document.getElementById(id); }
  function all(selector) { return Array.prototype.slice.call(document.querySelectorAll(selector)); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function key(date) {
    var d = new Date(date);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function fromKey(value) {
    var p = value.split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function addDays(value, amount) {
    var d = fromKey(value);
    d.setDate(d.getDate() + amount);
    return key(d);
  }
  function diff(a, b) { return Math.round((fromKey(b) - fromKey(a)) / 86400000); }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function fmtDate(value, options) {
    return fromKey(value).toLocaleDateString(undefined, options || { month: 'short', day: 'numeric' });
  }
  function starts() {
    return Object.keys(state.logs).filter(function (k) { return state.logs[k] && state.logs[k].period; }).sort();
  }
  function cycleLengths() {
    var s = starts(), out = [];
    for (var i = 1; i < s.length; i++) {
      var n = diff(s[i - 1], s[i]);
      if (n >= 15 && n <= 90) out.push(n);
    }
    return out.slice(-8);
  }
  function average(values, fallback) {
    if (!values.length) return fallback;
    return Math.round(values.reduce(function (a, b) { return a + b; }, 0) / values.length);
  }
  function metrics() {
    var s = starts(), lengths = cycleLengths();
    var cycle = Number(state.profile && state.profile.cycleLength) || average(lengths, 28);
    var period = Number(state.profile && state.profile.periodLength) || 5;
    var last = s.length ? s[s.length - 1] : null;
    var next = last ? addDays(last, cycle) : null;
    var day = last ? diff(last, key(today)) + 1 : null;
    return { starts: s, lengths: lengths, cycle: cycle, period: period, last: last, next: next, day: day };
  }
  function phase(day, cycle) {
    if (!day) return 'No period start logged';
    if (day <= 5) return 'Menstrual phase';
    if (day <= Math.round(cycle * 0.5)) return 'Follicular estimate';
    if (day <= Math.round(cycle * 0.6)) return 'Ovulatory estimate';
    return 'Luteal estimate';
  }
  function openDB() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) { memoryOnly = true; reject(new Error('IndexedDB unavailable')); return; }
      var request;
      try { request = indexedDB.open(DB_NAME, DB_VERSION); } catch (e) { memoryOnly = true; reject(e); return; }
      request.onupgradeneeded = function () {
        if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error('Storage unavailable')); };
    });
  }
  function readState() {
    if (memoryOnly) return Promise.resolve(null);
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var request = db.transaction(STORE, 'readonly').objectStore(STORE).get(KEY);
        request.onsuccess = function () { resolve(request.result || null); };
        request.onerror = function () { reject(request.error); };
      });
    });
  }
  function writeState() {
    if (memoryOnly) return Promise.resolve();
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(state, KEY);
        tx.oncomplete = resolve;
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }
  function normalize(saved) {
    if (!saved || typeof saved !== 'object') return;
    state = Object.assign(state, saved);
    state.logs = saved.logs && typeof saved.logs === 'object' ? saved.logs : {};
    state.settings = Object.assign({ persistentStorageRequested: false }, saved.settings || {});
    state.customSymptoms = Array.isArray(saved.customSymptoms) ? saved.customSymptoms : [];
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
    var m = metrics(), k = key(today), log = state.logs[k] || {};
    var greetingDate = today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    var nextText = m.next ? fmtDate(m.next, { weekday: 'long', month: 'long', day: 'numeric' }) : 'Add your first period start';
    return '<section class="home-intro"><span class="kicker">' + greetingDate + '</span><h1>' + (state.profile && state.profile.name ? esc(state.profile.name) + '<br>' : '') + 'Your rhythm.</h1></section>' +
      '<section class="cycle-hero">' +
        '<div class="cycle-top"><span class="kicker">Current cycle</span><span class="cycle-phase">' + esc(phase(m.day, m.cycle)) + '</span></div>' +
        '<div class="cycle-number">' + (m.day || '—') + '</div>' +
        '<div class="cycle-label">cycle day</div>' +
        '<div class="cycle-footer"><div><span>Next period</span><strong>' + esc(nextText) + '</strong></div><button class="primary-action" data-action="log">Log today</button></div>' +
      '</section>' +
      '<section class="next-strip"><div><span class="kicker">Your baseline</span><strong>' + m.cycle + ' days</strong><small>typical cycle</small></div><div><strong>' + m.period + ' days</strong><small>typical period</small></div><div><strong>' + m.starts.length + '</strong><small>starts logged</small></div></section>' +
      '<section class="today-section"><div class="section-head"><div><span class="kicker">Today</span><h2>' + (log.period ? 'Period day' : 'Nothing logged') + '</h2></div><button class="text-button" data-action="log">' + (log.period || log.flow || log.pain || log.notes ? 'Edit' : 'Log') + '</button></div>' + todaySummary(log) + '</section>' +
      '<section class="privacy-line"><i></i><div><strong>Private by default</strong><p>Your cycle stays on this device. No account. No health-data backend.</p></div></section>';
  }

  function todaySummary(log) {
    if (!log.period && !log.flow && !log.pain && !log.notes) return '<p class="quiet">A small log today makes tomorrow’s view more useful.</p>';
    var bits = [];
    if (log.period) bits.push('Period');
    if (log.flow) bits.push(log.flow + ' flow');
    if (log.pain) bits.push(log.pain + ' pain');
    if (log.notes) bits.push(log.notes);
    return '<div class="summary-row">' + bits.map(function (b) { return '<span>' + esc(b) + '</span>'; }).join('') + '</div>';
  }

  function calendarView() {
    var y = month.getFullYear(), mo = month.getMonth(), first = new Date(y, mo, 1), last = new Date(y, mo + 1, 0);
    var offset = first.getDay(), total = Math.ceil((offset + last.getDate()) / 7) * 7;
    var m = metrics(), predicted = {};
    if (m.next) for (var p = 0; p < m.period; p++) predicted[addDays(m.next, p)] = true;
    var html = '<section class="page-intro"><div><span class="kicker">History</span><h1>Calendar</h1></div><div class="month-switch"><button data-action="prev-month" aria-label="Previous month">‹</button><strong>' + month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) + '</strong><button data-action="next-month" aria-label="Next month">›</button></div></section>';
    html += '<section class="calendar-wrap"><div class="weekday-row">' + ['S','M','T','W','T','F','S'].map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div><div class="calendar-grid">';
    for (var i = 0; i < total; i++) {
      if (i < offset || i >= offset + last.getDate()) { html += '<span class="blank"></span>'; continue; }
      var date = new Date(y, mo, i - offset + 1), k = key(date), log = state.logs[k], cls = '';
      if (k === key(today)) cls += ' today';
      if (log && log.period) cls += ' period';
      if (predicted[k] && !(log && log.period)) cls += ' predicted';
      html += '<button class="calendar-day' + cls + '" data-action="log-date" data-date="' + k + '"><span>' + date.getDate() + '</span>' + ((log && (log.period || log.flow || log.pain)) ? '<i></i>' : '') + '</button>';
    }
    html += '</div></section><section class="calendar-note"><i class="period-key"></i><span>Logged</span><i class="predicted-key"></i><span>Estimated</span></section>';
    return html;
  }

  function insightsView() {
    var m = metrics(), lengths = m.lengths, spread = lengths.length ? Math.max.apply(null, lengths) - Math.min.apply(null, lengths) : null;
    var count = {};
    Object.keys(state.logs).forEach(function (k) {
      var log = state.logs[k];
      if (log && log.symptoms) log.symptoms.forEach(function (s) { count[s] = (count[s] || 0) + 1; });
    });
    var symptoms = Object.keys(count).sort(function (a, b) { return count[b] - count[a]; }).slice(0, 5);
    return '<section class="page-intro"><span class="kicker">Your history</span><h1>Insights</h1><p>Simple patterns from what you have logged. Nothing here is a diagnosis.</p></section>' +
      '<section class="insight-lead"><div><span class="kicker">Typical cycle</span><strong>' + m.cycle + '<small>days</small></strong></div><div><span class="kicker">Observed range</span><strong>' + (lengths.length ? Math.min.apply(null, lengths) + '–' + Math.max.apply(null, lengths) : '—') + '<small>days</small></strong></div></section>' +
      '<section class="insight-list"><div class="section-head"><div><span class="kicker">Cycle starts</span><h2>' + m.starts.length + ' recorded</h2></div></div>' + (m.starts.length ? '<div class="history-list">' + m.starts.slice().reverse().map(function (s) { return '<div><span>' + fmtDate(s, { month: 'short', day: 'numeric', year: 'numeric' }) + '</span><strong>Day 1</strong></div>'; }).join('') + '</div>' : '<p class="quiet">Your history will appear here as you log period starts.</p>') + '</section>' +
      '<section class="insight-list"><span class="kicker">Consistency</span><h2>' + (spread == null ? 'Not enough history' : spread + ' day range') + '</h2><p class="quiet">This is a descriptive view of your recorded cycle lengths, not a medical measure.</p></section>' +
      '<section class="insight-list"><span class="kicker">Most logged symptoms</span>' + (symptoms.length ? '<div class="symptom-list">' + symptoms.map(function (s) { return '<div><span>' + esc(s) + '</span><strong>' + count[s] + '</strong></div>'; }).join('') + '</div>' : '<p class="quiet">Log symptoms with your daily entry to see patterns.</p>') + '</section>';
  }

  function settingsView() {
    return '<section class="page-intro"><span class="kicker">Control</span><h1>Settings</h1><p>Ritmi is designed so the useful part works without an account.</p></section>' +
      '<section class="settings-list">' +
      '<button class="setting-row" data-action="profile"><span><small>Setup</small><strong>Cycle baseline</strong></span><b>›</b></button>' +
      '<button class="setting-row" data-action="export"><span><small>Backup</small><strong>Export your data</strong></span><b>›</b></button>' +
      '<label class="setting-row file-setting"><span><small>Restore</small><strong>Import a backup</strong></span><b>›</b><input id="import-file" type="file" accept="application/json,.json"></label>' +
      '<button class="setting-row" data-action="persist"><span><small>Storage</small><strong>Request persistent storage</strong></span><b>›</b></button>' +
      '<div class="setting-note"><strong>What stays here</strong><p>Cycle dates, logs and settings are kept in this browser’s local storage. Clearing browser data can remove them, so keep an export.</p></div>' +
      '</section>';
  }

  function bindView() {
    all('.nav-item').forEach(function (button) {
      button.onclick = function () { view = button.getAttribute('data-view'); render(); };
    });
    all('[data-action="log"]').forEach(function (b) { b.onclick = function () { openLog(key(today)); }; });
    all('[data-action="log-date"]').forEach(function (b) { b.onclick = function () { openLog(b.getAttribute('data-date')); }; });
    all('[data-action="prev-month"]').forEach(function (b) { b.onclick = function () { month = new Date(month.getFullYear(), month.getMonth() - 1, 1); render(); }; });
    all('[data-action="next-month"]').forEach(function (b) { b.onclick = function () { month = new Date(month.getFullYear(), month.getMonth() + 1, 1); render(); }; });
    all('[data-action="profile"]').forEach(function (b) { b.onclick = openOnboarding; });
    all('[data-action="export"]').forEach(function (b) { b.onclick = exportData; });
    all('[data-action="persist"]').forEach(function (b) { b.onclick = requestPersistence; });
    var importInput = $('import-file');
    if (importInput) importInput.onchange = importData;
  }

  function openLog(date) {
    var log = state.logs[date] || {}, sheet = $('sheet');
    $('log-date').value = date;
    $('sheet-kicker').textContent = fmtDate(date, { weekday: 'long', month: 'long', day: 'numeric' });
    $('period-toggle').classList.toggle('selected', !!log.period);
    $('period-toggle').querySelector('b').textContent = log.period ? '✓' : '○';
    $('flow').value = log.flow || '';
    $('pain').value = log.pain || '';
    $('notes').value = log.notes || '';
    sheet.hidden = false;
    document.body.classList.add('sheet-open');
  }
  function closeLog() { $('sheet').hidden = true; document.body.classList.remove('sheet-open'); }
  function openOnboarding() {
    var p = state.profile || {};
    $('onboard-start').value = p.start || metrics().last || '';
    $('cycle-length').value = p.cycleLength || 28;
    $('period-length').value = p.periodLength || 5;
    $('consent').checked = false;
    $('onboarding').hidden = false;
    document.body.classList.add('sheet-open');
  }
  function closeOnboarding() { $('onboarding').hidden = true; document.body.classList.remove('sheet-open'); }

  function saveLog(event) {
    event.preventDefault();
    var date = $('log-date').value, old = state.logs[date] || {};
    state.logs[date] = {
      period: $('period-toggle').classList.contains('selected'),
      flow: $('flow').value,
      pain: $('pain').value,
      notes: $('notes').value.trim(),
      symptoms: old.symptoms || []
    };
    if (!state.logs[date].period && !state.logs[date].flow && !state.logs[date].pain && !state.logs[date].notes && !state.logs[date].symptoms.length) delete state.logs[date];
    writeState().catch(function () { memoryOnly = true; });
    closeLog();
    render();
  }

  function saveProfile(event) {
    event.preventDefault();
    state.profile = {
      start: $('onboard-start').value,
      cycleLength: Math.max(15, Math.min(90, Number($('cycle-length').value) || 28)),
      periodLength: Math.max(1, Math.min(15, Number($('period-length').value) || 5))
    };
    if (state.profile.start && !state.logs[state.profile.start]) state.logs[state.profile.start] = { period: true, flow: '', pain: '', notes: '', symptoms: [] };
    writeState().catch(function () { memoryOnly = true; });
    closeOnboarding();
    render();
  }

  function exportData() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'ritmi-backup-' + key(today) + '.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }
  function importData(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var incoming = JSON.parse(reader.result);
        if (!incoming || typeof incoming !== 'object' || !incoming.logs) throw new Error('Invalid backup');
        normalize(incoming); writeState().catch(function () {}); render();
      } catch (e) { window.alert('That backup could not be imported.'); }
    };
    reader.readAsText(file);
    event.target.value = '';
  }
  function requestPersistence() {
    if (!navigator.storage || !navigator.storage.persist) { window.alert('Persistent storage is not available in this browser.'); return; }
    navigator.storage.persist().then(function (granted) {
      state.settings.persistentStorageRequested = !!granted;
      writeState().catch(function () {});
      window.alert(granted ? 'Persistent storage enabled.' : 'The browser did not grant persistent storage.');
    });
  }

  function wireSheets() {
    $('period-toggle').onclick = function () {
      this.classList.toggle('selected');
      this.querySelector('b').textContent = this.classList.contains('selected') ? '✓' : '○';
    };
    $('log-form').addEventListener('submit', saveLog);
    all('[data-close-sheet]').forEach(function (b) { b.onclick = closeLog; });
    $('onboarding-form').addEventListener('submit', saveProfile);
    all('[data-close-onboarding]').forEach(function (b) { b.onclick = closeOnboarding; });
  }

  /* Paint immediately. Storage hydration is deliberately secondary so Safari cannot hang on IndexedDB. */
  wireSheets();
  render();
  readState().then(function (saved) {
    normalize(saved);
    render();
    if (!state.profile) openOnboarding();
  }).catch(function () {
    memoryOnly = true;
    render();
    if (!state.profile) openOnboarding();
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('./sw.js').catch(function () {}); });
  }
})();
