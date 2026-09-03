/* Ritmi first-paint guard: paint the shell immediately, then let storage hydration update it. */
(function(){
  try{
    if(typeof window.render==='function') window.render();
  }catch(error){
    console.error('Ritmi first paint failed',error);
    const app=document.getElementById('app');
    if(app) app.innerHTML='<section class="view-head"><div><p class="eyebrow">Ritmi</p><h1>Something went wrong.</h1><p class="muted">The interface could not start. Reload to try again.</p><button class="button primary" onclick="location.reload()">Reload</button></div></section>';
  }
})();
