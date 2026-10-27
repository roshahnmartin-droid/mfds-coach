# MFDS Coach

A single-page MFDS revision guide. **Feedback edition: 27 October 2026.** Its teaching structure originated in the legacy RCS England syllabus; it is not a complete mapping of the new DCT3-level syllabus.

Open `index.html` in a browser, or use the GitHub Pages site for this repository. It needs no install and no account.

## What's inside
- 70 lessons following the official RCS England syllabus, each with how it shows up in a question, the exam trap, and links to its primary sources
- 100 single best answer questions: 80 rewritten for better competing distractors, plus one further source-consistency correction; answer positions randomise independently on each attempt
- 14 worked examples, 50 flashcards and 3 sorting games
- 22 original Part 2 practice stations (10 new), with candidate/actor briefs, timer and formative checklists; new cases include safety-critical actions and debrief prompts
- Claim-specific references for all 22 stations and 55 questions, with numbered standards/recommendations, chapters, named sections or verified printed/PDF pages
- Interactive tools: BPE chart, periodontitis stage and grade calculator, local anaesthetic dose calculator, statistics lab, eruption chart and emergency simulator
- Click-through decision flowcharts, a syllabus map and a study plan

## Accuracy
The historical audit in [VERIFICATION-REPORT.md](VERIFICATION-REPORT.md) is retained unchanged: it records 139 unconfirmed items. It is **not** a fresh validation of this edition. The targeted update adds 95 claim-specific question/station reference entries across 68 source URLs; see [REFERENCES-UPDATE.md](REFERENCES-UPDATE.md). Each reference says exactly what it supports. GDC professional standards are distinguished from clinical guidance and exam specifications. No web-extractor line numbers are passed off as published source line numbers.

The update also corrects specific inconsistencies found during review: apixaban restart timing, individualised pregnancy-care timing, selective CBCT, antibiotic first-choice reasoning, competence-based referral and the BSP/SDCEP UK periodontal classification. It does not revalidate every inherited textbook assertion or drug dose. The new practice rubrics are not official college mark schemes or pass thresholds.

## Exam route
- **New joint MFDS Part 1:** first sitting 28 October 2026; two papers of 90 SBAs, two hours each, in assessment centres. New Part 2 first sits in March 2027.
- **Legacy RCS England:** final Part 1 was 20 October 2026 (150 SBAs, three hours); final Part 2 is March 2027. A legacy Part 1 pass does not transfer to the new route.
- Both Part 2 formats use 14 ten-minute stations. This 100-question/22-station practice library is not a full-length mock or a prediction of exam content.
- Check your booking and the current [RCS Part 1](https://www.rcseng.ac.uk/education-and-exams/exams/search/mfds-part-1/), [RCS Part 2](https://www.rcseng.ac.uk/education-and-exams/exams/search/mfds-part-2/) and [transition guidance](https://www.rcseng.ac.uk/news-and-events/news/archive/changes-to-the-membership-of-the-faculty-of-dental-surgery-exam/).

## Verification and running checks
No build step is required. Open `index.html` locally. Optional web fonts may need a connection; the content and interactions are embedded in the file, while external guideline links require internet access. Browser progress is local to that browser/file origin, not synchronised.

With Node.js installed:
```sh
node tests/content.test.cjs
node tests/interaction.test.cjs
```
The first checks syntax, content schemas, preserved answer keys, lesson links and citation metadata. The second executes the app with a minimal DOM adapter and tests all 100 grading paths, all 22 station flows and the UK classification boundaries. **It is not a real-browser/layout test.**

`tests/browser.test.cjs` provides a Playwright/Chromium suite for an environment where those are already installed. It covers desktop/mobile overflow, actual clicks and screenshots. In the preparation environment, Chromium launch was blocked by process-socket restrictions and escalation failed on a read-only environment mount; the cloud browser also rejected `file://`. Therefore desktop/mobile visual QA remains unverified. See [TEST-REPORT.md](TEST-REPORT.md).

## Limits
- This is a study aid. It is not official RCS England material and is not affiliated with any college.
- It is not an endorsed course, validated question bank, clinical protocol or substitute for supervision.
- Always use the current BNF and the current guidelines for doses and clinical decisions.
- This feedback edition replaces the app at the same GitHub Pages URL. The preceding version is retained in a rollback branch. Publishing is separate from the earlier downloadable snapshot; see DEPLOYMENT.md.

## Phone and offline behaviour
Open the existing website in Safari or Chrome on a phone. A home-screen shortcut can open that same URL, but this app has no web manifest or service worker and does not guarantee offline reopening. Once loaded, its embedded lessons/quizzes can run without further content requests; fonts and external guideline links may need internet. A separately downloaded HTML file is a fixed snapshot, does not update itself, and may have different/limited local-storage behaviour in phone file viewers. Prefer the live link for updates.

Existing lesson/station/checklist keys and all 100 original question-progress keys are preserved. Progress stays with that browser/device and origin; there is no account or cloud sync. Avoid clearing website data to refresh the app. GitHub Pages currently serves a ten-minute cache lifetime; reload online or close and reopen an old tab if it shows the previous title.
