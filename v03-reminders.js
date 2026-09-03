/* V0.3 reminder registration. No health data leaves the device. */
(function(){
  function tz(){return Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'}
  const wrap=window.actions;
  window.actions=async function(a,k,s){
    if(a==='reminder'){
      if(!state.settings.reminder)state.settings.reminder={enabled:false,hour:20,lastNotified:null,timeZone:tz()};
      if(state.settings.reminder.enabled)state.settings.reminder.timeZone=tz();
      const result=await wrap(a,k,s);
      if(state.settings.reminder?.enabled){state.settings.reminder.timeZone=tz();await save();try{const reg=await navigator.serviceWorker.ready;if('periodicSync' in reg)await reg.periodicSync.register('nijritu-reminder',{minInterval:24*60*60*1000})}catch{}}
      return result;
    }
    return wrap(a,k,s);
  };
  window.addEventListener('load',()=>{if(state.settings.reminder?.enabled){state.settings.reminder.timeZone=tz();save().catch(()=>{});}});
})();
