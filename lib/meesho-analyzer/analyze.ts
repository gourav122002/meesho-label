import type {
  MeeshoOrderRow,
  MeeshoAdDeduction,
  AnalysisResult,
  SummaryMetrics,
  DateSeries,
  ProductMetrics,
  ReturnAnalysis,
  CatalogMetrics,
  CatalogReturnEntry,
  RealReturnReasonStat,
  SkuVariationStat,
  CourierRtoStat,
  Insight,
  InsightType,
} from './types';
import type { ReturnSheetRow } from './returnParser';

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function formatINR(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 100000) return sign + '₹' + (abs / 100000).toFixed(2) + 'L';
  if (abs >= 1000) return sign + '₹' + (abs / 1000).toFixed(1) + 'K';
  return sign + '₹' + abs.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function pct(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 1000) / 10;
}

export interface AnalysisOptions {
  customSkuCosts?: Record<string, number>; // SKU -> unit cost
  defaultUnitCostPct?: number;             // default % of listing price if no custom cost (e.g. 0 or 40)
  packagingCostPerOrder?: number;          // e.g. 0 or 10
  returnRows?: ReturnSheetRow[];           // parsed Meesho Return Sheet CSV rows
}


// ─── Real Return Reason Helpers (use data from Return Sheet CSV) ─────────────
function buildReturnReasonSummary(returnRows: ReturnSheetRow[]): import('./types').RealReturnReasonStat[] {
  const custRows = returnRows.filter(r => r.typeOfReturn === 'Customer Return' && r.returnReason);
  if (custRows.length === 0) return [];

  const groupMap = new Map<string, { reason: string; detailedReason: string; count: number }>();
  for (const r of custRows) {
    const key = `${r.returnReason}|||${r.detailedReturnReason}`;
    if (!groupMap.has(key)) {
      groupMap.set(key, { reason: r.returnReason, detailedReason: r.detailedReturnReason, count: 0 });
    }
    groupMap.get(key)!.count++;
  }

  const total = custRows.length;
  return Array.from(groupMap.values())
    .map(g => ({ ...g, percentage: Math.round((g.count / total) * 1000) / 10 }))
    .sort((a, b) => b.count - a.count);
}

function buildVariationStats(returnRows: ReturnSheetRow[]): import('./types').SkuVariationStat[] {
  if (returnRows.length === 0) return [];
  const varMap = new Map<string, { customerReturns: number; rtoCount: number }>();
  for (const r of returnRows) {
    const v = r.variation || 'Unknown';
    if (!varMap.has(v)) varMap.set(v, { customerReturns: 0, rtoCount: 0 });
    const entry = varMap.get(v)!;
    if (r.typeOfReturn === 'Customer Return') entry.customerReturns++;
    else if (r.typeOfReturn === 'Courier Return (RTO)') entry.rtoCount++;
  }
  return Array.from(varMap.entries())
    .map(([variation, d]) => ({ variation, customerReturns: d.customerReturns, rtoCount: d.rtoCount, total: d.customerReturns + d.rtoCount }))
    .sort((a, b) => b.total - a.total);
}

function buildCourierRtoStats(returnRows: ReturnSheetRow[]): import('./types').CourierRtoStat[] {
  const rtoRows = returnRows.filter(r => r.typeOfReturn === 'Courier Return (RTO)');
  if (rtoRows.length === 0) return [];
  const courierMap = new Map<string, number>();
  for (const r of rtoRows) {
    const c = r.courierPartner || 'Unknown';
    courierMap.set(c, (courierMap.get(c) || 0) + 1);
  }
  const total = rtoRows.length;
  return Array.from(courierMap.entries())
    .map(([courierPartner, rtoCount]) => ({ courierPartner, rtoCount, percentage: Math.round((rtoCount / total) * 1000) / 10 }))
    .sort((a, b) => b.rtoCount - a.rtoCount);
}

