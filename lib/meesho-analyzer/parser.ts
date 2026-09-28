import * as XLSX from 'xlsx';
import type { MeeshoOrderRow, MeeshoAdDeduction, ParseResult } from './types';

// ─── Clean Header Normalizer ────────────────────────────────────────────────
function normalizeHeader(h: unknown): string {
  return String(h || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Master Column Map (All keys are strictly normalized: lowercase, a-z0-9, space separated) ──
const HEADER_MAP: Record<string, string> = {
  // Sub Order No / Order ID
  'sub order no': 'subOrderNo',
  'sub order id': 'subOrderNo',
  'suborderid': 'subOrderNo',
  'sub order number': 'subOrderNo',
  'sub order': 'subOrderNo',
  'order id': 'orderId',
  'orderid': 'orderId',
  'order no': 'orderId',

  // Order Date & Dates
  'order date': 'orderDate',
  'orderdate': 'orderDate',
  'dispatch date': 'dispatchDate',
  'dispatchdate': 'dispatchDate',
  'payment date': 'paymentDate',
  'paymentdate': 'paymentDate',

  // Product / SKU / Catalog
  'product name': 'productName',
  'productname': 'productName',
  'item name': 'productName',
  'supplier sku': 'sku',
  'sku': 'sku',
  'sku id': 'sku',
  'product sku': 'sku',
  'catalog id': 'catalogId',
  'catalogid': 'catalogId',
  'catalog': 'catalogId',

  // Order Source / Status
  'order source': 'orderSource',
  'ordersource': 'orderSource',
  'live order status': 'liveOrderStatus',
  'order status': 'liveOrderStatus',
  'status': 'liveOrderStatus',
  'return status': 'liveOrderStatus',

  // Price & Quantity
  'product gst': 'productGstPct',
  'product gst pct': 'productGstPct',
  'listing price incl taxes': 'listingPrice',
  'listing price': 'listingPrice',
  'selling price': 'listingPrice',
  'price': 'listingPrice',
  'quantity': 'quantity',
  'qty': 'quantity',
  'transaction id': 'transactionId',

  // Payout & Settlement
  'final settlement amount': 'finalSettlementAmount',
  'settlement amount': 'finalSettlementAmount',
  'net payout': 'finalSettlementAmount',
  'payout': 'finalSettlementAmount',
  'amount credited': 'finalSettlementAmount',

  // Sale Amounts
  'price type': 'priceType',
  'total sale amount incl shipping gst': 'totalSaleAmount',
  'total sale amount': 'totalSaleAmount',
  'total sale return amount incl shipping gst': 'totalSaleReturnAmount',
  'total sale return amount': 'totalSaleReturnAmount',

  // Deductions & Charges
  'fixed fee incl gst': 'fixedFee',
  'fixed fee': 'fixedFee',
  'warehousing fee inc gst': 'warehousingFee',
  'warehousing fee incl gst': 'warehousingFee',
  'warehousing fee': 'warehousingFee',
  'return premium incl gst': 'returnPremium',
  'return premium incl gst of return': 'returnPremiumReturn',
  'return premium': 'returnPremium',
  'meesho commission percentage': 'meeshoCommissionPct',
  'meesho commission incl gst': 'meeshoCommission',
  'meesho commission': 'meeshoCommission',
  'meesho gold platform fee incl gst': 'goldPlatformFee',
  'meesho mall platform fee incl gst': 'mallPlatformFee',
  'return shipping charge incl gst': 'returnShippingCharge',
  'return shipping charge': 'returnShippingCharge',
  'return shipping': 'returnShippingCharge',
  'gst compensation prp shipping': 'gstCompensation',
  'shipping charge incl gst': 'shippingCharge',
  'shipping charge': 'shippingCharge',
  'shipping charges': 'shippingCharge',
  'other support service charges excl gst': 'otherCharges',
  'waivers excl gst': 'waivers',
  'net other support service charges excl gst': 'netOtherCharges',
  'gst on net other support service charges': 'gstOnOtherCharges',

  // Taxes & Claims
  'tcs': 'tcs',
  'tds rate': 'tdsRate',
  'tds': 'tds',
  'compensation': 'compensation',
  'claims': 'claims',
  'recovery': 'recovery',
  'compensation reason': 'compensationReason',
  'claims reason': 'claimsReason',
  'recovery reason': 'recoveryReason',
};

function detectHeaders(headerRow: unknown[]): Record<number, string> {
  const colMap: Record<number, string> = {};
  if (!Array.isArray(headerRow)) return colMap;

  headerRow.forEach((cell, idx) => {
    if (cell == null) return;
    const norm = normalizeHeader(cell);
    if (!norm) return;

    // 1. Direct lookup
    if (HEADER_MAP[norm]) {
      colMap[idx] = HEADER_MAP[norm];
      return;
    }

    // 2. Exact match substring lookup
    for (const [pattern, targetKey] of Object.entries(HEADER_MAP)) {
      if (norm === pattern || norm.startsWith(pattern) || pattern.startsWith(norm)) {
        if (!Object.values(colMap).includes(targetKey)) {
          colMap[idx] = targetKey;
          break;
        }
      }
    }
  });

  return colMap;
}

function parseNum(val: unknown): number {
  if (val == null || val === '' || val === '-') return 0;
  const s = String(val).replace(/[₹,\s]/g, '');
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function parseDate(val: unknown): Date | null {
  if (val == null || val === '') return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }
  if (typeof val === 'number') {
    const d = XLSX.SSF.parse_date_code(val);
    if (d) return new Date(d.y, d.m - 1, d.d, d.H || 0, d.M || 0, d.S || 0);
  }
  const s = String(val).trim();
  if (!s) return null;

  // Formats like "2026-07-26 14:59:50" or "2026-07-26"
  const iso = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (iso) {
    const [, y, m, d, hh, mm, ss] = iso;
    return new Date(Number(y), Number(m) - 1, Number(d), Number(hh || 0), Number(mm || 0), Number(ss || 0));
  }

  // DD-MM-YYYY
  const dmy = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmy) {
    const [, d, m, y] = dmy;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  const parsed = new Date(s);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// ─── Main sheet parser ───────────────────────────────────────────────────────
export async function parseMeeshoSheet(file: File): Promise<ParseResult> {
  const warnings: string[] = [];
  let skippedRows = 0;

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: false });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    return {
      orderRows: [],
      adsDeductions: [],
      warnings: ['File is empty or contains no valid worksheets.'],
      skippedRows: 0,
      selectedSheetName: '',
      detectedHeaders: {},
    };
  }

  // 1. Find the Order Payments sheet
  let orderSheetName = '';
  // Priority 1: Match sheet name with order/payment keywords
  for (const name of workbook.SheetNames) {
    const lower = name.toLowerCase();
    if (lower.includes('order payments') || lower.includes('orders') || lower.includes('payment')) {
      if (!lower.includes('referral') && !lower.includes('ads') && !lower.includes('disclaimer')) {
        orderSheetName = name;
        break;
      }
    }
  }

  // Priority 2: Pick sheet with most rows that isn't Disclaimer
  if (!orderSheetName) {
    let maxRows = 0;
    for (const name of workbook.SheetNames) {
      if (name.toLowerCase().includes('disclaimer')) continue;
      const ws = workbook.Sheets[name];
      const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false });
      if (raw.length > maxRows) {
        maxRows = raw.length;
        orderSheetName = name;
      }
    }
  }

  // Fallback to first sheet
  if (!orderSheetName) {
    orderSheetName = workbook.SheetNames[0];
  }

  const orderSheet = workbook.Sheets[orderSheetName];
  const rawOrders: unknown[][] = XLSX.utils.sheet_to_json(orderSheet, {
    header: 1,
    defval: '',
    raw: false,
  }) as unknown[][];

  if (rawOrders.length < 2) {
    warnings.push(`Sheet "${orderSheetName}" has insufficient rows.`);
    return {
      orderRows: [],
      adsDeductions: [],
      warnings,
      skippedRows: 0,
      selectedSheetName: orderSheetName,
      detectedHeaders: {},
    };
  }

  // Find Header Row in Order sheet: scan first 10 rows
  let headerRowIdx = 0;
  let bestScore = 0;
  let bestColMap: Record<number, string> = {};

  for (let i = 0; i < Math.min(10, rawOrders.length); i++) {
    const colMap = detectHeaders(rawOrders[i]);
    const score = Object.keys(colMap).length;
    if (score > bestScore) {
      bestScore = score;
      headerRowIdx = i;
      bestColMap = colMap;
    }
  }

  const detectedHeaders: Record<string, string> = {};
  const headerRow = rawOrders[headerRowIdx] || [];
  Object.entries(bestColMap).forEach(([idx, key]) => {
    detectedHeaders[String(headerRow[Number(idx)])] = key;
  });

  // Determine starting data row index: skip formula / descriptive row if present
  let dataStartIdx = headerRowIdx + 1;
  if (dataStartIdx < rawOrders.length) {
    const nextRow = rawOrders[dataStartIdx];
    const formulaLike = nextRow.some(cell => {
      const s = String(cell).trim();
      return (
        s === 'A' ||
        s === 'B' ||
        s === 'C' ||
        s.startsWith('(') ||
        s.includes('B + C') ||
        s.startsWith('G =') ||
        s.includes('Track which orders')
      );
    });
    if (formulaLike) {
      dataStartIdx++;
    }
  }

  // Parse order data rows
  const orderRows: MeeshoOrderRow[] = [];

  for (let i = dataStartIdx; i < rawOrders.length; i++) {
    const rawRow = rawOrders[i];
    if (!rawRow || !Array.isArray(rawRow)) {
      skippedRows++;
      continue;
    }

    const nonEmpty = rawRow.filter(c => c !== '' && c != null);
    if (nonEmpty.length < 3) {
      skippedRows++;
      continue;
    }

    const get = (key: string): unknown => {
      const entry = Object.entries(bestColMap).find(([, k]) => k === key);
      if (!entry) return '';
      return rawRow[Number(entry[0])] ?? '';
    };

    const subOrderNo = String(get('subOrderNo') || get('orderId') || '').trim();
    if (!subOrderNo || subOrderNo.toLowerCase().includes('total') || subOrderNo.toLowerCase().includes('no data')) {
      skippedRows++;
      continue;
    }

    const statusRaw = String(get('liveOrderStatus') || '').trim();
    const statusLower = statusRaw.toLowerCase();
    const isDelivered = statusLower === 'delivered';
    const isCustomerReturn = statusLower === 'return' || statusLower === 'customer return';
    const isRTO = statusLower === 'rto' || statusLower.includes('rto');
    const isExchange = statusLower === 'exchange';
    const isReturnOrRTO = isCustomerReturn || isRTO;

    const listingPrice = parseNum(get('listingPrice'));
    const quantity = Math.max(1, parseNum(get('quantity')) || 1);
    const finalSettlementAmount = parseNum(get('finalSettlementAmount'));
    const returnShippingCharge = parseNum(get('returnShippingCharge'));
    const shippingCharge = parseNum(get('shippingCharge'));
    const totalSaleAmount = parseNum(get('totalSaleAmount')) || (listingPrice * quantity);
    const totalSaleReturnAmount = parseNum(get('totalSaleReturnAmount'));

    orderRows.push({
      subOrderNo,
      orderId: String(get('orderId') || subOrderNo.split('_')[0] || subOrderNo).trim(),
      orderDate: parseDate(get('orderDate')),
      dispatchDate: parseDate(get('dispatchDate')),
      paymentDate: parseDate(get('paymentDate')),
      sku: String(get('sku') || 'NO_SKU').trim(),
      productName: String(get('productName') || 'Unknown Product').trim(),
      catalogId: String(get('catalogId') || '').trim(),
      orderSource: String(get('orderSource') || '').trim(),
      liveOrderStatus: statusRaw || (isDelivered ? 'Delivered' : isCustomerReturn ? 'Return' : isRTO ? 'RTO' : 'Other'),
      productGstPct: parseNum(get('productGstPct')),
      listingPrice,
      quantity,
      transactionId: String(get('transactionId') || '').trim(),
      finalSettlementAmount,
      priceType: String(get('priceType') || '').trim(),
      totalSaleAmount,
      totalSaleReturnAmount,
      fixedFee: parseNum(get('fixedFee')),
      warehousingFee: parseNum(get('warehousingFee')),
      returnPremium: parseNum(get('returnPremium')),
      meeshoCommission: parseNum(get('meeshoCommission')),
      returnShippingCharge,
      shippingCharge,
      tcs: parseNum(get('tcs')),
      tds: parseNum(get('tds')),
      compensation: parseNum(get('compensation')),
      claims: parseNum(get('claims')),
      recovery: parseNum(get('recovery')),
      customerState: String(get('customerState') || 'Unknown').trim(),
      category: String(get('category') || 'General').trim(),
      isDelivered,
      isCustomerReturn,
      isRTO,
      isExchange,
      isReturnOrRTO,
    });
  }

  // 2. Parse Ads Sheet if available
  const adsDeductions: MeeshoAdDeduction[] = [];
  const adsSheetName = workbook.SheetNames.find(n => n.toLowerCase().includes('ads'));
  if (adsSheetName && workbook.Sheets[adsSheetName]) {
    const rawAds: unknown[][] = XLSX.utils.sheet_to_json(workbook.Sheets[adsSheetName], {
      header: 1,
      defval: '',
      raw: false,
    }) as unknown[][];

    // Find header
    let adsHeaderIdx = -1;
    for (let i = 0; i < Math.min(5, rawAds.length); i++) {
      const rowStr = rawAds[i].map(String).join(' ').toLowerCase();
      if (rowStr.includes('campaign') || rowStr.includes('ad cost') || rowStr.includes('deduction')) {
        adsHeaderIdx = i;
        break;
      }
    }

    if (adsHeaderIdx !== -1) {
      let adsStart = adsHeaderIdx + 1;
      // Skip formula row
      if (adsStart < rawAds.length && rawAds[adsStart].some(c => String(c).includes('A') || String(c).includes('+'))) {
        adsStart++;
      }
      for (let i = adsStart; i < rawAds.length; i++) {
        const r = rawAds[i];
        if (!r || r.length < 3) continue;
        const totalAdCost = parseNum(r[7] ?? r[5] ?? r[3]);
        if (totalAdCost === 0 && !r[2]) continue;
        adsDeductions.push({
          duration: String(r[0] || '').trim(),
          deductionDate: parseDate(r[1]),
          campaignId: String(r[2] || '').trim(),
          adCost: parseNum(r[3]),
          credits: parseNum(r[4]),
          netAdCost: parseNum(r[5]),
          gst: parseNum(r[6]),
          totalAdCost,
        });
      }
    }
  }

  if (orderRows.length === 0) {
    warnings.push('No valid order rows could be extracted. Please check if this is a standard Meesho supplier payment report.');
  }

  return {
    orderRows,
    adsDeductions,
    warnings,
    skippedRows,
    selectedSheetName: orderSheetName,
    detectedHeaders,
  };
}

