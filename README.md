# LWCI Short Form microsite (Sterling Momentum)

Static site for the Leading Well Capacity Inventory Short Form. It has no server, database or analytics, and it makes no third-party requests. Fonts and images are served from this repository.

## Files

| File | What it holds | Who edits |
|---|---|---|
| `content/questionnaire.js` | All question wording, choices, sections, intro and instructions. Generated from `LWCI_Short_Form_Developer_Questionnaire.json` (candidate v1.1). | Approved wording changes only. Keep the `id` values. |
| `content/results-labels.js` | Short labels for the results, print and PDF views (Nov 7 addendum). | Approved label changes only. |
| `content/site-copy.js` | Page copy: privacy notice, headings, buttons, closing call to action. Items marked DRAFT need approval. | Copy changes. |
| `rules/feedback-rules-v2.2.js` | Feedback rules. `lwciV2Evaluate_` is copied verbatim from the approved `.gs` file, with a small adapter below it. | Only with Sterling Momentum approval. |
| `app.js` | Page behavior. | Developer. |
| `index.html` | Layout and styles (matches the Check-In). | Developer. |
| `test.html` | Developer test page: content checks, the five synthetic profiles, and paste-in profiles (for example test-01/test-02). Not linked from the site. | Developer. |
| `assets/`, `fonts/` | Logo, favicon, Kimberly's photo, and self-hosted fonts (SIL Open Font License). | |

To change a question's wording, edit its `text` in `content/questionnaire.js`, commit and push. No build step is needed.

## Coaching invitation (off for launch)

The photo, invitation text and booking link are built in but turned off. To turn them on later, open `content/site-copy.js` and find the `closing:` section.

- **Turn on:** change `enabled: false` to `enabled: true`. The invitation then appears on screen and in the printed report.
- **Text and link:** edit `headline`, `copy`, `button` (the button wording) and `url` (the booking link). Keep the quotation marks.
- **Photo:** replace `assets/kimberly-sterling.jpg` with a new photo using the same file name. A portrait JPG about 640×800 px works best.

## How answers are handled

- Answers are processed in the browser only. Nothing is sent to Sterling Momentum, Google Sheets or any AI service.
- Answers are kept in `sessionStorage` for the open tab, so a refresh keeps the participant's place. They are cleared when the tab is closed or the participant selects "Clear my answers." A new tab or another device always starts fresh.
- Results can be printed or saved as PDF from the browser.
- Future opt-in collection: see `COLLECTION` and `buildRecord()` in `app.js`. Both are inactive now (`enabled: false`, no submit function). Adding collection later needs separate approval, consent language, a secure endpoint and retention decisions. Participants who decline must still get their results.

## Question flow notes

- Q6 is skipped when Q5 = "0 days". The summary then shows "Not asked (0 active days selected)." This is pending research approval.
- Q8 is one screen with five separate ratings, all required.
- After Q30 there is one context screen: CTX1 is required and CTX2 is optional.

## Deploy (GitHub Pages, Kimberly's account)

1. In Kimberly's GitHub account, create a new public repository (for example `lwci-short-form`) and add Anjelica as a collaborator.
2. Upload all files in this folder, keeping the folder structure, to the `main` branch.
3. Go to Settings → Pages. Set Source to "Deploy from a branch," `main`, `/ (root)`.
4. Under Custom domain, enter the chosen subdomain (for example `inventory.<her-domain>`) and save. GitHub adds a `CNAME` file.
5. In Wix, go to Domains → Manage DNS Records and add a CNAME record. Use the subdomain part (for example `inventory`) as the host name and `<kimberly-github-username>.github.io` as the value.
6. Once DNS resolves, back in Settings → Pages, tick "Enforce HTTPS."

**Staging:** before the subdomain is ready, the site works at `https://<username>.github.io/lwci-short-form/`.

**Rollback:** the existing Check-In is a separate repository on its own subdomain and is not touched by this site. To take this site down, unpublish it in Settings → Pages, or remove the CNAME record in Wix.

**Before release:** decide whether to keep `test.html` on the live site. It holds no participant data, but it is publicly reachable if someone knows the address. Deleting it from the repo removes it.

## Testing checklist

- Open `test.html`. All content checks should pass, and the five profiles should show "PASS (technical checks only)." Use "Open" to view each profile as a full results page.
- For test-01 and test-02, paste their answers as JSON into section 3 of `test.html`. Don't commit those answers to the repository.
- Run a full pass on a phone and a laptop: back and forward navigation, required answers, Q5 = 0 days, reload mid-way, print/PDF, and "Clear my answers."
