const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const bank=JSON.parse(fs.readFileSync(__dirname+'/bank.json','utf8'));
class Sheet{
 constructor(n,cols){this.n=n;this.data=[Array(cols).fill('Header')];}
 getLastRow(){return this.data.length;}getLastColumn(){return this.data[0].length;}
 appendRow(r){this.data.push(r);}
 getRange(row,col,numRows=1,numCols=1){const self=this;return{
  getValues:()=>Array.from({length:numRows},(_,i)=>Array.from({length:numCols},(_,j)=>self.data[row+i-1]?.[col+j-1]??'')),
  setValues:rs=>rs.forEach((r,i)=>{self.data[row+i-1]??=Array(self.getLastColumn()).fill('');r.forEach((v,j)=>self.data[row+i-1][col+j-1]=v);}),
  createTextFinder:key=>({matchEntireCell(){return this;},findNext(){for(let i=row-1;i<row-1+numRows;i++)if(String(self.data[i]?.[col-1])===String(key))return {getRow:()=>i+1};return null;}})
 };}
}
const sheets=Object.fromEntries(Object.entries({Suivi:15,Modules:11,Journal:13,Validations:10}).map(([n,c])=>[n,new Sheet(n,c)]));
const ss={getSheetByName:n=>sheets[n]},props=new Map(),cache=new Map();
const ctx={console,Date,JSON,Math,Set,Error,Number,String,Array,Object,RegExp,SpreadsheetApp:{openById:()=>ss},Utilities:{DigestAlgorithm:{SHA_256:1},Charset:{UTF_8:1},computeDigest:(_,s)=>Array.from(crypto.createHash('sha256').update(s).digest())},CacheService:{getScriptCache:()=>({put:(k,v)=>cache.set(k,v),get:k=>cache.get(k)})},PropertiesService:{getScriptProperties:()=>({getProperty:k=>props.get(k),setProperty:(k,v)=>props.set(k,v)})},LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},ContentService:{MimeType:{JSON:'json',JAVASCRIPT:'js'},createTextOutput:content=>({content,setMimeType(){return this;}})}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/Code.gs','utf8')+'\nthis.api={record:record_,form:receptionValidation,get:doGet,post:doPost,person:person_};',ctx);
const api=ctx.api,student={surname:'TEST',name:'Publication',classe:'1mcva'},sessionId=crypto.randomUUID();
function event(extra={}){return {id:crypto.randomUUID(),type:'module',student,sessionId,activeSeconds:60,moduleId:'outils',checks:{},answers:{},declared:{},...extra};}
const p=event();api.record(p);api.record(p);assert.equal(sheets.Journal.data.length,2,'un doublon ne doit pas créer de ligne');
assert.equal(sheets.Suivi.data[1][6],1,'une séance unique');
api.record(event({type:'quiz',question:2,answers:{2:[1]}}));assert.equal(sheets.Suivi.data[1][10],0,'réponse fausse');
api.record(event({type:'quiz',question:2,answers:{2:[0]}}));api.record(event({type:'quiz',question:2,answers:{2:[0]}}));assert.equal(sheets.Suivi.data[1][10],1,'pas de double point');
api.record(event({type:'quiz',question:3,answers:{3:[0,1]}}));assert.equal(sheets.Suivi.data[1][10],1,'QCM incomplet refusé');
api.record(event({type:'quiz',question:3,answers:{3:[3,0,1]}}));assert.equal(sheets.Suivi.data[1][10],2,'QCM non ordonné accepté');
api.record(event({type:'quiz',question:3,answers:{3:[0,1,1]}}));assert.equal(sheets.Suivi.data[1][10],2,'doublon de choix ne rapporte rien');
api.record(event({type:'heartbeat',activeSeconds:30}));assert.equal(sheets.Suivi.data[1][7],1,'temps de séance au maximum, pas somme des battements');
api.record(event({type:'declare',declared:{outils:true},checks:{outils:{}}}));assert.equal(sheets.Modules.data[1][8],'Non','déclaration incomplète refusée');
api.record(event({type:'declare',declared:{outils:true},checks:{outils:{0:true,1:true,2:true,3:true}}}));assert.equal(sheets.Modules.data[1][8],'Oui','checklist complète');
assert.throws(()=>api.record(event({student:{surname:'T',name:'P',classe:'inconnue'}})));
assert.equal(JSON.parse(api.post({parameter:{payload:'invalid'}}).content).ok,false);
assert.equal(api.person({...student,surname:'=IMPORTXML(test)'}).nom[0],"'",'neutralisation formule');
const qids=bank.questions.map((q,i)=>i).filter(i=>['gmail','outils','drive'].includes(bank.questions[i].m));
const meta={id:'form-test',name:'Validation 1',items:qids.map(i=>({id:100+i,q:i}))};props.set('form0',JSON.stringify(meta));
const text=(t,v,id)=>({getItem:()=>({getTitle:()=>t,getId:()=>id}),getResponse:()=>v});
const rr=[text('Nom','TEST'),text('Prénom','Publication'),text('Classe','1MCVA · Bac Pro'),...qids.map(i=>text(bank.questions[i].q,bank.questions[i].a.length>1?bank.questions[i].a.map(a=>bank.questions[i].o[a]):bank.questions[i].o[bank.questions[i].a[0]],100+i))];
const formEvent={source:{getId:()=>meta.id},response:{getItemResponses:()=>rr,getId:()=> 'response-test',getTimestamp:()=>new Date()}};
api.form(formEvent);api.form(formEvent);assert.equal(sheets.Validations.data.length,2,'réponse Forms unique');assert.equal(sheets.Validations.data[1][7],6,'six bonnes réponses');assert.equal(sheets.Suivi.data[1][11],6,'remontée dans la synthèse');
const ack=JSON.parse(api.get({parameter:{action:'ack',id:p.id}}).content);assert.equal(ack.ok,true);
assert.equal(api.get({parameter:{action:'config',callback:'alert(1)'}}).content[0],'{','callback non valide refusé');
console.log('OK : doublons, QCU, QCM, temps, checklist, identité, formules, validation Forms et synthèse.');
