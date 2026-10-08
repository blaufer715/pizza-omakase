# Putting Pizza Omakase live on pizzaomakase.co.il

Three free services, about 30 minutes, no coding beyond pasting two links.

| What | Service | Why |
|---|---|---|
| Hosting the site | Netlify (or Cloudflare Pages) | Free, drag-and-drop upload, free HTTPS |
| Receiving reservations & event requests | Formspree | Every form submission is emailed to you |
| Your calendar of evenings | A Google Sheet | Edit dates from your phone; the site updates itself |

---

## 1. Make your events calendar (Google Sheet)

1. Create a new Google Sheet. In row 1 type these headers exactly:

   | date | time | location | seats_left | status | note |
   |---|---|---|---|---|---|
   | 2026-10-22 | 19:30 | Haifa · Carmel | 6 | open | Autumn menu |

2. Add one row per evening. `date` must be YYYY-MM-DD. `status` is `open` or `full`.
   Past dates disappear from the site automatically. Set `seats_left` to 0 or `status` to `full` and the
   site shows "Full · waitlist".
3. **File → Share → Publish to web** → choose the sheet tab → **Comma-separated values (.csv)** → Publish.
4. Copy the link it gives you (it ends in `output=csv`).

## 2. Set up the forms (Formspree)

1. Sign up at formspree.io with the email where you want requests to arrive.
2. Create a new form. Copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
3. Both forms (seat requests and private events) can use the same endpoint; each email says which form it came from.
   The free plan covers 50 submissions a month.

## 3. Paste both links into the site

Open `index.html` in any text editor, find the SETTINGS block near the bottom, and fill in:

```js
const EVENTS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv";
const FORM_ENDPOINT  = "https://formspree.io/f/abcdwxyz";
```

Save. Until these are filled in, the site shows example dates and the forms won't send.

## 4. Upload the site (Netlify)

1. Sign up at netlify.com → **Add new site → Deploy manually**.
2. Drag the whole `pizzaomakase-site` folder onto the page. You get a temporary `something.netlify.app` address; test both forms there.
3. **Domain management → Add a domain** → `pizzaomakase.co.il` (and `www.pizzaomakase.co.il`).
4. Netlify shows the DNS records to add. Log in to the registrar where you bought the .co.il domain and add them
   (usually an A record for the bare domain and a CNAME for `www`). DNS can take a few hours to take effect.
5. HTTPS is issued automatically once DNS works.

## Updating later

- **New evening / sold out:** edit the Google Sheet. The site picks it up on the next page load (Google can take up to ~5 minutes to refresh the published CSV).
- **New pizza photos:** put the image in `images/`, change the matching `src` and caption in `index.html`, then drag the folder onto Netlify's **Deploys** page again.

## Taking payment with Morning (Green Invoice)

1. Sign up at greeninvoice.co.il on the **Best** plan or higher (payment links need it), and turn on
   digital payments (credit card + Bit). Morning issues a receipt automatically for every payment.
2. Create a **payment page / link** for each evening: name it with the date (e.g. "Pizza Omakase · Wed 14 Oct"),
   set the price per seat, and let the guest choose the number of seats if the option is offered.
   Ask for name, phone and email so you know who booked.
3. Copy each link into that evening's `pay_link`:
   - in `index.html`, the `EXAMPLE_EVENTS` list near the bottom, or
   - in the Google Sheet, a `pay_link` column, once the sheet is connected.
4. The button for that evening changes from **Reserve** to **Reserve & pay** and opens the Morning checkout.
   Evenings without a link keep the request form.
5. After each payment, lower `seats_left`. At 0 the button switches to **Join waitlist** and stops taking payment.

## Reviews page

- Guests leave a review on **reviews.html**. Each one is emailed to you through Web3Forms (same as the booking forms).
  Nothing appears on the site until you approve it.
- To publish reviews: add a tab called **Reviews** to your Google Sheet with these headers in row 1:

  | name | date | rating | review | approved |
  |---|---|---|---|---|

  Copy in the reviews you want to show, set `date` as YYYY-MM-DD and `rating` 1–5, and type `yes` under `approved`.
- Publish that tab (File → Share → Publish to web → Reviews tab → CSV) and paste the link into
  `REVIEWS_CSV_URL` at the bottom of **reviews.html**.

## Google reviews (Google Business Profile)

1. Go to business.google.com and create a profile for **Pizza Omakase** (category: *Pizza restaurant* or *Caterer*).
   Choose that you serve customers at their locations / have no storefront, so your address stays hidden,
   and list the areas you serve (Jaffa, Tel Aviv).
2. Add the website, photos of your pies, and a short description.
3. Once verified: profile → **Ask for reviews** → copy the link.
4. Paste it into `GOOGLE_REVIEW_URL` at the bottom of **reviews.html**. A **Review us on Google** button appears.
5. Send that link to guests the day after each evening.

## Search engines and AI assistants

Already built in: page titles and descriptions, link previews (WhatsApp, Facebook), structured data describing
Pizza Omakase, event listings generated from your evenings, `robots.txt`, `sitemap.xml`, and `llms.txt`
(a plain summary for AI assistants such as ChatGPT).

Once the site is live on **pizzaomakase.co.il**:
1. search.google.com/search-console → Add property → Domain → `pizzaomakase.co.il` → verify.
2. Sitemaps → submit `https://pizzaomakase.co.il/sitemap.xml`.
3. bing.com/webmasters → import from Google Search Console. (Bing results also power ChatGPT search and Copilot.)
4. Optional: add `price` (shekels) as a column in your evenings so Google can show it with each event.
