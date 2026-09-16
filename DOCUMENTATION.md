# Complete Product & Technical Documentation — Meesho Label Cropper

## 1. Product summary

Meesho Label Cropper is a browser-based utility for sellers who receive Meesho PDF documents containing a shipping label above a tax invoice. The primary job is to isolate the label area and place four labels on one A4 landscape sheet.

The source desktop version demonstrated the target behavior. The web version keeps that core behavior while adding public landing pages, SEO metadata, structured data, sitemap/robots, guide content and a deployment-ready Next.js structure.

## 2. Target workflow

1. Seller downloads a Meesho PDF.
2. Seller opens the public tool.
3. Seller selects or drags the PDF onto the page.
4. Browser reads the PDF text layer.
5. For each page, the code searches for `TAX INVOICE`.
6. The vertical position of the invoice heading defines the lower boundary of the label crop.
7. Detected label regions are shown in the interface.
8. Seller downloads an A4 landscape PDF.
9. Four labels are arranged in a 2 × 2 grid.
10. Any remaining labels continue onto additional A4 pages.

## 3. Why browser-side processing

The public version is designed so the source PDF is not uploaded to an application server for the core function. This reduces backend infrastructure, simplifies hosting and keeps normal shipping data on the user's device.

For a public utility, this also makes a strong privacy proposition: no account, no upload queue and no server-side file retention are required for label generation.

## 4. PDF detection algorithm

### 4.1 Text extraction

PDF.js reads the PDF and returns text items with transformation data.

### 4.2 TAX INVOICE detection

The implementation looks for a text item equal to or beginning with `tax invoice`, with a fallback to the complete page text when the heading is split differently.

### 4.3 Crop geometry

The source PDF page uses PDF coordinates. The detected invoice position is converted into a crop height from the top of the page. The crop bounding box is:

- left: 0
- right: original page width
- top: original page height
- bottom: original page height minus detected crop height

This keeps the full width while removing the invoice section.

## 5. A4 layout

Output page:

- A4 landscape
- width: 841.8898 pt
- height: 595.2756 pt
- two columns
- two rows
- four labels per page

The label is fitted inside each quadrant proportionally, so the label is not stretched.

## 6. PDF quality

The output uses pdf-lib `embedPage` with a clipping bounding box and `drawPage` for placement. This is preferable to taking screenshots of the label and inserting raster images because the PDF page content can remain vector-based.

## 7. Project structure

```text
app/
  blog/...
  components/LabelCropper.tsx
  a4-meesho-labels/page.tsx
  meesho-label-cropper/page.tsx
  meesho-label-with-invoice/page.tsx
  privacy/page.tsx
  terms/page.tsx
  contact/page.tsx
  layout.tsx
  page.tsx
  robots.ts
  sitemap.ts
  globals.css
lib/
  pdf-cropper.ts
  seo.ts
  site.ts
scripts/
  copy-pdf-worker.mjs
public/
package.json
next.config.ts
tsconfig.json
README.md
DOCUMENTATION.md
SEO-STRATEGY.md
DEPLOYMENT.md

```

## 8. Public SEO strategy

The project uses Next.js 16.3.4 and React 19.3.0. Current Next.js 16 documentation requires Node.js 20.9+; React 19.3 is the current React release. Pin these versions initially, then update deliberately with regression testing.


### 8.1 Competitor pattern studied

Quick Label Crop uses a keyword-focused information architecture: a general shipping-label page, dedicated Meesho pages, a Meesho-with-invoice variant, merge tools, contact/about/legal pages and blog posts. Its home page also links these tool pages internally. This is a useful structural idea for discoverability, but its wording is repetitive and some pages are very thin.

### 8.2 Improvements in this project

1. One clear primary intent per URL.
2. Server-rendered page content through Next.js, instead of relying only on a client-side app shell.
3. Unique title and meta description per page.
4. Canonical URLs.
5. Open Graph/Twitter metadata.
6. Semantic headings and crawlable `<a href>` navigation.
7. XML sitemap and robots.txt.
8. WebSite/WebPage/SoftwareApplication structured data.
9. Helpful guide pages that explain the actual workflow.
10. Internal links between the tool, A4 page, invoice-aware page and guides.
11. Privacy-first messaging because processing happens locally.
12. No fake reviews, fake ratings or unsupported claims.

## 9. Recommended keyword map

