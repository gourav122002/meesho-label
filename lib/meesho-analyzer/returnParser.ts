// ─── Meesho Return Sheet CSV Parser ───────────────────────────────────────────
// Format: Meesho Supplier Panel > Returns CSV download
// Has 6 metadata rows at top before actual data header starts

export interface ReturnSheetRow {
  sNo: number;
  productName: string;
  sku: string;
  variation: string;           // Size: XL, M, L, 28, 30, etc.
  meeshoPid: string;
  category: string;
  qty: number;
  orderNumber: string;
  subOrderNumber: string;      // Join key with payment sheet
  dispatchDate: Date | null;
  returnCreatedDate: Date | null;
  deliveredDate: Date | null;
  typeOfReturn: string;        // 'Customer Return' | 'Courier Return (RTO)'
  subType: string;             // 'FIRST_RET' | 'forward_RTO'
  courierPartner: string;      // 'Delhivery' | 'Shadowfax' | 'PocketShip' | 'Valmo' | 'Xpress Bees'
  awbNumber: string;
  returnPriceType: string;     // 'Meesho Price' | 'Wrong/Defective Return Price' | 'NA'
  returnReason: string;        // 'Have size / fit related issues' | etc.
  detailedReturnReason: string;// 'Size correct but too tight' | etc.
  otpVerifiedAt: string;
}

function parseDate(val: string): Date | null {
  if (!val || val === 'NA' || val === '') return null;
  const d = new Date(val.trim());
  return isNaN(d.getTime()) ? null : d;
}

function parseNum(val: string): number {
  const n = parseFloat(String(val || '').replace(/[^0-9.-]/g, ''));
  return isNaN(n) ? 0 : n;
}

function stripQuotes(s: string): string {
  return s.replace(/^"(.*)"$/, '$1').trim();
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseReturnSheet(csvText: string): ReturnSheetRow[] {
  const lines = csvText.split('\n').map(l => l.replace(/\r$/, ''));

  // Find header row — contains "S No", "Product Name", and "Return Reason"
  let headerIdx = -1;
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const lower = lines[i].toLowerCase();
    if (lower.includes('s no') && lower.includes('product name') && lower.includes('return reason')) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx === -1) return [];

  const headers = parseCsvLine(lines[headerIdx]).map(h => stripQuotes(h).toLowerCase().trim());

  const colIdx = (name: string): number =>
    headers.findIndex(h => h.includes(name.toLowerCase()));

  const cols = {
    sNo:                  colIdx('s no'),
    productName:          colIdx('product name'),
    sku:                  colIdx('sku'),
    variation:            colIdx('variation'),
    meeshoPid:            colIdx('meesho pid'),
    category:             colIdx('category'),
    qty:                  colIdx('qty'),
    orderNumber:          colIdx('order number'),
    subOrderNumber:       colIdx('suborder number'),
    dispatchDate:         colIdx('dispatch date'),
    returnCreatedDate:    colIdx('return created date'),
    deliveredDate:        colIdx('delivered date'),
    typeOfReturn:         colIdx('type of return'),
    subType:              colIdx('sub type'),
    courierPartner:       colIdx('courier partner'),
    awbNumber:            colIdx('awb number'),
    returnPriceType:      colIdx('return price type'),
    returnReason:         colIdx('return reason'),
    detailedReturnReason: colIdx('detailed return reason'),
    otpVerifiedAt:        colIdx('otp verified'),
  };

  const rows: ReturnSheetRow[] = [];

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.trim() === '' || line.trim() === ',') continue;

    const cells = parseCsvLine(line).map(c => stripQuotes(c));
    if (cells.length < 5) continue;

    const get = (colKey: keyof typeof cols): string => {
      const idx = cols[colKey];
      return idx >= 0 && idx < cells.length ? (cells[idx] || '').trim() : '';
    };

    const sNoStr = get('sNo');
    if (!sNoStr || isNaN(Number(sNoStr))) continue;

    const returnReason = get('returnReason');
    const detailedReason = get('detailedReturnReason');

    rows.push({
      sNo:                  parseNum(sNoStr),
      productName:          get('productName'),
      sku:                  get('sku'),
      variation:            get('variation'),
      meeshoPid:            get('meeshoPid'),
      category:             get('category'),
      qty:                  Math.max(1, parseNum(get('qty')) || 1),
      orderNumber:          get('orderNumber'),
      subOrderNumber:       get('subOrderNumber'),
      dispatchDate:         parseDate(get('dispatchDate')),
      returnCreatedDate:    parseDate(get('returnCreatedDate')),
      deliveredDate:        parseDate(get('deliveredDate')),
      typeOfReturn:         get('typeOfReturn'),
      subType:              get('subType'),
      courierPartner:       get('courierPartner'),
      awbNumber:            get('awbNumber'),
      returnPriceType:      get('returnPriceType'),
      returnReason:         returnReason === 'NA' ? '' : returnReason,
      detailedReturnReason: detailedReason === 'NA' ? '' : detailedReason,
      otpVerifiedAt:        get('otpVerifiedAt'),
    });
  }

  return rows;
}

