# Test report — 27 October 2026

Base: `roshahnmartin-droid/mfds-coach`, main commit `97ac45528ba4e7a245b846bd1b8e39c1e77f38df`.

## Passed
- JavaScript parses under Node 24.
- 100 questions, five unique options each; valid answer index and original canonical key preserved for every question.
- 81 revised question records; 22 unique station IDs, including 10 new cases.
- New cases have eight checklist points each, candidate and actor briefs, safety/debrief sections and references; lesson links resolve.
- Citation metadata checks: HTTPS URLs, reviewed primary domains, edition/date, locators, checked date and claim scope. No invented web-extractor line labels. This is not an automated proof of every source claim or a live-link uptime test.
- Historical 139-item unconfirmed count preserved.
- All 100 correct-answer grading paths executed against shuffled option orders using the full application script in a VM with a minimal DOM adapter.
- Wrong-answer feedback reports the displayed letter, not the underlying canonical index.
- Repeated callbacks and tab-return cannot inflate score; answered options stay disabled within the attempt.
- Retry missed, question-order shuffle, restart, empty wrong/new filters, score summary.
- All 22 station routes, hidden reveals, checkbox persistence and reset, practised state, timer pause/reset/navigation cleanup.
- Ten boundary cases for BSP/SDCEP UK staging/grading, including ratios 0.5 and 1.0, adjacent stage thresholds and known advanced-periodontitis tooth loss.

## Earlier local preview limits / remaining gaps
- Local Playwright/Chromium launch: process-socket creation denied before the page opened.
- Escalated launch: environment setup failed on a read-only mount; no forbidden directory was accessed.
- Cloud-browser fallback: `file://` protocol rejected by URL policy. No attempt was made to bypass that restriction or publish the app to obtain a preview.
- At that earlier stage no real-browser pass was available. The authorised public HTTPS deployment later enabled the live checks recorded below; cross-browser/physical-phone testing remains unverified.
- No independent clinical-specialist sign-off or learner psychometric trial. Some NICE and legislation direct requests were unavailable; official primary-domain indexed text or official PDFs supplied the noted recommendation/section checks.

## Commands
```sh
node tests/content.test.cjs
node tests/interaction.test.cjs
```
Optional pre-publication browser gate, where Playwright and Chromium are already available:
```sh
CHROMIUM_PATH=/path/to/chromium node tests/browser.test.cjs
```
The browser suite is included but must not be described as passed in this environment. Review source changes and perform that browser gate before any production deployment.

## Live HTTPS checks after authorised publication (27 October, 16:45–16:50 UTC)
- GitHub Pages run 40543804023 succeeded for commit 358a63a866daf324a28492f6eae197d04d822d3b. A fresh HTTP fetch exactly matched the prepared HTML bytes.
- Actual Chromium UI: new edition title, 100-question bank, 22-station index and precise reference sections render.
- A question answered incorrectly on the old version remained in the wrong-answer filter after deployment, despite its rewritten stem.
- Wrong-answer displayed-letter feedback, five disabled options, tab-return protection, score, retry-to-correct, question shuffle and restart were exercised through actual UI controls.
- All 22 stations opened, kept model content hidden initially, then revealed their model and source links.
- Checklist tick survived reload, clear-checklist worked, timer advanced then paused/reset, and Previous/Back returned with a reset timer.
- Desktop start/quiz/index/station layouts were inspected at 1180 CSS pixels. Narrow-screen checks used a resized browser with ordinary zoom at 400 CSS pixels, not DevTools or an emulated/physical phone.
- Narrow-screen inspection found one long theory-link chip extending about 10 px beyond the usable page width. The follow-up changes its wrapping; the final deployment must be rechecked after that CSS change.
- DevTools is blocked by browser policy. No policy change or bypass was attempted. Native window resizing and normal zoom were used for the permitted responsive check.
