// Executable application-state tests using a minimal DOM adapter, NOT a browser/layout test.
// This fallback is dependency-free; the separate Playwright suite remains the visual/browser gate.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
class Element {
  constructor(doc, attrs={}) {
    this.doc=doc; this.attrs=attrs; this.dataset={}; this.checked='checked' in attrs; this.hidden='hidden' in attrs; this.disabled=false;
    for(const [k,v] of Object.entries(attrs)) if(k.startsWith('data-')) this.dataset[k.slice(5)]=v;
    this.classes=new Set((attrs.class||'').split(/\s+/));
    this.classList={add:c=>this.classes.add(c),remove:c=>this.classes.delete(c),toggle:(c,on)=>{if(on??!this.classes.has(c))this.classes.add(c);else this.classes.delete(c);},contains:c=>this.classes.has(c)};
  }
  set innerHTML(html){this.html=html;if(this.attrs.id==='app')this.doc.reset();this.doc.parse(html);}
  get innerHTML(){return this.html||'';}
  querySelectorAll(s){return this.doc.querySelectorAll(s);}
  querySelector(s){return this.doc.querySelector(s);}
  setAttribute(k,v){this.attrs[k]=v;}
  addEventListener(){}
  scrollIntoView(){}
  click(){if(!this.disabled&&this.onclick)this.onclick({target:this});}
}
class Document {
  constructor(){this.fixed={};this.fixed.app=new Element(this,{id:'app'});this.fixed.tabs=new Element(this,{id:'tabs'});this.reset();}
  reset(){this.nodes=Object.values(this.fixed);this.ids={...this.fixed};}
  parse(html){for(const m of html.matchAll(/<(button|input|select|div|p|span|section|a|ol|li)\b([^>]*)>/g)){
    const attrs={};for(const a of m[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g))attrs[a[1]]=a[2]??'';
    const e=new Element(this,attrs);this.nodes.push(e);if(attrs.id)this.ids[attrs.id]=e;
  }}
  getElementById(id){return this.ids[id]||null;}
  querySelectorAll(s){if(s==='#tabs button')return[];let m=s.match(/^\[data-([\w-]+)(?:="([^"]*)")?\]$/);if(m)return this.nodes.filter(e=>m[1] in e.dataset&&(m[2]===undefined||e.dataset[m[1]]===m[2]));return[];}
  querySelector(s){return this.querySelectorAll(s)[0]||null;}
}
const document=new Document(),saved=new Map(),intervals=new Map();let nextTimer=0;
const location={_hash:'',get hash(){return this._hash;},set hash(v){this._hash=v ? '#'+v.replace(/^#/,'') : '';}};
const ctx=vm.createContext({document,window:{scrollTo(){},addEventListener(){}},location,localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},setInterval:fn=>{intervals.set(++nextTimer,fn);return nextTimer;},clearInterval:id=>intervals.delete(id),console});
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
vm.runInContext(html.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
const run=s=>vm.runInContext(s,ctx), click=id=>{assert(document.getElementById(id),id);document.getElementById(id).click();};
run("quizFilter='all'; resetQuiz(); renderQuiz();");
const orders=new Set();
for(let i=0;i<100;i++){
  const q=run('QZ[quizState.pool[quizState.i]]');
  orders.add(run('quizState.orders[quizState.pool[quizState.i]].join()'));
  const option=document.querySelector(`[data-o="${q.ans}"]`);option.click();
  assert.equal(run('quizState.score'),i+1);
  assert(document.getElementById('fb').innerHTML.includes('Correct.'));
  assert(document.querySelectorAll('[data-o]').every(e=>e.disabled));
  // Repeated callbacks, and returning to a rendered answered question, cannot inflate score.
  option.onclick();run('renderQuiz()');assert.equal(run('quizState.score'),i+1);
  assert(document.querySelectorAll('[data-o]').every(e=>e.disabled));
  click('next');
}
assert(orders.size>10,'Answer order varies, not a predictable A–E cycle');
assert(document.fixed.app.innerHTML.includes('100 / 100'));
run('resetQuiz([0,1]);renderQuiz();');
const wrong=run('(QZ[0].ans+1)%5'), correctLetter=run('L5[quizState.orders[0].indexOf(QZ[0].ans)]');
document.querySelector(`[data-o="${wrong}"]`).click();
assert(document.getElementById('fb').innerHTML.includes(`The answer is ${correctLetter}.`));
run("location.hash='start';route();location.hash='quiz';route();");
assert(document.getElementById('fb').innerHTML.includes(`The answer is ${correctLetter}.`));
assert.equal(run('quizState.missed.length'),1);
click('next');document.querySelector(`[data-o="${run('QZ[1].ans')}"]`).click();click('next');
assert(document.fixed.app.innerHTML.includes('1 / 2'));
click('retry');assert.equal(run('quizState.pool.length'),1);
document.querySelector(`[data-o="${run('QZ[0].ans')}"]`).click();click('next');
run("quizFilter='wrong';resetQuiz();renderQuiz();");assert(document.fixed.app.innerHTML.includes('No questions match'));
run("quizFilter='new';resetQuiz();renderQuiz();");assert(document.fixed.app.innerHTML.includes('No questions match'));
run("quizFilter='all';quizShuffle=true;resetQuiz();renderQuiz();");assert.equal(run('new Set(quizState.pool).size'),100);
click('qr');assert.equal(run('quizState.score'),0);assert(document.querySelectorAll('[data-o]').every(e=>!e.disabled));
// Historical keys remain the authoritative result keys even after rewritten stems.
assert(run('QZ.some(q=>q.progressKey!==q.q.slice(0,60))'));
for(const q of run('QZ')) assert.equal(run(`qkey(QZ[${run('QZ').indexOf(q)}])`), q.progressKey);
const stationIDs=run('OSCE.map(o=>o.id)');
for(const id of stationIDs){
  run(`renderOsce(${JSON.stringify(id)})`);
  assert(document.getElementById('model').hidden);assert(document.getElementById('actor').hidden);
  click('ract');assert(!document.getElementById('actor').hidden);click('rall');assert(!document.getElementById('model').hidden);
  const box=document.querySelector('[data-m="0"]');box.checked=true;box.onchange();
  assert(document.getElementById('mscore').textContent.startsWith('1 of'));
  run(`renderOsce(${JSON.stringify(id)})`);assert(document.querySelector('[data-m="0"]').checked);
  click('mreset');assert(document.getElementById('mscore').textContent.startsWith('0 of'));
  click('tgo');assert.equal(intervals.size,1);[...intervals.values()][0]();assert.equal(document.getElementById('clock').textContent,'9:59');
  click('tgo');assert.equal(intervals.size,0);click('treset');assert.equal(document.getElementById('clock').textContent,'10:00');
  click('tgo');click('mark');assert.equal(intervals.size,0);
  const adjacent=document.querySelectorAll('[data-os]')[0];if(adjacent){adjacent.click();run('route()');assert.equal(run('timerId'),null);}
}
run("location.hash='osce';route();");assert.equal(document.querySelectorAll('[data-os]').length,stationIDs.length);
// Check the newly clarified BSP/SDCEP UK thresholds, including exact boundaries.
for(const [loss,age,teeth,stage,grade] of [[14,40,0,'I','A'],[15,40,0,'II','A'],[20,40,0,'II','B'],[33,40,0,'II','B'],[34,40,0,'III','B'],[40,40,0,'III','B'],[41,40,0,'III','C'],[66,70,0,'III','B'],[67,70,0,'IV','B'],[20,40,1,'IV','B']]){
  run(`Object.assign(stSt,{loss:${loss},age:${age},teeth:${teeth},complex:false});toolStage();`);
  assert(document.fixed.app.innerHTML.includes(`<span>Stage</span><b>${stage}</b>`));
  assert(document.fixed.app.innerHTML.includes(`<span>Grade</span><b>${grade}</b>`));
}
console.log(JSON.stringify({passed:true,testType:'VM application logic with minimal DOM adapter — not a browser test',questionsGraded:100,distinctAnswerOrders:orders.size,stationsExercised:stationIDs.length,checks:['correct/wrong feedback','displayed answer letter','repeat-click guard','return-to-quiz guard','retry missed','new/wrong filters','question shuffle','restart','station navigation','hidden reveals','checklist persistence/reset','timer pause/reset/cleanup']},null,2));
