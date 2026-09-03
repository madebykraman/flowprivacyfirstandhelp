const http=require('node:http');
const crypto=require('node:crypto');
const port=Number(process.env.PORT||8787);
const records=new Map();
const community=[];
const json=(res,status,body)=>{const text=JSON.stringify(body);res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(text)};
const readBody=req=>new Promise((resolve,reject)=>{let s='';req.on('data',c=>{s+=c;if(s.length>256*1024){req.destroy();reject(Error('body too large'))}});req.on('end',()=>{try{resolve(s?JSON.parse(s):{})}catch{reject(Error('invalid json'))}});req.on('error',reject)});
const id=()=>crypto.randomBytes(18).toString('base64url');
function app(req,res){const u=new URL(req.url,`http://${req.headers.host||'localhost'}`);if(req.method==='GET'&&u.pathname==='/api/health')return json(res,200,{ok:true,service:'nijritu-public-boundary',privateHealthData:false});
 if(req.method==='POST'&&u.pathname==='/api/backup')return readBody(req).then(b=>{if(typeof b.ciphertext!=='string'||b.ciphertext.length<20||b.ciphertext.length>2000000)return json(res,400,{error:'ciphertext_required'});const key=id();records.set(key,{ciphertext:b.ciphertext,createdAt:new Date().toISOString(),expiresAt:b.expiresAt||null});json(res,201,{id:key})}).catch(()=>json(res,400,{error:'invalid_request'}));
 const bm=u.pathname.match(/^\/api\/backup\/([^/]+)$/);if(bm&&req.method==='GET'){const r=records.get(bm[1]);return r?json(res,200,{ciphertext:r.ciphertext}):json(res,404,{error:'not_found'})}if(bm&&req.method==='DELETE'){records.delete(bm[1]);return json(res,204,{})}
 if(req.method==='GET'&&u.pathname==='/api/community/feed')return json(res,200,{items:community.slice(-100).reverse().map(x=>({...x,reports:undefined}))});
 if(req.method==='POST'&&u.pathname==='/api/community/submissions')return readBody(req).then(b=>{if(typeof b.body!=='string'||b.body.trim().length<1||b.body.length>5000)return json(res,400,{error:'invalid_body'});const item={id:id(),body:b.body.trim(),createdAt:new Date().toISOString(),status:'pending',replyCount:0};community.push(item);json(res,202,{id:item.id,status:'pending'})}).catch(()=>json(res,400,{error:'invalid_request'}));
 if(req.method==='POST'&&u.pathname==='/api/community/replies')return readBody(req).then(b=>{if(typeof b.submissionId!=='string'||typeof b.body!=='string'||!b.body.trim()||b.body.length>3000)return json(res,400,{error:'invalid_body'});const parent=community.find(x=>x.id===b.submissionId);if(!parent)return json(res,404,{error:'not_found'});parent.replyCount++;json(res,202,{status:'pending'})}).catch(()=>json(res,400,{error:'invalid_request'}));
 if(req.method==='POST'&&u.pathname==='/api/community/report')return readBody(req).then(b=>{if(typeof b.submissionId!=='string'||typeof b.reason!=='string')return json(res,400,{error:'invalid_report'});const parent=community.find(x=>x.id===b.submissionId);if(parent)parent.reports=(parent.reports||0)+1;json(res,202,{status:'received'})}).catch(()=>json(res,400,{error:'invalid_request'}));
 json(res,404,{error:'not_found'})}
if(require.main===module)http.createServer(app).listen(port,()=>console.log(`NijRitu backend listening on ${port}`));
module.exports={app,records,community};
