const assert=require('node:assert/strict');
const os=require('node:os');
const path=require('node:path');
const fs=require('node:fs');
process.env.NIJRITU_STORE_FILE=path.join(os.tmpdir(),`nijritu-test-${process.pid}.json`);
process.env.NIJRITU_ADMIN_TOKEN='local-dev-admin';
process.env.NIJRITU_CORS_ORIGIN='http://localhost:8080';
const http=require('node:http');
const {app,store}=require('./server');
function request(method,path,body,headers={}){return new Promise((resolve,reject)=>{const s=http.createServer(app).listen(0,()=>{const port=s.address().port;const req=http.request({port,path,method,headers:{...(body?{'content-type':'application/json'}:{}),...headers}},res=>{let x='';res.on('data',c=>x+=c);res.on('end',()=>{s.close();resolve({status:res.statusCode,body:x?JSON.parse(x):null,headers:res.headers})})});req.on('error',e=>{s.close();reject(e)});if(body)req.end(JSON.stringify(body));else req.end()})})}
(async()=>{
 let r=await request('GET','/api/health');assert.equal(r.status,200);assert.equal(r.body.privateHealthData,false);assert.equal(r.body.storage,'durable-local-adapter');assert.equal(r.body.moderationConfigured,true);assert.equal(r.headers['x-frame-options'],'DENY');
 r=await request('GET','/api/health',null,{'origin':'https://evil.example'});assert.equal(r.status,403);
 r=await request('POST','/api/backup',{ciphertext:'opaque-encrypted-data'});assert.equal(r.status,201);const backupId=r.body.id,backupKey=r.body.accessKey;assert.equal(typeof backupKey,'string');assert.ok(r.body.expiresAt);assert.equal((await request('GET','/api/backup/'+backupId)).status,404);assert.equal((await request('GET','/api/backup/'+backupId,null,{'x-backup-key':'invalid-key'})).status,404);assert.equal((await request('GET','/api/backup/'+backupId,null,{'x-backup-key':backupKey})).body.ciphertext,'opaque-encrypted-data');assert.equal((await request('DELETE','/api/backup/'+backupId,null,{'x-backup-key':backupKey})).status,204);assert.equal((await request('GET','/api/backup/'+backupId,null,{'x-backup-key':backupKey})).status,404);
 const expired='expired-test';store.backups[expired]={ciphertext:'opaque-encrypted-data',accessKeyHash:require('node:crypto').createHash('sha256').update('expired-key').digest('hex'),createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()-1000).toISOString()};store.persist();assert.equal((await request('GET','/api/backup/'+expired,null,{'x-backup-key':'expired-key'})).status,404);
 r=await request('POST','/api/community/submissions',{body:'A public community post'});assert.equal(r.status,202);assert.equal((await request('GET','/api/community/feed')).body.items.length,0);
 let mod=await request('POST','/api/moderation/submissions/'+r.body.id+'/approve',null,{authorization:'Bearer local-dev-admin'});assert.equal(mod.status,200);assert.equal((await request('GET','/api/community/feed')).body.items[0].body,'A public community post');
 r=await request('POST','/api/community/replies',{submissionId:r.body.id,body:'A reply'});assert.equal(r.status,202);assert.equal(store.community[0].replyCount,1);
 mod=await request('POST','/api/moderation/replies/'+store.community[1].id+'/approve',null,{authorization:'Bearer local-dev-admin'});assert.equal(mod.status,200);assert.equal((await request('GET','/api/community/feed')).body.items[0].replies[0].body,'A reply');
 for(let i=0;i<3;i++)assert.equal((await request('POST','/api/community/report',{submissionId:store.community[0].id,reason:'test'})).status,202);assert.equal(store.community[0].status,'review');assert.equal((await request('GET','/api/community/feed')).body.items.length,0);
 r=await request('POST','/api/professionals',{name:'Dr Example',role:'Gynaecologist',specialties:'Menstrual health',location:'Patna',credentials:'Registration details submitted',url:'https://example.org/book',email:'doctor@example.org'});assert.equal(r.status,202);assert.equal((await request('GET','/api/professionals')).body.items.length,0);
 assert.equal((await request('POST','/api/moderation/professionals/'+r.body.id+'/approve',null,{authorization:'Bearer local-dev-admin'})).status,200);assert.equal((await request('GET','/api/professionals')).body.items.length,0);
 assert.equal((await request('POST','/api/moderation/professionals/'+r.body.id+'/verify',null,{authorization:'Bearer local-dev-admin'})).body.verified,true);const pro=(await request('GET','/api/professionals')).body.items[0];assert.equal(pro.name,'Dr Example');assert.equal(pro.email,'doctor@example.org');assert.equal(pro.verified,true);
 assert.equal((await request('GET','/api/moderation/queue',null,{authorization:'Bearer wrong'})).status,401);assert.equal((await request('GET','/api/moderation/professionals',null,{authorization:'Bearer wrong'})).status,401);
 console.log('NijRitu backend contract tests passed');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{try{fs.unlinkSync(process.env.NIJRITU_STORE_FILE)}catch{}});
