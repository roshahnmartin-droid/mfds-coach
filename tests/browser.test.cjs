// Uses a pre-installed Playwright package and Chromium; no install or network required.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox']});
  const context = await browser.newContext({viewport: {width: 1440, height: 1000}});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // The artifact must work offline. Optional remote fonts are deliberately blocked.
  await page.route(/^https?:/, route=>route.abort());
  await page.goto(pathToFileURL(path.join(__dirname, '..', 'index.html')).href);
  await page.locator('h1').waitFor();
  assert((await page.locator('h1').textContent()).includes('Practise'));
  await page.evaluate(()=>{localStorage.clear(); done={}; qres={}; quizFilter='all'; resetQuiz(); location.hash='quiz';});
  await page.locator('[data-o]').first().waitFor();
  // Verify every content key against the actually shuffled, rendered answer buttons.
  const count = await page.evaluate(()=>QZ.length);
  for(let i=0;i<count;i++) {
    const answer = await page.evaluate(()=>QZ[quizState.pool[quizState.i]].ans);
    await page.locator(`[data-o="${answer}"]`).click();
    assert.equal(await page.locator('.opt.right').count(), 1);
    assert.equal(await page.locator('.opt:disabled').count(), 5);
    assert((await page.locator('#fb').textContent()).includes('Correct.'));
    await page.locator('#next').click();
  }
  assert((await page.locator('.score').textContent()).includes('100 / 100'));
  // Wrong-answer letter follows display order, not the original key.
  await page.evaluate(()=>{quizFilter='all'; resetQuiz([0,1]); renderQuiz();});
  const info = await page.evaluate(()=>({answer:QZ[0].ans, letter:L5[quizState.orders[0].indexOf(QZ[0].ans)]}));
  await page.locator(`[data-o="${(info.answer+1)%5}"]`).click();
  assert((await page.locator('#fb').textContent()).includes(`The answer is ${info.letter}.`));
  await page.evaluate(()=>{location.hash='start';});
  await page.locator('h1').waitFor();
  await page.evaluate(()=>{location.hash='quiz';});
  await page.locator('#fb .feedback').waitFor();
  assert.equal(await page.locator('.opt:disabled').count(),5, 'Navigation cannot answer twice');
  assert.equal(await page.evaluate(()=>quizState.missed.length),1);
  await page.locator('#next').click();
  const second = await page.evaluate(()=>QZ[1].ans);
  await page.locator(`[data-o="${second}"]`).click();
  await page.locator('#next').click();
  assert((await page.locator('.score').textContent()).includes('1 / 2'));
  await page.locator('#retry').click();
  assert.equal(await page.evaluate(()=>quizState.pool.length),1);
  const retried = await page.evaluate(()=>QZ[quizState.pool[0]].ans);
  await page.locator(`[data-o="${retried}"]`).click();
  await page.locator('#next').click();
  await page.selectOption('#qf','wrong');
  assert((await page.locator('.qcard').textContent()).includes('No questions match'));
  await page.selectOption('#qf','new');
  assert((await page.locator('.qcard').textContent()).includes('No questions match'));
  await page.selectOption('#qf','all');
  await page.check('#qs');
  assert.equal(await page.evaluate(()=>quizState.pool.length),100);
  assert.equal(await page.evaluate(()=>new Set(quizState.pool).size),100);
  await page.locator('#qr').click();
  assert.equal(await page.evaluate(()=>quizState.score),0);
  assert.equal(await page.locator('.opt:disabled').count(),0);
  // Formative station checklists persist independently; model/actor notes are hidden initially.
  const stationIDs = await page.evaluate(()=>OSCE.map(o=>o.id));
  for (const id of stationIDs) {
    await page.evaluate(id=>{location.hash='o-'+id;},id);
    await page.locator('#rall').waitFor();
    assert(await page.locator('#model').isHidden());
    assert(await page.locator('#actor').isHidden());
    await page.locator('#ract').click();
    assert(await page.locator('#actor').isVisible());
    await page.locator('#rall').click();
    assert(await page.locator('#model').isVisible());
    assert(await page.locator('#model a[href^="https://"]').count() > 0, `${id}: station citation links`);
    await page.locator('[data-m="0"]').check();
    assert((await page.locator('#mscore').textContent()).startsWith('1 of'));
    await page.locator('#mreset').click();
    assert((await page.locator('#mscore').textContent()).startsWith('0 of'));
  }
  await page.locator('#tgo').click();
  await page.waitForTimeout(1100);
  assert.equal(await page.locator('#clock').textContent(),'9:59');
  await page.locator('#tgo').click();
  assert.equal(await page.locator('#tgo').textContent(),'Resume');
  await page.locator('#treset').click();
  assert.equal(await page.locator('#clock').textContent(),'10:00');
  await page.locator('#tgo').click();
  await page.locator('#mark').click();
  assert.equal(await page.evaluate(()=>timerId),null,'Marking a station stops its old timer');
  await page.locator('[data-os]').first().click();
  await page.locator('#clock').waitFor();
  assert.equal(await page.locator('#clock').textContent(),'10:00');
  await page.goBack();
  await page.locator('#clock').waitFor();
  assert.equal(await page.evaluate(()=>timerId),null);
  // Responsive checks: layout may scroll within tables/tabs, not the whole page.
  const screenshotDir=path.join(__dirname,'..','qa-screenshots');
  fs.mkdirSync(screenshotDir,{recursive:true});
  for(const width of [1440,375]) {
    await page.setViewportSize({width,height:1000});
    for(const hash of ['start','quiz','osce','o-'+stationIDs.at(-1)]) {
      await page.evaluate(hash=>{location.hash=hash;},hash);
      await page.waitForTimeout(50);
      if(hash.startsWith('o-')) await page.locator('#rall').click();
      assert(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth+1), `Horizontal overflow: ${width}/${hash}`);
      await page.screenshot({path:path.join(screenshotDir,`${width}-${hash}.png`), fullPage:false});
    }
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,questionsGraded:count,stationsNavigated:stationIDs.length,viewports:[1440,375],offline:true,consoleErrors:errors},null,2));
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