### Primary
- meesho label cropper
- meesho shipping label crop tool

### Secondary
- crop meesho shipping label pdf
- meesho label with invoice
- meesho label cropper online
- meesho labels 4 on a4
- print 4 meesho labels on a4
- meesho shipping label pdf crop

### Long-tail content ideas
- how to crop meesho labels from pdf
- how to print four meesho labels on a4
- meesho label above tax invoice
- A4 landscape meesho shipping label format
- meesho PDF label printer setup

Use these as topic targets, not as a reason to repeat the exact phrase unnaturally on every page.

## 10. URL architecture

```text
/
/meesho-label-cropper
/meesho-label-with-invoice
/a4-meesho-labels
/blog/meesho-label-cropper-a4
/blog/how-to-print-meesho-labels-4-on-a4
/blog/meesho-label-with-invoice-cropper
/privacy
/terms
/contact
```

## 11. Content rules

Each landing page should answer a distinct search intent. Avoid cloning one page and replacing only “Meesho” with another marketplace name. Add actual differences in instructions, supported source layout, output size, printing method and troubleshooting.

## 12. Technical SEO checklist

- [x] Descriptive page titles
- [x] Meta descriptions
- [x] Canonical URLs
- [x] Crawlable navigation
- [x] Sitemap
- [x] robots.txt
- [x] Semantic HTML
- [x] Structured data
- [x] Mobile responsive CSS
- [x] Noindex removed from public pages
- [ ] Connect production domain in `NEXT_PUBLIC_SITE_URL`
- [ ] Verify site in Google Search Console
- [ ] Submit sitemap in Search Console
- [ ] Add a real favicon and social share image
- [ ] Add a real support email and company identity
- [ ] Add consent-controlled analytics only if needed

## 13. Performance strategy

- Keep the PDF libraries out of the server-rendered landing page as much as possible.
- Load the PDF worker only for the tool workflow.
- Do not render full-resolution previews for every page unless a user asks for them.
- Keep images compressed and meaningful.
- Avoid unnecessary UI libraries for a utility site.
- Use production caching headers on static assets.
- Measure Core Web Vitals after deployment.

## 14. Security & privacy

The tool should continue to process files locally. Do not add an upload endpoint unless there is a strong product requirement.

If a backend is added later, implement:
- content-type validation
- file size limits
- malware scanning
- short retention windows
- randomized temporary file IDs
- HTTPS only
- no public file directory listings
- deletion after processing

Do not claim “files are never uploaded” if a future analytics or backend implementation changes that behavior.

## 15. Product roadmap

Phase 1 — current
- Meesho PDF input
- automatic TAX INVOICE detection
- A4 landscape 4-up
- local processing
- SEO pages

Phase 2
- preview thumbnails
- manual crop adjustment
- label spacing controls
- page-range selection
- download all individual labels as ZIP
- drag and reorder labels

Phase 3
- optional thermal label format
- optional A4 portrait mode
- Flipkart/Amazon dedicated tools
- merge PDF utility
- SKU-aware sorting
- print presets

Phase 4
- optional user accounts
- saved print presets
- usage dashboard
- paid bulk processing only if browser-only processing is no longer sufficient

## 16. Testing plan

Maintain sample PDFs for:
- one-page Meesho label with invoice
- multiple-page Meesho labels
- invoice heading on same line as “Original For Recipient”
- different font sizes
- missing invoice marker
- rotated PDFs
- unusually large whitespace
- pages with no order label

For every sample verify:
- detected label count
- label crop contains all barcode content
- invoice content is excluded
- output has exactly four slots per A4 page where applicable
- final page handles 1–3 remaining labels
- PDF opens in Adobe Acrobat/Chrome/Edge
- barcodes scan after printing

## 17. SEO monitoring

After deployment:
1. Add the domain to Google Search Console.
2. Submit `/sitemap.xml`.
3. Inspect the home page and each landing page.
4. Watch indexing and query impressions.
5. Add content based on actual search queries, not only guessed keywords.
6. Fix pages with impressions but low click-through rate by testing titles/descriptions.
7. Refresh guides when the Meesho PDF format changes.

## 18. Monetization options

The core tool should remain useful without an account. Potential monetization later includes unobtrusive advertising, sponsor placements, premium batch features, custom print presets or a paid seller utility suite. Avoid placing aggressive ads above the upload tool because that directly harms usability and can reduce trust.
