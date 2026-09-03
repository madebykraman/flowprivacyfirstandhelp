const assert=require('node:assert/strict');
const http=require('node:http');
const {app,records,community}=require('./server');
function request(method,path,body){return new Promise((resolve,reject)=>{const s=http.createServer(app).listen(0,()=>{const port=s.address().port;const req=http.request({port,path,method,headers:body?{'content-type':'application/json'}:{}},res=>{let x='';res.on('data',c=>x+=c);res.on('end',()=>{s.close();resolve({status:res.statusCode,body:x?JSON.parse(x):null})})});req.on('error',e=>{s.close();reject(e)});if(body)req.end(JSON.stringify(body));else req.end()})})}
(async()=>{
 let r=await request('GET','/api/health');assert.equal(r.status,200);assert.equal(r.body.privateHealthData,false);
 r=await request('POST','/api/backup',{ciphertext:'opaque-encrypted-data'});assert.equal(r.status,201);const backupId=r.body.id;assert.equal((await request('GET','/api/backup/'+backupId)).body.ciphertext,'opaque-encrypted-data');assert.equal((await request('DELETE','/api/backup/'+backupId)).status,204);assert.equal((await request('GET','/api/backup/'+backupId)).status,404);
 r=await request('POST','/api/community/submissions',{body:'A public community post'});assert.equal(r.status,202);assert.equal(community.length,1);assert.equal((await request('GET','/api/community/feed')).body.items[0].body,'A public community post');
 r=await request('POST','/api/community/replies',{submissionId:r.body.id,body:'A reply'});assert.equal(r.status,202);assert.equal(community[0].replyCount,1);
 console.log('NijRitu backend contract tests passed');
})().catch(e=>{console.error(e);process.exitCode=1});