function buildCatalogReturnBreakdown(
  rows: MeeshoOrderRow[],
  pctFn: (part: number, total: number) => number,
  returnRows: ReturnSheetRow[] = []
): import('./types').CatalogReturnEntry[] {
  const catMap = new Map<string, MeeshoOrderRow[]>();
  for (const r of rows) {
    const key = r.catalogId || 'Unknown';
    if (!catMap.has(key)) catMap.set(key, []);
    catMap.get(key)!.push(r);
  }

  // Index return sheet rows by SKU for fast lookup
  const returnBySku = new Map<string, ReturnSheetRow[]>();
  for (const r of returnRows) {
    if (!returnBySku.has(r.sku)) returnBySku.set(r.sku, []);
    returnBySku.get(r.sku)!.push(r);
  }

  const entries: import('./types').CatalogReturnEntry[] = [];

  for (const [catalogId, catRows] of catMap.entries()) {
    const totalOrders = catRows.length;
    if (totalOrders < 2) continue;

    const custReturns = catRows.filter(r => r.isCustomerReturn).length;
    const rtoOrders = catRows.filter(r => r.isRTO).length;
    const custReturnRate = pctFn(custReturns, totalOrders);
    const rtoRate = pctFn(rtoOrders, totalOrders);
    const totalReturnRate = pctFn(custReturns + rtoOrders, totalOrders);
    const returnPenaltyCost = Math.abs(catRows.reduce((s, r) => s + r.returnShippingCharge, 0));
    const productName = catRows[0]?.productName || `Catalog ${catalogId}`;
    const avgPrice = catRows.reduce((s, r) => s + r.listingPrice, 0) / totalOrders;

    // Collect real return data for all SKUs in this catalog
    const skusInCat = [...new Set(catRows.map(r => r.sku))];
    const catReturnRows: ReturnSheetRow[] = [];
    for (const sku of skusInCat) {
      const skuReturns = returnBySku.get(sku) || [];
      catReturnRows.push(...skuReturns);
    }

    const hasRealReasons = catReturnRows.length > 0;
    const realReasons = buildReturnReasonSummary(catReturnRows);
    const variationStats = buildVariationStats(catReturnRows);
    const courierStats = buildCourierRtoStats(catReturnRows);

    // Determine severity
    let severity: 'critical' | 'high' | 'medium' | 'low' = 'low';
    if (custReturnRate >= 30 || totalReturnRate >= 45) severity = 'critical';
    else if (custReturnRate >= 20 || totalReturnRate >= 30) severity = 'high';
    else if (custReturnRate >= 10 || totalReturnRate >= 20) severity = 'medium';

    // Build inferred reasons & tips
    const inferredReasons: string[] = [];
    const improvementTips: string[] = [];

    if (custReturnRate >= 25) {
      inferredReasons.push('🔴 Product quality or size mismatch — buyers received item & returned it');
      inferredReasons.push('🔴 Listing images / description may not match actual product');
      improvementTips.push('Update photos with real product shots (flat-lay + worn look)');
      improvementTips.push('Add a detailed size chart (chest, waist, length in cm)');
      improvementTips.push('Improve product description — mention fabric, fit, and care instructions');
    } else if (custReturnRate >= 12) {
      inferredReasons.push('🟠 Moderate quality / expectation gap — some buyers dissatisfied after delivery');
      improvementTips.push('Check negative reviews and address sizing or quality complaints');
      improvementTips.push('Consider improving packaging so product arrives in perfect condition');
    } else if (custReturnRate > 0) {
      inferredReasons.push('🟡 Minor customer returns — within acceptable range');
      improvementTips.push('Monitor buyer feedback for recurring complaints');
    }

    if (rtoRate >= 35) {
      inferredReasons.push('🔴 Very high courier RTO — buyers refusing at doorstep or addresses unserviceable');
      improvementTips.push('Disable COD for pin codes with repeat RTO (contact Meesho support)');
      improvementTips.push('Add prominent "Prepaid Only" messaging to deter fake orders');
    } else if (rtoRate >= 20) {
      inferredReasons.push('🟠 Elevated RTO — possible fake orders or low buyer intent');
      improvementTips.push('Review geographic RTO patterns — certain states/cities may have higher abuse');
    } else if (rtoRate > 0) {
      inferredReasons.push('🟡 Some courier RTO — mostly normal courier failures');
      improvementTips.push('Ensure product is shipped within 24-48 hrs to reduce cancellations');
    }

    if (avgPrice > 300 && custReturnRate >= 15) {
      inferredReasons.push('💰 High-price item with high returns — buyers may have regret or comparison-shop');
      improvementTips.push('Highlight value-for-money in listing title and description');
    }

    if (avgPrice < 150 && custReturnRate >= 20) {
      inferredReasons.push('📦 Low-price item with high returns — quality expectations vs. price mismatch');
      improvementTips.push('Be transparent about material quality in the listing');
    }

    if (inferredReasons.length === 0) {
      inferredReasons.push('✅ Return rate is within healthy range');
      improvementTips.push('Keep up the good work — focus on scaling this catalog');
    }
    if (improvementTips.length === 0) {
      improvementTips.push('Continue monitoring return trends as volume grows');
    }

    entries.push({
      catalogId,
      productName,
      totalOrders,
      customerReturns: custReturns,
      rtoOrders,
      customerReturnRate: custReturnRate,
      rtoRate,
      totalReturnRate,
      returnPenaltyCost,
      inferredReasons,
      improvementTips,
      severity,
      hasRealReasons,
      realReasons,
      variationStats,
      courierStats,
    });
  }

  return entries.sort((a, b) => {
    const sOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const diff = sOrder[a.severity] - sOrder[b.severity];
    if (diff !== 0) return diff;
    return b.customerReturnRate - a.customerReturnRate;
  });
}

