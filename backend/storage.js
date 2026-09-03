const fs=require('node:fs');
const path=require('node:path');
class JsonStore{
  constructor(file){this.file=path.resolve(file);this.data={backups:{},community:[],professionals:[]};this.loaded=false}
  load(){if(this.loaded)return;fs.mkdirSync(path.dirname(this.file),{recursive:true});try{this.data=JSON.parse(fs.readFileSync(this.file,'utf8'))||this.data}catch(err){if(err.code!=='ENOENT')throw err}if(!this.data.backups)this.data.backups={};if(!Array.isArray(this.data.community))this.data.community=[];if(!Array.isArray(this.data.professionals))this.data.professionals=[];this.loaded=true}
  save(){const tmp=`${this.file}.${process.pid}.tmp`;fs.writeFileSync(tmp,JSON.stringify(this.data),'utf8');fs.renameSync(tmp,this.file)}
  get backups(){this.load();return this.data.backups}
  get community(){this.load();return this.data.community}
  get professionals(){this.load();return this.data.professionals}
  persist(){this.load();this.save()}
}
module.exports={JsonStore};
