/* Ritmi compatibility brand layer. Storage-era source identifiers are intentionally preserved for data compatibility. */
(function(){
  const replaceText=node=>{
    if(node.nodeType!==Node.TEXT_NODE)return;
    node.nodeValue=node.nodeValue.replaceAll('NijRitu','Ritmi').replaceAll('निजऋतु','Ritmi').replaceAll('Ritva','Ritmi');
  };
  const scan=root=>{
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(replaceText);
  };
  function apply(){
    if(document.title)document.title=document.title.replaceAll('NijRitu','Ritmi').replaceAll('Ritva','Ritmi');
    scan(document.querySelector('.topbar'));
    scan(document.getElementById('app'));
  }
  const app=document.getElementById('app');
  if(app)new MutationObserver(apply).observe(app,{childList:true,subtree:true,characterData:true});
  apply();
})();