// â”€â”€â”€ Master Calculation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function analyzeSheet(
  rows: MeeshoOrderRow[],
  adsDeductions: MeeshoAdDeduction[] = [],
  warnings: string[] = [],
  totalRawRows = 0,
  skippedRows = 0,
  options: AnalysisOptions = {}
): AnalysisResult {
  const customSkuCosts = options.customSkuCosts || {};
  const defaultUnitCostPct = options.defaultUnitCostPct ?? 40; // 40% default estimation if not configured
  const packagingCostPerOrder = options.packagingCostPerOrder ?? 0;

  // 1. Group rows by SKU
  const skuMap = new Map<string, MeeshoOrderRow[]>();
  for (const r of rows) {
    const key = r.sku || r.productName || 'UNKNOWN';
    if (!skuMap.has(key)) skuMap.set(key, []);
    skuMap.get(key)!.push(r);
  }

  // 2. Compute Product Metrics
  const productMetrics: ProductMetrics[] = [];

  for (const [skuKey, skuRows] of skuMap.entries()) {
    const sample = skuRows[0];
    const totalOrders = skuRows.length;
    const delivered = skuRows.filter(r => r.isDelivered);
    const custReturns = skuRows.filter(r => r.isCustomerReturn);
    const rto = skuRows.filter(r => r.isRTO);
    const exchange = skuRows.filter(r => r.isExchange);

    const grossSales = skuRows.reduce((s, r) => s + r.listingPrice * r.quantity, 0);
    const totalSettlement = skuRows.reduce((s, r) => s + r.finalSettlementAmount, 0);
    const returnShippingDeducted = skuRows.reduce((s, r) => s + r.returnShippingCharge, 0);
    const shippingDeducted = skuRows.reduce((s, r) => s + r.shippingCharge, 0);

    const avgListingPrice = totalOrders > 0 ? grossSales / totalOrders : sample.listingPrice;

    // Unit Cost: custom or estimated percentage of listing price
    let unitCost = customSkuCosts[skuKey];
    if (unitCost === undefined) {
      unitCost = defaultUnitCostPct > 0 ? Math.round(avgListingPrice * (defaultUnitCostPct / 100)) : 0;
    }

    const totalProductCost = delivered.length * unitCost;
    const netProfit = totalSettlement - totalProductCost;
    const profitMargin = grossSales > 0 ? pct(netProfit, grossSales) : 0;

    const returnRate = pct(custReturns.length + rto.length, totalOrders);
    const customerReturnRate = pct(custReturns.length, totalOrders);
    const rtoRate = pct(rto.length, totalOrders);

    // Smart Action & Recommendation Logic
    let recommendation: ProductMetrics['recommendation'] = 'ok';
    let recommendationReason = '';
    let recommendationAction = '';

    if (customerReturnRate >= 25 && totalOrders >= 5) {
      recommendation = 'remove';
      recommendationReason = `High Customer Return Rate (${customerReturnRate}%) caused ${formatINR(returnShippingDeducted)} in return shipping penalties!`;
      recommendationAction = 'Stop Selling / Remove Catalog';
    } else if (netProfit < 0 && totalOrders >= 5) {
      recommendation = 'remove';
      recommendationReason = `Net loss of ${formatINR(netProfit)} after product cost and return deductions across ${totalOrders} orders.`;
      recommendationAction = 'Remove or Increase Price';
    } else if (rtoRate >= 35 && totalOrders >= 6) {
      recommendation = 'pause';
      recommendationReason = `High Courier RTO rate (${rtoRate}%) â€” packages failing at doorstep. Verify pin codes / COD quality.`;
      recommendationAction = 'Pause & Check Courier Service';
    } else if (customerReturnRate >= 15 && totalOrders >= 4) {
      recommendation = 'fix';
      recommendationReason = `Customer returns (${customerReturnRate}%) reducing margins. Check product size chart, fabric, and images.`;
      recommendationAction = 'Improve Catalog & Size Chart';
    } else if (delivered.length >= 10 && customerReturnRate <= 10 && returnRate <= 25 && netProfit > 0) {
      recommendation = 'scale';
      recommendationReason = `Top Winner: ${delivered.length} delivered, low return rate (${customerReturnRate}%), generating ${formatINR(netProfit)} net profit!`;
      recommendationAction = 'Scale Ads & Increase Inventory';
    } else if (totalOrders >= 3 && netProfit > 0) {
      recommendation = 'monitor';
      recommendationReason = `Profitable with ${delivered.length} delivered orders. Monitor return rate as volume scales.`;
      recommendationAction = 'Keep Monitoring';
    } else {
      recommendation = 'ok';
      recommendationReason = 'Normal performance with limited orders.';
      recommendationAction = 'No action needed';
    }

    productMetrics.push({
      sku: skuKey,
      productName: sample.productName,
      catalogId: sample.catalogId,
      category: sample.category || 'General',
      listingPrice: avgListingPrice,
      unitCost,
      totalOrders,
      deliveredOrders: delivered.length,
      customerReturns: custReturns.length,
      rtoOrders: rto.length,
      exchangeOrders: exchange.length,
      returnRate,
      customerReturnRate,
      rtoRate,
      grossSales,
      totalSettlement,
      returnShippingDeducted,
      shippingDeducted,
      totalProductCost,
      netProfit,
      profitMargin,
      recommendation,
      recommendationReason,
      recommendationAction,
    });
  }

  // Sort by Gross Sales / Orders
  productMetrics.sort((a, b) => b.totalOrders - a.totalOrders);

  // 3. Summary Metrics
  const totalOrders = rows.length;
  const deliveredOrders = rows.filter(r => r.isDelivered).length;
  const customerReturns = rows.filter(r => r.isCustomerReturn).length;
  const rtoOrders = rows.filter(r => r.isRTO).length;
  const exchangeOrders = rows.filter(r => r.isExchange).length;
  const otherOrders = totalOrders - (deliveredOrders + customerReturns + rtoOrders + exchangeOrders);
  const totalReturnsAndRTO = customerReturns + rtoOrders;

  const grossSales = rows.reduce((s, r) => s + r.listingPrice * r.quantity, 0);
  const deliveredGrossSales = rows.filter(r => r.isDelivered).reduce((s, r) => s + r.listingPrice * r.quantity, 0);
  const totalSettlementAmount = rows.reduce((s, r) => s + r.finalSettlementAmount, 0);
  const totalReturnShippingDeducted = rows.reduce((s, r) => s + r.returnShippingCharge, 0);
  const totalShippingDeducted = rows.reduce((s, r) => s + r.shippingCharge, 0);
  const totalCommission = rows.reduce((s, r) => s + r.meeshoCommission, 0);
  const totalTCS = rows.reduce((s, r) => s + r.tcs, 0);
  const totalTDS = rows.reduce((s, r) => s + r.tds, 0);
  const totalCompensations = rows.reduce((s, r) => s + r.compensation, 0);
  const totalClaims = rows.reduce((s, r) => s + r.claims, 0);
  const totalRecoveries = rows.reduce((s, r) => s + r.recovery, 0);

  // Total Ads Cost from Ads Sheet
  const totalAdsCost = adsDeductions.reduce((s, d) => s + Math.abs(d.totalAdCost), 0);

  // Financial calculations
  const totalProductCost = productMetrics.reduce((s, p) => s + p.totalProductCost, 0);
  const totalPackagingCost = totalOrders * packagingCostPerOrder;
  const netProfit = totalSettlementAmount - totalProductCost - totalPackagingCost - totalAdsCost;
  const netProfitMargin = grossSales > 0 ? pct(netProfit, grossSales) : 0;
  const totalInvestment = totalProductCost + totalPackagingCost + totalAdsCost;
  const roi = totalInvestment > 0 ? pct(netProfit, totalInvestment) : 0;

  const dates = rows.map(r => r.orderDate).filter(Boolean) as Date[];
  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());

  const summary: SummaryMetrics = {
    totalOrders,
    deliveredOrders,
    deliveredRate: pct(deliveredOrders, totalOrders),
    customerReturns,
    customerReturnRate: pct(customerReturns, totalOrders),
    rtoOrders,
    rtoRate: pct(rtoOrders, totalOrders),
    exchangeOrders,
    otherOrders,
    totalReturnsAndRTO,
    overallReturnRate: pct(totalReturnsAndRTO, totalOrders),
    grossSales,
    deliveredGrossSales,
    totalSettlementAmount,
    totalReturnShippingDeducted,
    totalShippingDeducted,
    totalCommission,
    totalTCS,
    totalTDS,
    totalCompensations,
    totalClaims,
    totalRecoveries,
    totalAdsCost,
    totalProductCost,
    totalPackagingCost,
    netProfit,
    netProfitMargin,
    roi,
    avgOrderValue: deliveredOrders > 0 ? grossSales / totalOrders : 0,
    dateRange: {
      from: sortedDates[0] ?? null,
      to: sortedDates[sortedDates.length - 1] ?? null,
    },
  };

  // 4. Time Series Calculation
  const dateMap = new Map<string, DateSeries>();
  for (const r of rows) {
    if (!r.orderDate) continue;
    const dayKey = r.orderDate.toISOString().slice(0, 10);
    if (!dateMap.has(dayKey)) {
      dateMap.set(dayKey, {
        label: r.orderDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        date: r.orderDate,
        grossSales: 0,
        settlement: 0,
        productCost: 0,
        profit: 0,
        orders: 0,
        delivered: 0,
        returns: 0,
        rto: 0,
      });
    }
    const bucket = dateMap.get(dayKey)!;
    bucket.orders++;
    bucket.grossSales += r.listingPrice * r.quantity;
    bucket.settlement += r.finalSettlementAmount;
    if (r.isDelivered) bucket.delivered++;
    if (r.isCustomerReturn) bucket.returns++;
    if (r.isRTO) bucket.rto++;
  }

  const profitTimeSeries = Array.from(dateMap.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(b => {
      const avgCost = b.grossSales * (defaultUnitCostPct / 100);
      return {
        ...b,
        productCost: avgCost,
        profit: b.settlement - avgCost,
      };
    });

  // 5. Bad Catalog Categorization
  const remove = productMetrics.filter(p => p.recommendation === 'remove');
  const pause = productMetrics.filter(p => p.recommendation === 'pause');
  const fix = productMetrics.filter(p => p.recommendation === 'fix');
  const scale = productMetrics.filter(p => p.recommendation === 'scale');

  // 6. Return Analysis
  const topCustomerReturnSkus = [...productMetrics]
    .filter(p => p.customerReturns > 0)
    .sort((a, b) => b.customerReturnRate - a.customerReturnRate);

  const topRTOSkus = [...productMetrics]
    .filter(p => p.rtoOrders > 0)
    .sort((a, b) => b.rtoRate - a.rtoRate);

  const returnRows = options.returnRows || [];
  const hasReturnSheetData = returnRows.length > 0;
  const returnReasonSummary = buildReturnReasonSummary(returnRows);
  const globalVariationStats = buildVariationStats(returnRows);
  const courierRtoStats = buildCourierRtoStats(returnRows);

  const returnAnalysis: ReturnAnalysis = {
    totalOrders,
    deliveredCount: deliveredOrders,
    customerReturns,
    rtoCount: rtoOrders,
    customerReturnRate: pct(customerReturns, totalOrders),
    rtoRate: pct(rtoOrders, totalOrders),
    totalReturnRate: pct(totalReturnsAndRTO, totalOrders),
    totalReturnShippingLoss: Math.abs(totalReturnShippingDeducted),
    topCustomerReturnSkus,
    topRTOSkus,
    catalogReturnBreakdown: buildCatalogReturnBreakdown(rows, pct, returnRows),
    hasReturnSheetData,
    returnReasonSummary,
    variationStats: globalVariationStats,
    courierRtoStats,
  };

  // 7. Catalog / Category Breakdown
  const catMap = new Map<string, MeeshoOrderRow[]>();
  for (const r of rows) {
    const catId = r.catalogId || 'Other';
    if (!catMap.has(catId)) catMap.set(catId, []);
    catMap.get(catId)!.push(r);
  }

  const catalogBreakdown: CatalogMetrics[] = Array.from(catMap.entries()).map(([catalogId, catRows]) => {
    const del = catRows.filter(r => r.isDelivered).length;
    const ret = catRows.filter(r => r.isCustomerReturn).length;
    const rto = catRows.filter(r => r.isRTO).length;
    const catGross = catRows.reduce((s, r) => s + r.listingPrice * r.quantity, 0);
    const catSettlement = catRows.reduce((s, r) => s + r.finalSettlementAmount, 0);
    const catCost = del * (catGross / catRows.length) * (defaultUnitCostPct / 100);
    const catProfit = catSettlement - catCost;
    const skusInCat = new Set(catRows.map(r => r.sku)).size;

    return {
      catalogId,
      name: catRows[0]?.productName.slice(0, 45) + '...' || `Catalog ${catalogId}`,
      skuCount: skusInCat,
      totalOrders: catRows.length,
      deliveredOrders: del,
      customerReturns: ret,
      rtoOrders: rto,
      returnRate: pct(ret + rto, catRows.length),
      grossSales: catGross,
      totalSettlement: catSettlement,
      netProfit: catProfit,
      profitMargin: catGross > 0 ? pct(catProfit, catGross) : 0,
    };
  }).sort((a, b) => b.totalOrders - a.totalOrders);

  // 8. Actionable Insights Generator
  const insights: Insight[] = [];
  let insId = 0;
  const addIns = (type: InsightType, priority: Insight['priority'], title: string, description: string, extras: Partial<Insight> = {}) => {
    insights.push({ id: String(++insId), type, priority, title, description, ...extras });
  };

  // Critical Return Shipping Drain
  if (Math.abs(totalReturnShippingDeducted) > 2000) {
    addIns(
      'remove',
      'high',
      `You lost ${formatINR(totalReturnShippingDeducted)} in Customer Return Shipping Penalties!`,
      `Meesho deducted ${formatINR(totalReturnShippingDeducted)} from your payout because ${customerReturns} orders were returned by customers. Each customer return costs ₹150–₹175. Stop high-return SKUs immediately to save this money.`,
      { value: formatINR(totalReturnShippingDeducted) + ' lost' }
    );
  }

  // Remove Products Alert
  if (remove.length > 0) {
    const lostByRemove = remove.reduce((s, p) => s + Math.abs(p.returnShippingDeducted), 0);
    addIns(
      'remove',
      'high',
      `Remove or Stop ${remove.length} Loss-Making SKU${remove.length > 1 ? 's' : ''}`,
      `${remove.map(p => p.sku).slice(0, 4).join(', ')} have high customer return rates (up to ${Math.max(...remove.map(p => p.customerReturnRate))}%) causing heavy return penalties.`,
      {
        affectedSkus: remove.map(p => `${p.sku}: ${p.productName.slice(0, 30)}...`),
        value: `${formatINR(lostByRemove)} penalties`,
        actionLabel: 'Remove from Meesho Catalog',
      }
    );
  }

  // Scale Up Winner SKUs
  if (scale.length > 0) {
    const profitByScale = scale.reduce((s, p) => s + p.netProfit, 0);
    addIns(
      'scale',
      'medium',
      `Scale Up ${scale.length} Winning Product${scale.length > 1 ? 's' : ''} with Ads`,
      `${scale.map(p => p.sku).join(', ')} have high delivery rates (>65%), low customer returns (<10%), and generated ${formatINR(profitByScale)} profit. Run Meesho Ads and increase stock for these.`,
      {
        affectedSkus: scale.map(p => `${p.sku} (${p.deliveredOrders} delivered)`),
        value: `${formatINR(profitByScale)} profit`,
        actionLabel: 'Boost Ads & Inventory',
      }
    );
  }

  // RTO Alert
  if (summary.rtoRate > 20) {
    addIns(
      'pause',
      'high',
      `High Courier RTO Rate (${summary.rtoRate}%) â€” ${summary.rtoOrders} orders failed at doorstep`,
      `Unlike customer returns, RTO occurs before delivery (fake customer, address error, buyer refusal). Check if specific pin codes or states have higher RTO, and verify buyers before dispatching expensive orders.`,
      { value: `${summary.rtoOrders} RTO Orders` }
    );
  }

  // Ads Cost vs Sales (ACOS)
  if (totalAdsCost > 0) {
    const acos = grossSales > 0 ? pct(totalAdsCost, grossSales) : 0;
    addIns(
      'ads',
      acos > 15 ? 'high' : 'medium',
      `Total Ads Spent: ${formatINR(totalAdsCost)} (${acos}% ACOS)`,
      `You spent ${formatINR(totalAdsCost)} on Meesho Ads. Your Ads Cost is ${acos}% of total gross sales. ${acos > 15 ? 'Target an ACOS under 10% for healthy net margins.' : 'Good ACOS control!'}`
    );
  }

  // TCS / TDS credit reminder
  if (Math.abs(totalTCS) + Math.abs(totalTDS) > 0) {
    const totalTax = Math.abs(totalTCS) + Math.abs(totalTDS);
    addIns(
      'info',
      'low',
      `Claim ${formatINR(totalTax)} TCS & TDS in your GST / Income Tax Returns`,
      `Meesho deducted ${formatINR(totalTCS)} in TCS (1% GST) and ${formatINR(totalTDS)} in TDS (Section 194O). You can claim 100% of this as tax credit in your GST and ITR filings.`,
      { value: `${formatINR(totalTax)} Tax Credit` }
    );
  }

  // Overall Net Margin Status
  if (netProfit < 0) {
    addIns(
      'trend',
      'high',
      `You are operating at a NET LOSS of ${formatINR(netProfit)}!`,
      `Your Meesho bank settlement (${formatINR(totalSettlementAmount)}) was insufficient to cover your product costs and ads. Cut losing SKUs and focus only on winning catalogs.`,
      { value: `${formatINR(netProfit)} Loss` }
    );
  } else {
    addIns(
      'trend',
      'low',
      `Net Profit: ${formatINR(netProfit)} (${netProfitMargin}% Margin)`,
      `After accounting for all Meesho settlements, product costs (estimated ${defaultUnitCostPct}%), and ads, you earned ${formatINR(netProfit)} net cash.`
    );
  }

  return {
    summary,
    profitTimeSeries,
    products: productMetrics,
    topProducts: [...productMetrics].sort((a, b) => b.netProfit - a.netProfit),
    worstProducts: [...productMetrics].sort((a, b) => a.netProfit - b.netProfit),
    badCatalog: { remove, pause, fix, scale },
    returnAnalysis,
    catalogBreakdown,
    adsSummary: {
      totalAdsCost,
      deductions: adsDeductions,
    },
    insights,
    totalRows: totalRawRows || totalOrders,
    parsedRows: totalOrders,
    skippedRows,
    warnings,
    settings: {
      defaultUnitCostPct,
      packagingCostPerOrder,
    },
  };
}


