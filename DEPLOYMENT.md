# Deployment Guide

## Runtime requirement

Use Node.js 20.9 or newer for Next.js 16.

## Recommended: Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Set the environment variable:

```env
NEXT_PUBLIC_SITE_URL=https://your-real-domain.com
```

4. Deploy.
5. Open:
   - `/`
   - `/meesho-label-cropper`
   - `/meesho-label-with-invoice`
   - `/a4-meesho-labels`
   - `/sitemap.xml`
   - `/robots.txt`

## Alternative: Node server

```bash
npm install
npm run build
npm start
```

Use a reverse proxy such as Nginx and HTTPS in front of the Node process.

## Domain

Point DNS to your hosting provider and ensure the production `NEXT_PUBLIC_SITE_URL` exactly matches the canonical HTTPS domain you use.

## Search engine setup

After deployment:

1. Verify the domain in Google Search Console.
2. Submit `https://your-real-domain.com/sitemap.xml`.
3. Inspect the home page and all money/tool pages.
4. Request indexing for the most important URLs after the first production deployment.

## Analytics

Analytics are intentionally absent from the starter. Add them only after deciding what you actually need and updating privacy/consent language.

## AdSense

If you plan to monetize, keep the upload/crop workflow immediately usable. Put informational content and ads in areas that do not block the main tool. Do not publish thin AI-generated pages just to create ad inventory.
