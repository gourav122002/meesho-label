# 📊 Indian Marketplace Seller Profit Calculator — Project Documentation

> A free, browser-only profit & P&L suite for Indian marketplace sellers (Meesho, Amazon, Flipkart, Myntra).
> **Website:** `https://indianprofitcalculator.com`

---

## 🗂️ Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features & Pages](#features--pages)
5. [Components](#components)
6. [Library / Logic Modules](#library--logic-modules)
7. [Key Data Files](#key-data-files)
8. [SEO & Sitemap](#seo--sitemap)
9. [How to Run Locally](#how-to-run-locally)

---

## 🌐 Project Overview

This is a **Next.js 16 web application** built for Indian online sellers. It helps them understand their real profit after all marketplace fees, commissions, GST, and shipping charges. The entire computation happens **100% in the browser** — no data is uploaded to any server.

### What This App Does
| Tool | Purpose |
|---|---|
| **Meesho Profit Calculator** | Calculates profit with 0% commission + shipping fees + GST |
| **Amazon Profit Calculator** | Handles referral fees, closing fees, Easy Ship & FBA |
| **Flipkart Profit Calculator** | Commission, collection fee, fixed fee & tier calculations |
| **Myntra Profit Calculator** | Fashion & lifestyle seller margin calculations |
| **Meesho Payment Sheet Analyzer** | Upload Excel payment report → see true P&L, return rates, bad catalogs |
| **Bulk Profit Calculator** | Upload CSV/XLSX with 100s of SKUs and export results |
| **Label Auto Cropper** | Auto-crop Meesho shipping labels above the Tax Invoice line |
| **Amazon vs Meesho Comparison** | Side-by-side comparison page |

---

## 🛠️ Tech Stack

### Core Framework
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.3.3 | Full-stack React framework (App Router) |
| **React** | 19.2.8 | UI library |
| **TypeScript** | ^5 | Type safety |

### Styling
| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | ^4 | Utility-first CSS (PostCSS plugin) |
| **@tailwindcss/postcss** | ^4 | PostCSS integration for Tailwind v4 |
| **Custom CSS Variables** | — | Dark/light theme tokens in `globals.css` |
| **Google Fonts (Inter)** | — | Primary typeface via `next/font/google` |

### Key Libraries (Runtime)
| Library | Version | Purpose |
|---|---|---|
| **papaparse** | ^5.7.0 | CSV file parsing for bulk upload |
| **xlsx** | ^0.18.5 | Excel (.xlsx) file parsing for payment sheet analyzer |
| **recharts** | ^3.10.1 | Charts for profit visualization & category analysis |
| **@types/papaparse** | ^5.5.2 | TypeScript types for papaparse |

### Dev / Build Tools
| Tool | Version | Purpose |
|---|---|---|
| **ESLint** | ^9 | Code linting |
| **eslint-config-next** | 16.3.3 | Next.js-specific lint rules |
| **@types/node** | ^20 | Node.js TypeScript types |
| **@types/react** | ^19 | React TypeScript types |
| **@types/react-dom** | ^19 | ReactDOM TypeScript types |

---

## 📁 Project Structure

```
meesho profit calculator/
├── app/                          ← Next.js web application
│   ├── app/                      ← Next.js App Router pages
│   │   ├── layout.tsx            ← Root layout (Header, Footer, theme init)
│   │   ├── page.tsx              ← Home page (marketplace hub)
│   │   ├── globals.css           ← Global styles & CSS variables
│   │   ├── robots.ts             ← SEO robots.txt generator
│   │   ├── sitemap.ts            ← SEO XML sitemap generator
│   │   ├── favicon.ico           ← Site icon
│   │   ├── meesho-profit-calculator/     ← Meesho page
│   │   ├── amazon-profit-calculator/     ← Amazon page
│   │   ├── flipkart-profit-calculator/   ← Flipkart page
│   │   ├── myntra-profit-calculator/     ← Myntra page
│   │   ├── bulk-profit-calculator/       ← Bulk CSV/XLSX uploader
│   │   ├── amazon-vs-meesho/             ← Comparison page
│   │   └── meesho-payment-analyzer/      ← Payment sheet analyzer
│   │   └── meesho-label-cropper/         ← Label PDF cropper
│   │
│   ├── components/               ← Reusable React components
│   │   ├── layout/               ← Site-wide layout
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── calculators/          ← Shared calculator UI
│   │   │   ├── CalculatorForm.tsx
│   │   │   ├── FeeBreakdown.tsx
│   │   │   └── ResultCard.tsx
│   │   ├── charts/               ← Chart wrappers
│   │   │   └── ProfitChart.tsx
│   │   ├── meesho-analyzer/      ← Payment Sheet Analyzer UI
│   │   │   ├── UploadZone.tsx
│   │   │   ├── SummaryCards.tsx
│   │   │   ├── ProductTable.tsx
│   │   │   ├── ReturnAnalysis.tsx
│   │   │   ├── BadCatalogAlert.tsx
│   │   │   ├── CategoryChart.tsx
│   │   │   ├── ProfitChart.tsx
│   │   │   ├── InsightsPanel.tsx
│   │   │   └── ExportPanel.tsx
│   │   ├── seo/                  ← SEO helper components
│   │   ├── tables/               ← Data table components
│   │   └── upload/               ← File upload components
│   │
│   ├── lib/                      ← Business logic & utilities
│   │   ├── calculator/           ← Core calculation engine
│   │   │   ├── types.ts          ← TypeScript interfaces
│   │   │   ├── calculate.ts      ← Profit calculation logic
│   │   │   ├── normalize.ts      ← Input normalization
│   │   │   └── validation.ts     ← Form validation rules
│   │   ├── fees/                 ← Marketplace fee rules
│   │   │   ├── meesho.ts         ← Meesho fee structure
│   │   │   ├── amazon.ts         ← Amazon fee structure
│   │   │   ├── flipkart.ts       ← Flipkart fee structure
│   │   │   ├── myntra.ts         ← Myntra fee structure
│   │   │   └── versions.ts       ← Fee version tracking
│   │   ├── meesho-analyzer/      ← Payment sheet analysis engine
│   │   │   ├── types.ts          ← Data interfaces
│   │   │   ├── parser.ts         ← Excel payment sheet parser
│   │   │   ├── returnParser.ts   ← Return CSV parser
│   │   │   └── analyze.ts        ← P&L analysis logic
│   │   ├── spreadsheet/          ← Bulk spreadsheet utilities
│   │   └── seo/                  ← SEO metadata & schema
│   │
│   ├── public/                   ← Static assets
│   ├── package.json              ← Dependencies & scripts
│   ├── next.config.ts            ← Next.js config
│   ├── tsconfig.json             ← TypeScript config
│   ├── eslint.config.mjs         ← ESLint config
│   └── postcss.config.mjs        ← PostCSS / Tailwind config
│
├── 4367560_SP_ORDER_ADS_...xlsx  ← Sample Meesho payment Excel file
├── return sheet.csv              ← Sample return data CSV
├── Sub_Order_Labels_...pdf       ← Sample Meesho sub-order label PDF
├── meesho_labels_cropped.pdf     ← Cropped label output example
├── label_preview.png             ← Label preview screenshot
└── implementation_plan.md        ← Dev planning notes
```

---

## 🖥️ Features & Pages

### 1. 🏠 Home Page (`/`)
- Hero section with key stats
- Featured tool cards (Payment Analyzer, Label Cropper)
- Marketplace calculator grid (Meesho, Amazon, Flipkart, Myntra)
- Features highlight section (real-time, private, bulk, etc.)
- JSON-LD Organization schema for SEO

### 2. 🛍️ Meesho Profit Calculator (`/meesho-profit-calculator`)
- Input: selling price, product cost, weight, category
- Output: net profit, margin %, ROI, break-even price
- Fee breakdown: shipping fee, GST, platform fee (0% commission)

### 3. 📦 Amazon Profit Calculator (`/amazon-profit-calculator`)
- Referral fee by category
- Closing fee for media products
- Easy Ship vs FBA fee selection
- Full net profit & margin output

### 4. 🛒 Flipkart Profit Calculator (`/flipkart-profit-calculator`)
- Commission tiers by category
- Collection fee + fixed fee
- Shipping zone-based calculation

### 5. 👗 Myntra Profit Calculator (`/myntra-profit-calculator`)
- Fashion & lifestyle category commissions
- Seller margin calculation

### 6. 📊 Meesho Payment Sheet Analyzer (`/meesho-payment-analyzer`)
- **Upload:** Meesho supplier payment Excel (.xlsx)
- **Optionally Upload:** Return sheet CSV
- **Outputs:**
  - Overall P&L summary cards
  - Product-level profit table with sorting/filtering
  - Return analysis with RTO rates per product
  - Bad catalog alerts (products losing money)
  - Category-wise profit chart
  - Profit distribution chart
  - Insights panel with action recommendations
  - Export panel (download results as CSV/Excel)

### 7. 📁 Bulk Profit Calculator (`/bulk-profit-calculator`)
- Upload CSV or XLSX with multiple SKUs
- Batch calculates profit for all products
- Export results

### 8. ✂️ Meesho Label Auto Cropper (`/meesho-label-cropper`)
- Upload Meesho Sub Order Label PDFs
- Auto-detects "TAX INVOICE" line
- Crops only the shipping label portion above it
- Batch process, preview cut line, download individually or merged

### 9. ⚔️ Amazon vs Meesho Comparison (`/amazon-vs-meesho`)
- Side-by-side fee and profit comparison

---

## 🧩 Components

### Layout Components (`components/layout/`)
| File | Description |
|---|---|
| `Header.tsx` | Site navigation bar with marketplace links |
| `Footer.tsx` | Site footer with links and credits |
| `ThemeToggle.tsx` | Dark/light mode toggle button |

### Calculator Components (`components/calculators/`)
| File | Description |
|---|---|
| `CalculatorForm.tsx` | Shared input form for all marketplace calculators |
| `FeeBreakdown.tsx` | Renders itemized fee breakdown table |
| `ResultCard.tsx` | Displays profit result summary card |

### Meesho Analyzer Components (`components/meesho-analyzer/`)
| File | Description |
|---|---|
| `UploadZone.tsx` | Drag & drop / click-to-upload zone for Excel/CSV |
| `SummaryCards.tsx` | KPI cards (total revenue, profit, returns, etc.) |
| `ProductTable.tsx` | Sortable/filterable product-level data table |
| `ReturnAnalysis.tsx` | Return rate & RTO analysis per product |
| `BadCatalogAlert.tsx` | Alerts for loss-making product catalogs |
| `CategoryChart.tsx` | Recharts bar chart by product category |
| `ProfitChart.tsx` | Recharts profit distribution chart |
| `InsightsPanel.tsx` | AI-style actionable insights & recommendations |
| `ExportPanel.tsx` | CSV/Excel export functionality |

### Chart Components (`components/charts/`)
| File | Description |
|---|---|
| `ProfitChart.tsx` | Generic profit chart wrapper |

---

## 🧮 Library / Logic Modules

### Calculator Engine (`lib/calculator/`)
| File | Description |
|---|---|
| `types.ts` | TypeScript types: `CalculatorInput`, `CalculatorResult`, etc. |
| `calculate.ts` | Core profit calculation: `revenue - cost - fees = profit` |
| `normalize.ts` | Cleans and normalizes raw form input values |
| `validation.ts` | Validates inputs before calculation |

### Marketplace Fee Databases (`lib/fees/`)
| File | Description |
|---|---|
| `meesho.ts` | Meesho shipping slabs, GST tiers (0% commission model) |
| `amazon.ts` | Amazon referral % by category, closing fees, FBA/Easy Ship rates |
| `flipkart.ts` | Flipkart commission tiers, collection fees, fixed fees |
| `myntra.ts` | Myntra fashion category commission rates |
| `versions.ts` | Tracks fee rule version dates for accuracy |

### Meesho Payment Analyzer Engine (`lib/meesho-analyzer/`)
| File | Description |
|---|---|
| `types.ts` | Data interfaces: `PaymentRow`, `AnalysisResult`, `ProductSummary`, etc. |
| `parser.ts` | Parses Meesho Excel payment report (column detection, row mapping) |
| `returnParser.ts` | Parses return sheet CSV for RTO/return data |
| `analyze.ts` | Aggregates data: P&L per product, bad catalogs, insights |

### SEO (`lib/seo/`)
- Generates `<head>` metadata (title, description, OG tags)
- Generates JSON-LD structured data (Organization schema)

---

## 📂 Key Data Files (in Project Root)

| File | Description |
|---|---|
| `4367560_SP_ORDER_ADS_...xlsx` | Real Meesho payment export (Aug 2026) — used for testing |
| `return sheet.csv` | Return data CSV — used for testing the return analyzer |
| `Sub_Order_Labels_...pdf` | Sample Meesho sub-order label PDF for label cropper testing |
| `meesho_labels_cropped.pdf` | Output from label cropper — example of cropped label |
| `label_preview.png` | Screenshot of label preview functionality |

---

## 🔍 SEO & Sitemap

The app includes full SEO setup via Next.js App Router:

| Feature | Implementation |
|---|---|
| **Title & Meta Tags** | `lib/seo/metadata.ts` + per-page `export const metadata` |
| **Sitemap** | `app/sitemap.ts` → `/sitemap.xml` auto-generated |
| **Robots.txt** | `app/robots.ts` → `/robots.txt` auto-generated |
| **JSON-LD** | Organization schema injected on home page |
| **Domain** | `https://indianprofitcalculator.com` |

### Sitemap URLs & Priority
| URL | Priority | Change Freq |
|---|---|---|
| `/` | 1.0 | Monthly |
| `/meesho-payment-analyzer` | 0.95 | Weekly |
| `/meesho-profit-calculator` | 0.9 | Monthly |
| `/amazon-profit-calculator` | 0.9 | Monthly |
| `/flipkart-profit-calculator` | 0.9 | Monthly |
| `/myntra-profit-calculator` | 0.85 | Monthly |
| `/bulk-profit-calculator` | 0.8 | Monthly |
| `/amazon-vs-meesho` | 0.8 | Monthly |

---

## ▶️ How to Run Locally

```bash
# 1. Go into the app folder
cd "meesho profit calculator/app"

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# → App runs at http://localhost:3000

# 4. Build for production
npm run build
npm run start
```

### Environment Variables
| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://indianprofitcalculator.com` | Used in sitemap & metadata |

---

## 🎨 Design System

- **Theme:** Dark mode by default, toggleable to light mode
- **Font:** Inter (Google Fonts)
- **Colors:** CSS variables (`--bg-primary`, `--accent-purple`, `--text-primary`, etc.)
- **Glassmorphism:** `.glass-card` CSS class used throughout
- **Responsive:** CSS Grid with `auto-fit` / `minmax` for all layouts
- **Animations:** CSS transitions on hover states & theme switching

---

*Documentation generated: September 2026*
