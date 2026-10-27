# Same-URL deployment — 27 October 2026

Target: https://roshahnmartin-droid.github.io/mfds-coach/

The user explicitly authorised replacing the existing app, not creating a second live site. Remote main was checked immediately before preparation and still matched `97ac45528ba4e7a245b846bd1b8e39c1e77f38df`; no concurrent changes were present.

## Rollback
The original version is preserved at branch `rollback/pre-feedback-2026-10-27`, pointing to `97ac45528ba4e7a245b846bd1b8e39c1e77f38df`. Restore that content with a new commit on main if required; do not erase later work by force-resetting history.

## Compatibility
The published path, existing local-storage namespace (`mfds-`), lesson/station/checklist identifiers and all 100 original question-progress keys are retained. Rewritten stems no longer lose their old progress key. Historic results remain historic; repeat revised questions to assess current knowledge. Progress is local to the browser/device and is not transferred between the website and a downloaded HTML file.

## Phone / offline behaviour
This is a self-contained HTML/JavaScript website, not a native app or offline-installable PWA. There is no manifest or service worker. A home-screen shortcut opens the same site; it does not add guaranteed offline reopening. Already-loaded practice content uses embedded data. External source links and optional fonts require internet. A separately saved HTML file is an independent snapshot and will not update automatically; phone file viewers may not support its scripting/storage.

The existing GitHub Pages response advertised `Cache-Control: max-age=600`. Reload while online, or close and reopen an old tab, if the previous title persists. Do not clear website data just to refresh: that can erase local progress.

## Verification status at publication
- Dependency-free syntax/schema/content and application-state suites pass.
- Original saved quiz results have been seeded through the old live UI for a post-release compatibility check.
- Deployment workflow, served-content byte match and live responsive/interaction checks are pending. The final result will be recorded after the hosted page changes.
- The earlier local Chromium/file-preview restrictions remain documented in TEST-REPORT.md; they are not being bypassed.
