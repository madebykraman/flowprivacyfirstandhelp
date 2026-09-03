/* Ritmi launch recovery: never leave the first screen blank while local storage is resolving. */
(function(){
  function recover(){
    const app=document.getElementById('app');
    if(!app || app.innerHTML.trim() || typeof window.render!=='function') return;
    try{
      window.render();
      const onboarding=document.getElementById('onboarding');
      if(onboarding && !onboarding.open) onboarding.showModal();
    }catch(error){
      console.error('Ritmi launch recovery failed',error);
      app.innerHTML='<section class="view-head"><div><p class="eyebrow">Ritmi</p><h1>Could not open the tracker.</h1><p class="muted">Reload the page. If the problem continues, close other Ritmi tabs and try again.</p><button class="button primary" onclick="location.reload()">Reload</button></div></section>';
    }
  }
  setTimeout(recover,1200);
  setTimeout(recover,3000);
})();
