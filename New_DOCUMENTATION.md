# ShipLabelTool — Full Project Documentation

> **Site:** https://www.shiplabeltool.com
> **Stack:** Next.js 16 · React 19 · TypeScript · pdf-lib · pdfjs-dist · Recharts · PapaParse
> **Last updated:** 2026-09-30

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack and Dependencies](#2-tech-stack-and-dependencies)
3. [Directory Structure](#3-directory-structure)
4. [App Pages (Routes)](#4-app-pages-routes)
5. [Components](#5-components)
6. [Library Modules (lib/)](#6-library-modules-lib)
7. [PDF Processing Pipeline](#7-pdf-processing-pipeline)
8. [Profit Calculator Pipeline](#8-profit-calculator-pipeline)
9. [SEO Architecture](#9-seo-architecture)
10. [Public Assets](#10-public-assets)
11. [Configuration Files](#11-configuration-files)
12. [Data Flow Diagrams](#12-data-flow-diagrams)
13. [Key Design Decisions](#13-key-design-decisions)

---

## 1. Project Overview

ShipLabelTool is a **100% browser-based** (no server upload, no sign-up) tool suite for Indian e-commerce sellers. It provides:

| Category | Tools |
|----------|-------|
| **Label Croppers** | Meesho, Flipkart, Amazon, Myntra — crop shipping labels from bulk PDFs |
| **A4 Layout Printers** | Arrange 4, 6, or 8 labels per A4 page (portrait or landscape) |
| **Profit Calculators** | Meesho, Flipkart, Amazon, Myntra — compute net profit after platform fees |
| **Bulk Calculator** | Multi-platform cross-comparison calculator |
| **Payment Analyzer** | Upload Meesho payment CSV, get an interactive analytics dashboard |
| **Blog** | SEO articles on label printing and profit calculation |

All PDF and CSV processing happens locally in the browser. No file data is ever sent to a server.

---

## 2. Tech Stack and Dependencies

### Runtime Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.3.4 | React framework, App Router, SSR metadata, sitemap |
| `react` | 19.3.0 | UI library |
| `react-dom` | 19.3.0 | DOM renderer |
| `pdfjs-dist` | 6.3.289 | Read and parse PDF files in-browser (text extraction, operator list) |
| `pdf-lib` | 1.17.1 | Create, modify, and embed PDF pages (cropping, layout generation) |
| `papaparse` | 5.7.0 | Parse Meesho payment CSV exports |
| `recharts` | 3.10.1 | Charts in the Payment Analyzer dashboard |
| `xlsx` | 0.18.5 | Excel export from the Payment Analyzer |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `typescript` | Static typing |
| `@types/react` | React type definitions |
| `@types/react-dom` | React DOM type definitions |
| `@types/node` | Node.js type definitions |
| `@types/papaparse` | PapaParse type definitions |

### npm Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run postinstall` | Auto-copies `pdf.worker.min.mjs` to `public/` after install |

---

## 3. Directory Structure

```
meesho-label-cropper-web/
|
+-- app/                              # Next.js App Router — all pages and layouts
|   +-- layout.tsx                    # Root layout: fonts, global nav, meta defaults
|   +-- page.tsx                      # Homepage (landing page, 14 KB)
|   +-- globals.css                   # Global CSS (103 KB) — all styling, no Tailwind
|   +-- robots.ts                     # /robots.txt generator
|   +-- sitemap.ts                    # /sitemap.xml generator
|   |
|   +-- components/                   # Shared React components
|   |   +-- HeaderNav.tsx             # Sticky top nav with dropdown menus (13.6 KB)
|   |   +-- LabelCropper.tsx          # Core PDF upload + crop + download widget (8.3 KB)
|   |   +-- PlatformSelector.tsx      # Platform tab switcher (4.8 KB)
|   |   +-- SeoJsonLd.tsx             # JSON-LD structured data injector (2.2 KB)
|   |   +-- ToolPageLayout.tsx        # Shared layout for all tool pages (2.9 KB)
|   |   |
|   |   +-- calculators/              # Profit calculator UI components
|   |   |   +-- CalculatorForm.tsx    # Input form: price, weight, category (7.0 KB)
|   |   |   +-- FeeBreakdown.tsx      # Itemized fee breakdown table (1.4 KB)
|   |   |   +-- ResultCard.tsx        # Net profit result card (2.3 KB)
|   |   |
|   |   +-- charts/                   # Recharts wrapper components
|   |   |
|   |   +-- meesho-analyzer/          # Payment Analyzer sub-components
|   |       +-- BadCatalogAlert.tsx   # Warning for products with no sales (5.4 KB)
|   |       +-- CategoryChart.tsx     # Revenue by category chart (8.6 KB)
|   |       +-- ExportPanel.tsx       # CSV/Excel export controls (8.0 KB)
|   |       +-- InsightsPanel.tsx     # Key insights summary (4.2 KB)
|   |       +-- ProductTable.tsx      # Sortable product data table (9.8 KB)
|   |       +-- ProfitChart.tsx       # Profit trend chart (6.4 KB)
|   |       +-- ReturnAnalysis.tsx    # Returns and refunds breakdown (8.5 KB)
|   |       +-- SummaryCards.tsx      # Top KPI metric cards (4.5 KB)
|   |       +-- UploadZone.tsx        # CSV drag-and-drop upload (8.8 KB)
|   |
|   +-- meesho-label-cropper/         # Route: /meesho-label-cropper
|   +-- flipkart-label-cropper/       # Route: /flipkart-label-cropper
|   +-- amazon-label-cropper/         # Route: /amazon-label-cropper
|   +-- myntra-label-cropper/         # Route: /myntra-label-cropper
|   +-- a4-meesho-labels/             # Route: /a4-meesho-labels
|   +-- meesho-label-with-invoice/    # Route: /meesho-label-with-invoice
|   |
|   +-- meesho-profit-calculator/     # Route: /meesho-profit-calculator
|   +-- flipkart-profit-calculator/   # Route: /flipkart-profit-calculator
|   |   +-- page.tsx
|   |   +-- FlipkartProfitClient.tsx
|   +-- amazon-profit-calculator/     # Route: /amazon-profit-calculator
|   +-- myntra-profit-calculator/     # Route: /myntra-profit-calculator
|   +-- bulk-profit-calculator/       # Route: /bulk-profit-calculator
|   |   +-- page.tsx
|   |   +-- BulkCalculatorClient.tsx
|   +-- amazon-vs-meesho/             # Route: /amazon-vs-meesho
|   |
|   +-- meesho-payment-analyzer/      # Route: /meesho-payment-analyzer
|   |
|   +-- blog/                         # Route: /blog/*
|   |   +-- meesho-label-cropper-a4/
|   |   +-- how-to-print-meesho-labels-4-on-a4/
|   |   +-- meesho-label-with-invoice-cropper/
|   |
|   +-- privacy/                      # Route: /privacy
|   +-- terms/                        # Route: /terms
|   +-- contact/                      # Route: /contact
|
+-- lib/                              # Pure TypeScript business logic (no React)
|   +-- pdf-cropper.ts                # PDF read, detect, crop, layout, download (core)
|   +-- site.ts                       # Global site constants
|   +-- seo.ts                        # SEO helper utilities
|   |
|   +-- calculator/                   # Platform fee calculation engine
|   |   +-- types.ts                  # Shared types: CalculatorInput, CalculatorResult
|   |   +-- calculate.ts              # Main calculation orchestrator
|   |   +-- normalize.ts              # Input normalization helpers
|   |   +-- validation.ts             # Input validation
|   |
|   +-- fees/                         # Platform-specific fee tables
|   |   +-- meesho.ts                 # Meesho commission and handling fee tables
|   |   +-- flipkart.ts               # Flipkart fee structure (category-based)
|   |   +-- amazon.ts                 # Amazon referral, closing, weight-handling fees
|   |   +-- myntra.ts                 # Myntra commission rates
|   |   +-- versions.ts               # Fee version history
|   |
|   +-- meesho-analyzer/              # Meesho payment CSV processing logic
|
+-- public/                           # Static assets served at /
|   +-- favicon.svg                   # Site favicon (224 B)
|   +-- og-image.png                  # Open Graph social image 1200x630 (474 KB)
|   +-- pdf.worker.min.mjs            # pdfjs-dist Web Worker (1.24 MB, auto-copied)
|
+-- scripts/
|   +-- copy-pdf-worker.mjs           # postinstall: copies PDF.js worker to public/
|
+-- next.config.ts                    # Next.js configuration
+-- tsconfig.json                     # TypeScript configuration
+-- package.json                      # Project metadata and dependencies
+-- AGENTS.md                         # AI agent instructions
+-- DEPLOYMENT.md                     # Deployment notes
+-- SEO-STRATEGY.md                   # SEO planning document
+-- README.md                         # Project readme
+-- DOCUMENTATION.md                  # This file
```

---

## 4. App Pages (Routes)

### Root Layout — `app/layout.tsx`

Applied to every page. Responsibilities:
- Default `<title>` and `<meta description>` via Next.js `metadata` export
- Google Fonts (Inter)
- `<HeaderNav>` (sticky navigation)
- Global container structure

---

### Homepage — `app/page.tsx` (14 KB)

**Route:** `/`

Contains: hero section, platform tool cards grid, features section, FAQ accordion, and full SEO metadata.

---

### Label Cropper Pages

All share the same pattern:

```
page.tsx -> <ToolPageLayout platform="X"> -> <LabelCropper> -> lib/pdf-cropper.ts
```

| Route | Brand Color | `platform` prop |
|-------|-------------|-----------------|
| `/meesho-label-cropper` | `#f43397` | `"meesho"` |
| `/flipkart-label-cropper` | `#2874F0` | `"flipkart"` |
| `/amazon-label-cropper` | `#FF9900` | `"amazon"` |
| `/myntra-label-cropper` | `#FF3F6C` | `"myntra"` |
| `/a4-meesho-labels` | — | `"meesho"` |
| `/meesho-label-with-invoice` | — | `"meesho"` |

Each page exports:
- `metadata` object — title, description, keywords, canonical, openGraph, twitter
- Default React Server Component that renders `<SeoJsonLd>` + `<ToolPageLayout>`

---

### Profit Calculator Pages

| Route | Client Component |
|-------|-----------------|
| `/meesho-profit-calculator` | inline in page.tsx |
| `/flipkart-profit-calculator` | `FlipkartProfitClient.tsx` |
| `/amazon-profit-calculator` | inline in page.tsx |
| `/myntra-profit-calculator` | inline in page.tsx |
| `/bulk-profit-calculator` | `BulkCalculatorClient.tsx` |
| `/amazon-vs-meesho` | inline in page.tsx |

---

### Payment Analyzer — `app/meesho-payment-analyzer/page.tsx`

**Route:** `/meesho-payment-analyzer`

Renders the Meesho CSV analytics dashboard. Composed of 9 sub-components (see Components section).

---

### Blog Pages — `app/blog/*/page.tsx`

Static long-form SEO articles. No interactive components.

| URL | Topic |
|-----|-------|
| `/blog/meesho-label-cropper-a4` | Guide to cropping Meesho labels on A4 |
| `/blog/how-to-print-meesho-labels-4-on-a4` | Step-by-step 4-up printing guide |
| `/blog/meesho-label-with-invoice-cropper` | Label + invoice cropper workflow |

---

### Static Pages

| Route | Purpose |
|-------|---------|
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/contact` | Contact form / info |

---

## 5. Components

### `HeaderNav.tsx` (13.6 KB)

Sticky top navigation bar. Dropdown menus: "Label Croppers", "Profit Calculators", "Tools". Mobile hamburger menu. Active-link highlighting.

---

### `LabelCropper.tsx` (8.3 KB) — Core Component

`"use client"` — main interactive PDF tool widget.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `platform` | `"meesho" or "flipkart" or "amazon"` | `"meesho"` | Selects PDF inspection function |

#### State

| Variable | Type | Description |
|----------|------|-------------|
| `file` | `File or null` | Uploaded PDF file |
| `labels` | `LabelRegion[]` | Detected label crop regions |
| `working` | `boolean` | True while PDF is being analyzed |
| `dragging` | `boolean` | True during drag-over |
| `message` | `string` | Success message |
| `error` | `string` | Error message |
| `selectedLayout` | `LabelsPerPage` | 4, 6, or 8 labels per A4 page |
| `downloadingFormat` | `string or null` | Active download button identifier |

#### Functions

| Function | Description |
|----------|-------------|
| `handleFileSelect(file)` | Validates PDF, runs inspection, sets `labels` state |
| `downloadA4()` | Creates multi-label A4 layout PDF, downloads it |
| `downloadIndividual()` | Creates one thermal PDF per label, downloads all |

#### UI Sections

1. **Drop Zone** — drag-and-drop or click to upload PDF
2. **Alerts** — error / success messages below drop zone
3. **Layout Chooser** — 3 cards: 4-up (Recommended), 6-up (Most Popular), 8-up (Max Savings)
4. **Download Buttons** — "Download Shipping Label PDF" + "Download Thermal 4x6 Labels"

---

### `ToolPageLayout.tsx` (2.9 KB)

Generic page shell for all tool pages.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Platform display name |
| `tagline` | `string` | Hero subtitle |
| `color` | `string` | Platform brand hex color |
| `icon` | `React.ReactNode` | SVG icon |
| `heading` | `string` | Page h1 |
| `subtext` | `string` | Sub-heading |
| `benefits` | `{emoji, title, desc}[]` | 3 benefit cards |
| `faqs` | `{q, a}[]` | FAQ accordion items |
| `platform` | `Platform` (optional) | Forwarded to `<LabelCropper>` |

#### Structure

```
<main>
  <section.tp-hero>          dark hero: icon + h1 + subtext
  <section.tp-tool-area>     <LabelCropper platform={platform} />
  <section.tp-seo-section>   3 benefit cards
  <section>                  FAQ <details>/<summary> accordion
</main>
```

---

### `SeoJsonLd.tsx` (2.2 KB)

Injects `<script type="application/ld+json">` with WebApplication structured data. Schema includes `name`, `description`, `url`, `applicationCategory`, `operatingSystem`, and `offers: { price: "0" }`.

---

### `PlatformSelector.tsx` (4.8 KB)

Tab switcher for multi-platform pages. Switches between Meesho / Flipkart / Amazon contexts.

---

### Calculator Components (`components/calculators/`)

| File | Role |
|------|------|
| `CalculatorForm.tsx` | Input fields: price, cost, weight, category, dimensions |
| `FeeBreakdown.tsx` | Line-item table: commission %, shipping, GST |
| `ResultCard.tsx` | Net profit, margin %, break-even price |

---

### Meesho Analyzer Components (`components/meesho-analyzer/`)

| File | Role |
|------|------|
| `UploadZone.tsx` | CSV drag-and-drop upload, validation, parse trigger |
| `SummaryCards.tsx` | 4 KPI metric cards |
| `ProfitChart.tsx` | Recharts profit trend line chart |
| `CategoryChart.tsx` | Recharts revenue by category |
| `ProductTable.tsx` | Sortable, filterable data table with pagination |
| `ReturnAnalysis.tsx` | Return rate breakdown by product and reason |
| `InsightsPanel.tsx` | Auto-generated textual insights |
| `ExportPanel.tsx` | Download as CSV or Excel |
| `BadCatalogAlert.tsx` | Alert for zero-sales products |

---

## 6. Library Modules (lib/)

### `lib/pdf-cropper.ts` — Core Library

The entire PDF processing engine. All functions are async and run in the browser via dynamic imports.

#### Types

```typescript
type LabelRegion = {
  pageIndex: number;   // 0-based page index in source PDF
  pageWidth: number;   // viewport width in pts at scale=1
  pageHeight: number;  // viewport height in pts at scale=1
  cropHeight: number;  // viewport-Y (top-down) of the cut/crop line
  orderNo?: string;    // extracted order number (optional)
};

type LabelsPerPage = 4 | 6 | 8;
type PageOrientation = "portrait" | "landscape";
```

#### All Exported Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `inspectMeeshoPdf` | `(file) => Promise<LabelRegion[]>` | Text-based detection: finds "Tax Invoice" text to locate crop boundary |
| `detectDottedLineY` | `(file, pageIndex) => Promise<number or null>` | Graphical detection: scans operator list for dashed horizontal lines |
| `createA4Pdf` | `(file, labels, labelsPerPage, orientation) => Promise<Uint8Array>` | Multi-label A4 grid layout PDF |
| `createA4LandscapePdf` | `(file, labels, labelsPerPage) => Promise<Uint8Array>` | Landscape A4 shorthand |
| `createIndividualLabelPdf` | `(file, label) => Promise<Uint8Array>` | Single label as individual PDF |
| `createCroppedLabelsPdf` | `(file, labels) => Promise<Uint8Array>` | All labels merged into one PDF |
| `downloadBytes` | `(bytes, filename) => void` | Browser file download via Blob URL |

#### A4 Layout System

Two lookup tables drive the grid:

**Portrait (`LAYOUT_MAP_PORTRAIT`):**

| Labels/Page | Grid | Rotation |
|-------------|------|----------|
| 4 | 2 x 2 | 90 degrees |
| 6 | 2 x 3 | None |
| 8 | 2 x 4 | None |

**Landscape (`LAYOUT_MAP_LANDSCAPE`):**

| Labels/Page | Grid | Rotation |
|-------------|------|----------|
| 4 | 2 x 2 | None |
| 6 | 3 x 2 | 90 degrees |
| 8 | 4 x 2 | 90 degrees |

A4 = 595.2756 x 841.8898 pt (portrait). Cell = (PAGE_W - 2*12 - 8*(COLS-1)) / COLS.

#### `detectDottedLineY` — Algorithm

1. `page.getOperatorList()` — raw PDF instruction stream
2. Track CTM through `save`/`restore`/`transform` ops
3. Monitor `setDash` (code 6) — `isDashed = true` when dash array is non-empty
4. For each `moveTo` then `lineTo` pair while dashed:
   - Apply CTM: transform local coords to page space
   - Horizontal check: `dy < 3 pts`
   - Width check: `dx >= pageWidth * 0.4` (spans 40%+ of page)
   - If passes: convert PDF Y (bottom-up) to viewport Y (top-down), add to candidates
5. Return **median** of candidates (rejects stray dashes)
6. Return `null` if no line found

**PDF.js OPS codes (pdfjs-dist 6.3.289):**

| OPS Name | Code |
|----------|------|
| `setDash` | 6 |
| `save` | 10 |
| `restore` | 11 |
| `transform` | 12 |
| `moveTo` | 13 |
| `lineTo` | 14 |
| `stroke` | 20 |
| `closeStroke` | 21 |

---

### `lib/site.ts`

```typescript
export const siteUrl = "https://www.shiplabeltool.com";
export const siteName = "ShipLabelTool";
export const defaultTitle = "Shipping Label Cropper – Meesho, Flipkart & Amazon A4 Label Tool";
export const defaultDescription = "Free online tool to crop...";
```

---

### `lib/calculator/` — Fee Calculation Engine

| File | Role |
|------|------|
| `types.ts` | `CalculatorInput`, `CalculatorResult`, `FeeBreakdown` interfaces |
| `calculate.ts` | Orchestrator: calls correct fee module, computes net profit |
| `normalize.ts` | Input normalization (trim, parse numbers, default values) |
| `validation.ts` | Input validation (price > 0, weight > 0, etc.) |

---

### `lib/fees/` — Platform Fee Tables

| File | Contents |
|------|----------|
| `meesho.ts` | Commission % by category, handling fee |
| `flipkart.ts` | Category commission, weight-based shipping tiers |
| `amazon.ts` | Referral %, closing fee, weight handling by tier |
| `myntra.ts` | Commission % by category |
| `versions.ts` | Fee table version history with effective dates |

---

## 7. PDF Processing Pipeline

### Upload to Detect to Layout to Download

```
User drops / selects PDF
        |
        v
handleFileSelect(file)                       [LabelCropper.tsx]
        |
        +-- platform === "flipkart" --> inspectFlipkartPdf(file)
        +-- platform === "meesho"  --> inspectMeeshoPdf(file)   [pdf-cropper.ts]
                                           |
                        +------------------+
                        |  For each page:
                        |  1. pdfjs.getTextContent()
                        |  2. Find "Tax Invoice" text marker
                        |  3. viewport.convertToViewportPoint() -> Y coord
                        |  4. Push LabelRegion { pageIndex, cropHeight, ... }
                        v
                  labels: LabelRegion[]  stored in React state

User clicks "Download Shipping Label PDF"
        |
        v
downloadA4() -> createA4Pdf(file, labels, selectedLayout, "portrait")
        |  For each batch of labelsPerPage:
        |  1. output.addPage([A4_W, A4_H])
        |  2. sourceDoc.embedPage(sourcePage, { bottom, top })
        |  3. page.drawPage(embedded, { x, y, width, height, rotate? })
        v
  Uint8Array -> downloadBytes(bytes, filename) -> browser saves

User clicks "Download Thermal 4x6 Labels"
        |
        v
downloadIndividual() -> for each label: createIndividualLabelPdf(file, label)
        |  1. embedPage (bottom = pageH - cropHeight)
        |  2. addPage([embedded.width, embedded.height])
        |  3. drawPage at (0, 0) -- exact label dimensions
        v
  One PDF per label -> downloadBytes each
```

---

### Coordinate System

PDF.js (read) and pdf-lib (write) use opposite coordinate systems:

| System | Origin | Y Direction | Used By |
|--------|--------|-------------|---------|
| PDF user space | Bottom-left | Upward | pdf-lib `embedPage` |
| Viewport (scale=1) | Top-left | Downward | pdfjs text/operator positions |

Conversion (scale=1, no rotation):

```
viewportY = pageHeight - pdfY
pdfY      = pageHeight - viewportY
```

In `createA4Pdf` and `createCroppedLabelsPdf`:
```typescript
const top    = pageSize.height;              // PDF-space page top
const bottom = pageSize.height - cropHeight; // PDF-space Y of cut line
// cropHeight is viewport-Y, so subtraction gives correct PDF-space coordinate
```

---

## 8. Profit Calculator Pipeline

```
User enters: price, cost, weight, category, platform
        |
        v
CalculatorForm.tsx (onChange)
        |
        v
calculate(input)                            [lib/calculator/calculate.ts]
        |
        +--> getFees(platform, category, weight)    [lib/fees/{platform}.ts]
        |         returns: { commission, shipping, handlingFee }
        |
        +--> GST on platform fees
        +--> netProfit = sellingPrice - productCost - totalFees
        |
        v
CalculatorResult -> FeeBreakdown.tsx + ResultCard.tsx
```

---

## 9. SEO Architecture

### Per-Page Metadata

Every page exports a Next.js `metadata` object:

| Field | Notes |
|-------|-------|
| `title` | Unique, keyword-rich, under 60 characters |
| `description` | Unique, compelling, under 160 characters |
| `keywords` | 5-8 targeted keywords per page |
| `alternates.canonical` | Absolute URL (prevents duplicate content) |
| `openGraph` | title, description, `/og-image.png`, url, type, locale |
| `twitter` | `summary_large_image` card with title, description, image |

### Structured Data — `<SeoJsonLd>`

Injects WebApplication JSON-LD on every tool page:

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web Browser",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
}
```

### Sitemap Priorities — `app/sitemap.ts`

| Page Type | Priority | Frequency |
|-----------|----------|-----------|
| Homepage | 1.0 | weekly |
| Label cropper tools | 0.9 | weekly |
| Calculator pages | 0.9 - 0.95 | monthly |
| Blog articles | 0.7 | monthly |
| Static pages | 0.3 | yearly |

### Robots — `app/robots.ts`

Allows all crawlers, links to sitemap URL.

---

## 10. Public Assets

| File | Size | Purpose |
|------|------|---------|
| `public/favicon.svg` | 224 B | Browser tab icon |
| `public/og-image.png` | 474 KB | Social preview image (1200 x 630 px) |
| `public/pdf.worker.min.mjs` | 1.24 MB | pdfjs-dist Web Worker (auto-copied) |

`pdf.worker.min.mjs` is required by PDF.js for in-browser PDF parsing. It must be served from the same origin. Worker path is set in `lib/pdf-cropper.ts`:

```typescript
mod.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
```

The `scripts/copy-pdf-worker.mjs` postinstall script copies it from `node_modules/pdfjs-dist/legacy/build/` to `public/` automatically after each `npm install`.

---

## 11. Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Minimal Next.js config. No custom webpack or rewrites. |
| `tsconfig.json` | TypeScript: strict mode, ES2017 target, bundler resolution, `@/*` path alias |
| `package.json` | Project name: `meesho-label-cropper`, version: 1.0.0 |
| `AGENTS.md` | AI agent instruction: read Next.js docs from node_modules before writing code |
| `DEPLOYMENT.md` | Production deployment steps and notes |
| `SEO-STRATEGY.md` | Keyword research, target pages, content strategy |

---

## 12. Data Flow Diagrams

### Label Cropper Data Flow

```
+-----------------------------------------------------------+
|                  Browser (Client Side Only)               |
|                                                           |
|  User drops PDF                                           |
|       |                                                   |
|       v                                                   |
|  LabelCropper.tsx                                         |
|       | file.arrayBuffer() -> memory                      |
|       |                                                   |
|  inspectMeeshoPdf()    or    detectDottedLineY()          |
|  Text-based detection        Graphical detection          |
|  pdfjs getTextContent()      pdfjs getOperatorList()      |
|  Find "Tax Invoice"          Scan setDash + lineTo ops    |
|  -> cropHeight (viewport Y)  -> median candidate Y        |
|       |                             |                     |
|       +-----------------------------+                     |
|                    |                                      |
|             LabelRegion[]                                 |
|   { pageIndex, cropHeight, pageWidth, pageHeight }        |
|                    |                                      |
|        +-----------+-----------+                         |
|        v           v           v                         |
|  createA4Pdf  createIndividual  createCroppedLabelsPdf   |
|  (pdf-lib)    LabelPdf          (pdf-lib)                |
|        |      (pdf-lib)         |                         |
|        +-----------+-----------+                         |
|                    |                                      |
|            downloadBytes()                                |
|            Blob URL -> <a download> -> click              |
|                    v                                      |
|            User Downloads Folder                          |
+-----------------------------------------------------------+
```

### Component Hierarchy

```
app/layout.tsx
+-- <HeaderNav>
+-- {page children}
    +-- flipkart-label-cropper/page.tsx
        +-- <SeoJsonLd path="/flipkart-label-cropper" />
        +-- <ToolPageLayout platform="flipkart">
            +-- [hero: icon, h1, subtext]
            +-- <LabelCropper platform="flipkart">
            |   +-- [drop zone]
            |   +-- [layout cards: 4-up / 6-up / 8-up]
            |   +-- [download buttons]
            +-- [3 benefit cards]
            +-- [FAQ accordion]
```

---

## 13. Key Design Decisions

### 1. 100% Browser-Based Processing

All PDF and CSV parsing runs on the client using Web Workers (PDF.js) and ArrayBuffer. No file data ever leaves the device. This is the core privacy promise and a major competitive differentiator.

### 2. No CSS Framework

`globals.css` (~103 KB, hand-written Vanilla CSS). Avoids Tailwind build complexity. Full control over design system, animations, and responsive behavior.

### 3. Two-Stage PDF Detection Strategy

- **Text-based** (`inspectMeeshoPdf`): finds "Tax Invoice" text — fast and reliable for Meesho PDFs
- **Graphical** (`detectDottedLineY`): scans operator list for dashed vector lines — accurate for Flipkart PDFs where the separator is a drawn line, not text

### 4. Shared `LabelCropper` with `platform` Prop

One component handles all platforms via a `platform` prop. Keeps the UI DRY while routing to the correct detection function per platform.

### 5. `pdf-lib` for Output, `pdfjs-dist` for Input

These two libraries are complementary:
- `pdfjs-dist` — reading only (text extraction, operator list)
- `pdf-lib` — writing only (create PDFs, embed pages, layout grid)

They are never interchangeable.

### 6. CTM Tracking in `detectDottedLineY`

The detector tracks the Current Transformation Matrix (CTM) through all `save`/`restore`/`transform` ops before applying it to path coordinates. Ensures correct results even for PDFs with nested transforms.

### 7. Median for Dotted Line Detection

Multiple dashed line candidates are filtered by returning the median Y, not min/max. This discards stray dashes in decorative borders, headers, or footers.

### 8. postinstall Script for PDF Worker

`scripts/copy-pdf-worker.mjs` auto-copies the PDF.js worker to `public/` after every `npm install`. The worker stays in sync with the installed pdfjs-dist version without any manual developer action.

---

*End of documentation.*
*See `DEPLOYMENT.md` for deployment instructions.*
*See `SEO-STRATEGY.md` for SEO keyword strategy.*
