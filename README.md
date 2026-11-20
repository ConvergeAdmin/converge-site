# Converge website (2026 redesign)

Static site for convergecourtship.com, hosted on Netlify from GitHub.

## What's in here

| File / folder | What it is |
| --- | --- |
| `index.html` | Homepage |
| `philosophy.html`, `framework.html`, `beyond-geography.html`, `trust-and-safety.html` | Main pages |
| `editorials.html` | Editorials index (shows a "first essays are being written" note until you publish) |
| `editorials/_template.html` | Template for each essay |
| `waitlist.html`, `thank-you.html` | Waitlist form (Netlify Forms) and its confirmation page |
| `application-hidden.html` | The membership application (not linked from the site, hidden from search engines) |
| `css/styles.css` | All site styles |
| `css/application.css` | Extra styles used only by the application page |
| `js/script.js` | Mobile menu, "Submitting…" button state, and the application logic |
| `images/` | All photos, already graded and sized for the web |
| `favicon.svg` | Browser tab icon |

## Deploying

Replace the old files in your GitHub repo with everything in this folder, keeping the same folder structure, then commit and push. Netlify deploys automatically.

The old `css/styles.css` and `js/script.js` are fully replaced. Don't merge them.

## Forms

- **Waitlist**: still named `waitlist` in Netlify, with the same fields (`first_name`, `last_name`, `email`). Your existing Netlify notifications and Zapier setup keep working. It now has a spam honeypot and a "Submitting…" button state.
- **Application**: unchanged. It still submits as `converge-application` with the same fields, so Airtable keeps receiving the same data. The only code change is that it now posts to `/` instead of the full domain, so it also works on Netlify preview links.

## Publishing an editorial

1. Copy `editorials/_template.html` and rename it, e.g. `editorials/on-slowing-down.html`.
2. Replace everything in [brackets], including the title and description at the top of the file.
3. Delete the line `<meta name="robots" content="noindex"/>` near the top.
4. **First essay only:**
   - In `editorials.html`, delete the "BEFORE THE FIRST ESSAY" section.
   - Remove the comment lines around the FEATURED ESSAY block, then fill it in.
   - In `index.html`, remove the two comment lines around FROM THE EDITORIAL, then fill it in.
5. **Later essays:** the newest one goes in the FEATURED block. Move the previous one into the ARCHIVE list as a new row (newest first). Update the homepage block to point at the newest essay.

Essay images go in `images/`. Ask Claude to grade and resize them so they match the rest of the site.

## Still to do before or soon after launch

- **Privacy Policy and Terms of Use** in the footer still link to `#`. Point them at real pages once the legal text is ready.
- **Trust & Safety commitments:** have whoever reviews your legal pages confirm the wording on background checks, 30-day deletion and report follow-up.
- **"New editorials are shared with the waitlist first"** (on the Editorials page) is a promise. Keep it only if you'll email the waitlist when you publish.
