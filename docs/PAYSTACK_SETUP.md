# Paystack store setup

The store sells digital products directly through Paystack instead of Gumroad.
Nothing goes live until you complete every step below — products ship in the
migration as **inactive with a zero price**, and an inactive product cannot be
bought.

> ### ⚠️ Read this before running any command
>
> **Every Supabase command starts with `npx`, and must be run from the project
> folder** (`C:\WORK DOCS\portfolio\the-portfolio`).
>
> ```
> supabase login       ✗  "The term 'supabase' is not recognized"
> npx supabase login   ✓
> ```
>
> The CLI is installed as a dev dependency of this project, not system-wide, so
> there is no global `supabase` command — that is expected, not a broken
> install. `npx` locates it by searching upward from your current directory,
> which is why the project folder matters.

## How it works

```
Browser                Edge Function            Paystack
  │  slug + email  ──▶  paystack-initialize
  │                     (looks up real price)  ──▶  transaction/initialize
  │  ◀── redirect to Paystack checkout ─────────────┘
  │
  │  pays on Paystack's own page
  │
  │  ◀── redirect to /checkout/success?reference=…
  │  reference     ──▶  paystack-verify   ──▶  transaction/verify
  │  ◀── signed download URL (24h)
                        paystack-webhook  ◀──  charge.success
                        (marks paid, emails link)
```

Two rules this design enforces:

1. **The browser never sends a price.** It sends a product slug; the amount is
   read from the `products` table inside the Edge Function. A tampered request
   cannot change what gets charged.
2. **The webhook is what grants fulfilment**, not the redirect. If the customer
   closes the tab mid-payment, they still get their download by email.

## 1. Install and link the Supabase CLI

The Supabase CLI **cannot be installed globally with npm** — `npm install -g
supabase` fails by design. It is installed as a dev dependency of this project
instead (already in `package.json`), so run it with `npx` from the project root:

```bash
npm install
```

Every command below is prefixed with `npx` for this reason. Verify it works:

```bash
npx supabase --version
```

Sign in (this opens a browser to authorise the CLI):

```bash
npx supabase login
```

Then link this folder to your project. The project ref is the subdomain of your
Supabase URL — for `https://abcdefgh.supabase.co` it is `abcdefgh`:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

## 2. Apply the database migration

```bash
npx supabase db push
```

This creates `products`, `orders`, and the private `product-files` storage
bucket.

## 3. Set the server-side secrets

**Do not put these in `.env`, in any `VITE_` variable, or in this repo.** They
are set directly on Supabase and are only readable by your Edge Functions:

```bash
npx supabase secrets set PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxx
```

```bash
npx supabase secrets set SITE_URL=https://www.jaymthethwa.co.za
```

`SITE_URL` must be the exact origin the browser reports — scheme, `www.`, and
**no trailing slash**. It is both the post-payment redirect target and the
allowed CORS origin, so a mismatch blocks every checkout in the browser. (The
functions strip trailing slashes defensively, but keep it clean anyway.)

Optional, to enable the confirmation email (without it, buyers still get the
on-screen download link):

```bash
npx supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx STORE_FROM_EMAIL="Jay <store@yourdomain.com>"
```

Start with your **test** key (`sk_test_…`) and switch to live only after a full
test purchase works.

## 4. Deploy the Edge Functions

The webhook must be deployed with `--no-verify-jwt`, because Paystack calls it
directly and has no Supabase session. Its own signature check is what secures
it.

```bash
npx supabase functions deploy paystack-initialize
```

```bash
npx supabase functions deploy paystack-verify
```

```bash
npx supabase functions deploy paystack-webhook --no-verify-jwt
```

## 5. Upload the product files and set real prices

Upload each product to the **private** `product-files` bucket (Supabase
Dashboard → Storage → `product-files`), naming them to match `storage_path`:
`handbook.pdf`, `playbook.pdf`, `notion-os.pdf`.

> Do not put paid files in `public/` — anything in that folder is downloadable
> by anyone who guesses the URL, with no payment required.

Then set the real prices. `price_cents` is in **cents**, so R149.00 is `14900`:

```sql
UPDATE products SET price_cents = 14900, active = true WHERE slug = 'handbook';
UPDATE products SET price_cents = 19900, active = true WHERE slug = 'playbook';
UPDATE products SET price_cents =  9900, active = true WHERE slug = 'notion-os';
```

Until a product is `active` with a non-zero price, its card keeps showing the
existing "Get on Gumroad" button. That is the intended fallback — you can
migrate one product at a time.

## 6. Register the webhook

In the Paystack Dashboard → **Settings → API Keys & Webhooks**, set the webhook
URL to:

```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/paystack-webhook
```

## 7. Test before going live

With your **test** secret key set, buy a product using a
[Paystack test card](https://paystack.com/docs/payments/test-payments/). Confirm:

- [ ] the card shows "Buy for R…" instead of the Gumroad button
- [ ] checkout redirects to Paystack and back to `/checkout/success`
- [ ] the download link works, and the file is the right one
- [ ] the `orders` row shows `status = 'paid'`
- [ ] the confirmation email arrives (if Resend is configured)
- [ ] visiting `/checkout/success?reference=made-up-value` shows an error and
      hands over no file

Only then swap in `sk_live_…` and repeat with one real purchase.

## Currency

Everything defaults to **ZAR**. To sell in another currency, change the
`currency` column on `products` — the Edge Function passes it through to
Paystack, and the storefront formats whatever it is told. Your Paystack account
must be enabled for that currency.