// ─── Realistic Sample Generator ───────────────────────────────────────────────
export function generateSampleData(): { orderRows: MeeshoOrderRow[]; adsDeductions: MeeshoAdDeduction[] } {
  const skus = [
    { sku: 'W0IaDLXO', name: "Men's Solid Grey Track Pant | Gym Running Lower for Men", cat: '504060955', price: 187, returnRate: 0.12, custReturnRate: 0.04 },
    { sku: 'T36wBozh', name: "Women's Grey & Black Palazzo Pack | Stylish Wide Leg Palazzo", cat: '500172538', price: 170, returnRate: 0.48, custReturnRate: 0.35 },
    { sku: 'ZE2_8KHk', name: "Women's Black Palazzo Pants | Wide Leg Full Length Palazzo", cat: '500673864', price: 175, returnRate: 0.38, custReturnRate: 0.30 },
    { sku: 'Fj_ck6OW', name: "Women's Solid Grey Palazzo Pants | Wide Leg Bottom Wear", cat: '500172538', price: 175, returnRate: 0.40, custReturnRate: 0.28 },
    { sku: 'qyH4nZZk', name: "Women's Black Palazzo Pants | Casual Ethnic Bottom Wear", cat: '500673864', price: 190, returnRate: 0.22, custReturnRate: 0.15 },
    { sku: 'DfU7a6Cw', name: "Men's Track Pants Combo Pack of 2 Black Grey | Stylish Gym Joggers", cat: '497167467', price: 349, returnRate: 0.45, custReturnRate: 0.05 },
    { sku: 'Je3JJjZx', name: "Men's Black Track Pant | Stylish Sports Lower for Men", cat: '504060955', price: 250, returnRate: 0.15, custReturnRate: 0.02 },
  ];

  const orderRows: MeeshoOrderRow[] = [];
  let subOrderCount = 311000000000000000;
  const baseDate = new Date('2026-07-01');

  for (let d = 0; d < 31; d++) {
    const orderDate = new Date(baseDate.getTime() + d * 86400000);
    const ordersToday = Math.floor(Math.random() * 8) + 4;

    for (let o = 0; o < ordersToday; o++) {
      const p = skus[Math.floor(Math.random() * skus.length)];
      subOrderCount += 1000000;
      const rnd = Math.random();

      let liveOrderStatus = 'Delivered';
      let finalSettlementAmount = p.price * 0.92;
      let returnShippingCharge = 0;

      if (rnd < p.custReturnRate) {
        liveOrderStatus = 'Return';
        returnShippingCharge = -175;
        finalSettlementAmount = -175;
      } else if (rnd < p.returnRate) {
        liveOrderStatus = 'RTO';
        returnShippingCharge = 0;
        finalSettlementAmount = 0;
      }

      orderRows.push({
        subOrderNo: `${subOrderCount}_1`,
        orderId: `${subOrderCount}`,
        orderDate,
        dispatchDate: new Date(orderDate.getTime() + 86400000),
        paymentDate: new Date(orderDate.getTime() + 7 * 86400000),
        sku: p.sku,
        productName: p.name,
        catalogId: p.cat,
        orderSource: '',
        liveOrderStatus,
        productGstPct: 5,
        listingPrice: p.price,
        quantity: 1,
        transactionId: 'SAMPLE_TXN',
        finalSettlementAmount,
        priceType: '',
        totalSaleAmount: p.price,
        totalSaleReturnAmount: liveOrderStatus === 'Return' ? -p.price : 0,
        fixedFee: 0,
        warehousingFee: 0,
        returnPremium: 0,
        meeshoCommission: 0,
        returnShippingCharge,
        shippingCharge: 0,
        tcs: -(p.price * 0.01),
        tds: -(p.price * 0.001),
        compensation: 0,
        claims: 0,
        recovery: 0,
        customerState: 'Maharashtra',
        category: 'Apparel',
        isDelivered: liveOrderStatus === 'Delivered',
        isCustomerReturn: liveOrderStatus === 'Return',
        isRTO: liveOrderStatus === 'RTO',
        isExchange: false,
        isReturnOrRTO: liveOrderStatus === 'Return' || liveOrderStatus === 'RTO',
      });
    }
  }

  const adsDeductions: MeeshoAdDeduction[] = [
    {
      duration: '2026-07-01 to 2026-07-15',
      deductionDate: new Date('2026-07-16'),
      campaignId: 'CMP-883921',
      adCost: 1200,
      credits: 0,
      netAdCost: 1200,
      gst: 216,
      totalAdCost: 1416,
    },
    {
      duration: '2026-07-16 to 2026-07-31',
      deductionDate: new Date('2026-08-01'),
      campaignId: 'CMP-884055',
      adCost: 950,
      credits: 50,
      netAdCost: 900,
      gst: 162,
      totalAdCost: 1062,
    },
  ];

  return { orderRows, adsDeductions };
}
