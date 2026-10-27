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

## Blocked / not verified
- Local Playwright/Chromium launch: process-socket creation denied before the page opened.
- Escalated launch: environment setup failed on a read-only mount; no forbidden directory was accessed.
- Cloud-browser fallback: `file://` protocol rejected by URL policy. No attempt was made to bypass that restriction or publish the app to obtain a preview.
- Therefore: no real-browser click result, desktop/mobile screenshot, visual overflow pass, cross-browser compatibility claim or live-site regression pass.
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
