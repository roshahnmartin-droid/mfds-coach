// Dependency-free content/schema and citation checks. These do not substitute for clinical review.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const js = html.match(/<script>([\s\S]*)<\/script>/)[1];
new vm.Script(js);
const ctx = vm.createContext({});
vm.runInContext(js.split('/* ============ APP ============ */')[0] + ';globalThis.content={QZ,OSCE,N,SRC_DATA};', ctx);
const {QZ, OSCE, N, SRC_DATA} = ctx.content;
assert.equal(QZ.length, 100);
assert.equal(OSCE.length, 22);
assert.equal(QZ.filter(q=>q.revised).length, 81);
assert.equal(OSCE.filter(o=>o.added).length, 10);
assert.equal(new Set(QZ.map(q => q.progressKey)).size, QZ.length, 'Unique preserved original question keys');
assert(QZ.every(q=>typeof q.progressKey==='string'&&q.progressKey.length===60), 'Original stable progress key on every question');
assert.equal(new Set(OSCE.map(o => o.id)).size, OSCE.length, 'Unique station IDs');
let references = 0;
const citationURLs = new Set();
function checkRefs(refs, id) {
  for (const r of refs || []) {
    for (const field of ['title', 'url', 'edition', 'locator', 'checked', 'supports']) assert(r[field] && typeof r[field] === 'string', `${id}: missing reference ${field}`);
    const u = new URL(r.url);
    assert.equal(u.protocol, 'https:', `${id}: source must use HTTPS`);
    const primaryDomains = ['nice.org.uk','gdc-uk.org','rcseng.ac.uk','gov.uk','sdcepdentalprescribing.nhs.scot','sdcep.org.uk','ada.org','bsperio.org.uk','onlinelibrary.wiley.com','legislation.gov.uk','supremecourt.uk','ico.org.uk','hse.gov.uk','england.nhs.uk','resus.org.uk','aapd.org','ncsct.co.uk'];
    assert(primaryDomains.some(d=>u.hostname===d||u.hostname.endsWith('.'+d)), `${id}: review non-primary source domain ${u.hostname}`);
    assert(!/turn\d+(search|view)|L\d+[-–]L?\d+/i.test(r.locator), `${id}: web-extractor lines are not published locators`);
    assert.equal(r.checked, '2026-10-27');
    references++;
    citationURLs.add(r.url);
  }
}
for (const [i,q] of QZ.entries()) {
  assert(q.q && q.why, `Question ${i}: missing stem/explanation`);
  assert.equal(q.opts.length, 5, `Question ${i}: five options`);
  assert.equal(new Set(q.opts.map(x=>x.trim().toLowerCase())).size, 5, `Question ${i}: duplicate option`);
  assert(Number.isInteger(q.ans) && q.ans >= 0 && q.ans < 5, `Question ${i}: invalid key`);
  assert.equal(q.ans, i % 5, `Question ${i}: original canonical answer index preserved`);
  assert(q.th.every(t=>N[t]), `Question ${i}: broken lesson link`);
  checkRefs(q.refs, `Question ${i}`);
}
for (const o of OSCE) {
  for (const field of ['id', 't', 'short', 'brief', 'actor']) assert(o[field], `${o.id}: missing ${field}`);
  for (const field of ['domains', 'approach', 'marks', 'phrases', 'traps', 'th']) assert(o[field]?.length, `${o.id}: empty ${field}`);
  assert(o.th.every(t=>N[t]), `${o.id}: broken lesson link`);
  if (o.added === '2026-10-27') {
    for (const field of ['safety', 'debrief', 'refs']) assert(o[field]?.length, `${o.id}: new case missing ${field}`);
    assert(o.marks.length >= 7, `${o.id}: insufficient checklist`);
  }
  checkRefs(o.refs, o.id);
}
assert.equal(SRC_DATA.counts.unverified, 139, 'Do not erase the inherited unresolved audit items');
assert(html.includes('180 SBAs') && html.includes('80 seconds per question'));
assert(html.includes('not a clinical protocol'));
assert(!html.includes('rule applies to the delayed morning dose of once-daily'), 'Incorrect DOAC restart statement removed');
const longestCorrect = QZ.filter(q => q.opts[q.ans].length > Math.max(...q.opts.filter((_,i)=>i!==q.ans).map(x=>x.length))).length;
assert(longestCorrect < 25, 'Reintroducing a widespread longest-answer cue requires editorial review');
const output = {questions: QZ.length, revisedQuestions: QZ.filter(q=>q.revised).length, stations: OSCE.length, newStations: OSCE.filter(o=>o.added).length, references, uniqueCitationURLs: citationURLs.size, uniqueLongestCorrectOptions: longestCorrect, previousLongestCorrect: 47, legacyUnconfirmedClaims: SRC_DATA.counts.unverified};
console.log(JSON.stringify(output, null, 2));
module.exports = {content: ctx.content, output};
