# MFDS Coach — feedback edition, 27 October 2026

## What changed
- Reworked 80/100 MCQs with more plausible competing options, more parallel wording and clearer stems. A further periodontal explanation was corrected, making 81 questions touched overall.
- Removed the predictable displayed A–E answer cycle: options shuffle independently of the question-order setting. Canonical keys and grading are preserved.
- Correct answers are now the uniquely longest option in 14/100 questions, down from 47/100, measured in characters. This is an editorial cue check, not psychometric evidence of exam difficulty or validity.
- Added ten original OSCE cases: candour, confidentiality, interpreter-supported consent, withdrawal of consent, competence/referral, record correction, antibiotic requests, high INR, MRONJ discussion and infective-endocarditis prophylaxis shared decision-making. Total: 22.
- Added 95 precise question/station reference entries, including GDC numbered standards, NICE recommendations and SDCEP chapters/sections/verified pages. Every station and 55 questions have these references. The linked lesson pages for selected corrections also show precise references.
- Added safety/debrief content to new stations, clearer practice-only marking, checklist reset and timer cleanup. Fixed a repeat-answer scoring loophole when returning to a quiz from another tab.
- Updated the front page and timing advice for the October 2026 exam transition, while keeping legacy/new routes clearly separate.

## Specific consistency corrections
- CBCT must be individually justified and expected to affect management, not automatically ordered for panoramic overlap.
- SDCEP first-choice antibiotic reasoning distinguishes penicillin V from amoxicillin where adherence is an issue; antibiotics do not replace local treatment.
- A higher-risk apixaban case now specifies wound risk, missed morning dose and the minimum four-hour interval from haemostasis to the usual evening dose.
- Necessary restorative care in pregnancy is not restricted to a mandatory second-trimester window; medication/material decisions still require current checks.
- A practitioner without flap competence refers an oroantral communication rather than attempting a flap beyond their training.
- The UK periodontal lesson, example, flashcard, station and teaching calculator now use the named BSP/SDCEP UK approach, rather than mixing it with international thresholds. UK grade A/B boundary is 0.5; smoking/diabetes are recorded separately. The international distinction is explicit.
- The sterilisation question and linked teaching recognise that type-S suitability depends on specifically validated loads.

## What has not changed
- The original 139 unconfirmed audit entries and their warnings remain. The old verification report is a dated historical record, not replaced by a blanket assurance.
- No independent specialist examination-board or psychometric validation has been obtained.
- The source remains a self-contained HTML app. No accounts, API keys, package installation, paid services or new backend were added.
- The initial downloadable edition did not deploy. Later on 27 October the user explicitly authorised replacing the existing live site; see DEPLOYMENT.md.

## Verification
Content/schema tests and executable application-state tests pass. The original local-browser gate was blocked. After authorised deployment, actual HTTPS browser checks covered desktop and 400-CSS-pixel layouts, quiz flows and all 22 stations; see TEST-REPORT.md. The included Playwright suite is available for a capable environment before publication.

## Same-URL publication follow-through
- Preserved all original question progress keys and the existing local-storage namespace.
- Retained the old commit in a rollback branch.
- Corrected wrapping of long theory links found during narrow-screen live QA.