export async function parseReturnSheetFile(file: File): Promise<ReturnSheetRow[]> {
  const text = await file.text();
  return parseReturnSheet(text);
}

// ─── Realistic Sample Return Generator ─────────────────────────────────────────
export function generateSampleReturnRows(): ReturnSheetRow[] {
  const baseSkus = [
    { sku: 'T36wBozh', name: "Women's Grey & Black Palazzo Pack", cat: 'Palazzos', var: ['M', 'L', 'XL', 'XL', 'L', 'M', 'XL'] },
    { sku: 'ZE2_8KHk', name: "Women's Black Palazzo Pants | Wide Leg Full Length", cat: 'Palazzos', var: ['XL', 'M', 'L', 'XL', 'M'] },
    { sku: 'Fj_ck6OW', name: "Women's Solid Grey Palazzo Pants | Wide Leg", cat: 'Palazzos', var: ['XL', 'XL', 'M'] },
    { sku: 'qyH4nZZk', name: "Women's Black Palazzo Pants | Casual Ethnic", cat: 'Palazzos', var: ['L', 'M', 'XL'] },
    { sku: 'W0IaDLXO', name: "Men's Solid Grey Track Pant | Gym Running Lower", cat: 'Track Pants', var: ['28', '30', 'L', '28', 'XL', '32'] },
    { sku: 'DfU7a6Cw', name: "Men's Track Pants Combo Pack of 2 Black Grey", cat: 'Track Pants', var: ['30', 'XL', '30'] },
  ];

  const reasons = [
    { reason: 'Have size / fit related issues', detail: 'Size correct but too tight' },
    { reason: 'Have size / fit related issues', detail: 'Size correct but too loose' },
    { reason: 'Have size / fit related issues', detail: 'Did not like the fit' },
    { reason: 'Received wrong product (different color / size / product)', detail: 'Same product but different colour' },
    { reason: 'Received wrong product (different color / size / product)', detail: 'Completely different product from shown' },
    { reason: 'Received defective product (stains / damaged / torn)', detail: 'Product was dirty or had stains' },
    { reason: 'Received defective product (stains / damaged / torn)', detail: 'Product was broken or torn' },
    { reason: 'Have other quality related issues', detail: "Product's quality or performance is not good" },
    { reason: "Don't need the product anymore", detail: 'Found lower price elsewhere' },
  ];

  const couriers = ['Shadowfax', 'Delhivery', 'PocketShip', 'Valmo', 'Xpress Bees'];

  const rows: ReturnSheetRow[] = [];
  let sNo = 1;
  let orderNum = 315000000000000000;

  for (const item of baseSkus) {
    for (const v of item.var) {
      const isCustReturn = Math.random() < 0.65;
      const typeOfReturn = isCustReturn ? 'Customer Return' : 'Courier Return (RTO)';
      const subType = isCustReturn ? 'FIRST_RET' : 'forward_RTO';
      const reasonObj = isCustReturn ? reasons[Math.floor(Math.random() * reasons.length)] : { reason: '', detail: '' };
      const courier = couriers[Math.floor(Math.random() * couriers.length)];

      orderNum += 10000000;

      rows.push({
        sNo: sNo++,
        productName: item.name,
        sku: item.sku,
        variation: v,
        meeshoPid: '',
        category: item.cat,
        qty: 1,
        orderNumber: `${orderNum}`,
        subOrderNumber: `${orderNum}_1`,
        dispatchDate: new Date('2026-08-10'),
        returnCreatedDate: new Date('2026-08-18'),
        deliveredDate: new Date('2026-08-25'),
        typeOfReturn,
        subType,
        courierPartner: courier,
        awbNumber: `AWB${sNo}98234`,
        returnPriceType: isCustReturn ? 'Meesho Price' : 'NA',
        returnReason: reasonObj.reason,
        detailedReturnReason: reasonObj.detail,
        otpVerifiedAt: '2026-08-25 14:00:00',
      });
    }
  }

  return rows;
}
