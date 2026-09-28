// ─── Raw parsed row from Meesho payment sheet ────────────────────────────────
export interface MeeshoOrderRow {
  subOrderNo: string;
  orderId: string;
  orderDate: Date | null;
  dispatchDate: Date | null;
  paymentDate: Date | null;
  sku: string;
  productName: string;
  catalogId: string;
  orderSource: string;
  liveOrderStatus: string;
  productGstPct: number;
  listingPrice: number;
  quantity: number;
  transactionId: string;
  finalSettlementAmount: number;
  priceType: string;
  totalSaleAmount: number;
  totalSaleReturnAmount: number;
  fixedFee: number;
  warehousingFee: number;
  returnPremium: number;
  meeshoCommission: number;
  returnShippingCharge: number;
  shippingCharge: number;
  tcs: number;
  tds: number;
  compensation: number;
  claims: number;
  recovery: number;
  customerState: string;
  category: string;
  isDelivered: boolean;
  isCustomerReturn: boolean;
  isRTO: boolean;
  isExchange: boolean;
  isReturnOrRTO: boolean;
}

export interface MeeshoAdDeduction {
  duration: string;
  deductionDate: Date | null;
  campaignId: string;
  adCost: number;
  credits: number;
  netAdCost: number;
  gst: number;
  totalAdCost: number;
}

export interface SummaryMetrics {
  totalOrders: number;
  deliveredOrders: number;
  deliveredRate: number;
  customerReturns: number;
  customerReturnRate: number;
  rtoOrders: number;
  rtoRate: number;
  exchangeOrders: number;
  otherOrders: number;
  totalReturnsAndRTO: number;
  overallReturnRate: number;
  grossSales: number;
  deliveredGrossSales: number;
  totalSettlementAmount: number;
  totalReturnShippingDeducted: number;
  totalShippingDeducted: number;
  totalCommission: number;
  totalTCS: number;
  totalTDS: number;
  totalCompensations: number;
  totalClaims: number;
  totalRecoveries: number;
  totalAdsCost: number;
  totalProductCost: number;
  totalPackagingCost: number;
  netProfit: number;
  netProfitMargin: number;
  roi: number;
  avgOrderValue: number;
  dateRange: { from: Date | null; to: Date | null };
}

export interface DateSeries {
  label: string;
  date: Date;
  grossSales: number;
  settlement: number;
  productCost: number;
  profit: number;
  orders: number;
  delivered: number;
  returns: number;
  rto: number;
}

export interface ProductMetrics {
  sku: string;
  productName: string;
  catalogId: string;
  category: string;
  listingPrice: number;
  unitCost: number;
  totalOrders: number;
  deliveredOrders: number;
  customerReturns: number;
  rtoOrders: number;
  exchangeOrders: number;
  returnRate: number;
  customerReturnRate: number;
  rtoRate: number;
  grossSales: number;
  totalSettlement: number;
  returnShippingDeducted: number;
  shippingDeducted: number;
  totalProductCost: number;
  netProfit: number;
  profitMargin: number;
  recommendation: 'remove' | 'pause' | 'fix' | 'scale' | 'monitor' | 'ok';
  recommendationReason: string;
  recommendationAction: string;
}

export interface RealReturnReasonStat {
  reason: string;
  detailedReason: string;
  count: number;
  percentage: number;
}

export interface SkuVariationStat {
  variation: string;
  customerReturns: number;
  rtoCount: number;
  total: number;
}

export interface CourierRtoStat {
  courierPartner: string;
  rtoCount: number;
  percentage: number;
}

export interface CatalogReturnEntry {
  catalogId: string;
  productName: string;
  totalOrders: number;
  customerReturns: number;
  rtoOrders: number;
  customerReturnRate: number;
  rtoRate: number;
  totalReturnRate: number;
  returnPenaltyCost: number;
  inferredReasons: string[];
  improvementTips: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  hasRealReasons: boolean;
  realReasons: RealReturnReasonStat[];
  variationStats: SkuVariationStat[];
  courierStats: CourierRtoStat[];
}

export interface ReturnAnalysis {
  totalOrders: number;
  deliveredCount: number;
  customerReturns: number;
  rtoCount: number;
  customerReturnRate: number;
  rtoRate: number;
  totalReturnRate: number;
  totalReturnShippingLoss: number;
  topCustomerReturnSkus: ProductMetrics[];
  topRTOSkus: ProductMetrics[];
  catalogReturnBreakdown: CatalogReturnEntry[];
  hasReturnSheetData: boolean;
  returnReasonSummary: RealReturnReasonStat[];
  variationStats: SkuVariationStat[];
  courierRtoStats: CourierRtoStat[];
}

export interface CatalogMetrics {
  catalogId: string;
  name: string;
  skuCount: number;
  totalOrders: number;
  deliveredOrders: number;
  customerReturns: number;
  rtoOrders: number;
  returnRate: number;
  grossSales: number;
  totalSettlement: number;
  netProfit: number;
  profitMargin: number;
}

export type InsightType = 'remove' | 'pause' | 'fix' | 'scale' | 'geographic' | 'category' | 'trend' | 'ads' | 'info';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  value?: string;
  affectedSkus?: string[];
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
}

export interface AnalysisResult {
  summary: SummaryMetrics;
  profitTimeSeries: DateSeries[];
  products: ProductMetrics[];
  topProducts: ProductMetrics[];
  worstProducts: ProductMetrics[];
  badCatalog: {
    remove: ProductMetrics[];
    pause: ProductMetrics[];
    fix: ProductMetrics[];
    scale: ProductMetrics[];
  };
  returnAnalysis: ReturnAnalysis;
  catalogBreakdown: CatalogMetrics[];
  adsSummary: {
    totalAdsCost: number;
    deductions: MeeshoAdDeduction[];
  };
  insights: Insight[];
  totalRows: number;
  parsedRows: number;
  skippedRows: number;
  warnings: string[];
  settings: {
    defaultUnitCostPct: number;
    packagingCostPerOrder: number;
  };
}

export interface ParseResult {
  orderRows: MeeshoOrderRow[];
  adsDeductions: MeeshoAdDeduction[];
  warnings: string[];
  skippedRows: number;
  selectedSheetName: string;
  detectedHeaders: Record<string, string>;
}
