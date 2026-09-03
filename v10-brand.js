/* Ritva V0.10 brand layer. Presentation only. */
(function(){
  const swap=node=>{if(node.nodeType===Node.TEXT_NODE){if(node.nodeValue.includes('NijRitu'))node.nodeValue=node.nodeValue.replaceAll('NijRitu','Ritva');if(node.nodeValue.includes('निजऋतु'))node.nodeValue=node.nodeValue.replaceAll('निजऋतु','Ritva')}else if(node.nodeType===Node.ELEMENT_NODE){for(const child of node.childNodes)swap(child)}};
  function apply(){document.title=document.title.replaceAll('NijRitu','Ritva');swap(document.getElementById('app'));swap(document.querySelector('.topbar'))}
  const app=document.getElementById('app');
  if(app)new MutationObserver(apply).observe(app,{childList:true,subtree:true,characterData:true});
  new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  apply();
})();
