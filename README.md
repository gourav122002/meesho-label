# Meesho Label Cropper — Public React/Next.js Edition

A public, browser-first implementation of the working desktop behavior:
- Detect `TAX INVOICE` in Meesho PDF pages.
- Keep the shipping-label section above the invoice.
- Create A4 landscape output.
- Place 4 labels per page in a 2 × 2 layout.
- Preserve label proportions.
- Generate PDFs locally in the browser.

## Stack
- Next.js 16.3.4
- React 19.3.0
- TypeScript
- PDF.js (`pdfjs-dist`) for PDF text inspection
- pdf-lib for vector-preserving PDF clipping/placement

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Production build

```bash
npm run build
npm start
```

Set the production URL before build/deploy:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Important implementation note

The detection logic is optimized for the uploaded Meesho sample pattern: the shipping label is above a `TAX INVOICE` section. Marketplace PDF templates can change, so maintain a small regression test set of real seller PDFs before every production release.

## Privacy architecture

The application does not send the selected PDF to an API in the core workflow. The PDF is read, inspected and generated in the browser. If analytics, ads or server-side processing are added later, update the privacy policy and consent behavior.
