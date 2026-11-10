import Engine, { ProductInfo, PurchaseInfo } from '../../modules/omniscan-engine';

export const PRODUCT_MONTHLY = 'omniscan_pro_monthly';
export const PRODUCT_LIFETIME = 'omniscan_pro_lifetime';
const PRO_IDS = [PRODUCT_MONTHLY, PRODUCT_LIFETIME];

export interface Plans {
  monthly?: ProductInfo;
  lifetime?: ProductInfo;
  storeReady: boolean;
}

let connected = false;

async function connect(): Promise<boolean> {
  if (connected) return true;
  try {
    connected = await Engine.billingConnect();
  } catch {
    connected = false;
  }
  return connected;
}

export async function loadPlans(): Promise<Plans> {
  if (!(await connect())) return { storeReady: false };
  try {
    const list = await Engine.billingQueryProducts([PRODUCT_MONTHLY], [PRODUCT_LIFETIME]);
    return {
      monthly: list.find((p) => p.productId === PRODUCT_MONTHLY),
      lifetime: list.find((p) => p.productId === PRODUCT_LIFETIME),
      storeReady: list.length > 0,
    };
  } catch {
    return { storeReady: false };
  }
}

export function activeProProduct(purchases: PurchaseInfo[]): string | undefined {
  return purchases.find((p) => p.state === 'purchased' && PRO_IDS.includes(p.productId))?.productId;
}

/** Returns the owned Pro product id, null if store answered "none", or undefined if the store is unreachable. */
export async function checkOwnedPro(): Promise<string | null | undefined> {
  if (!(await connect())) return undefined;
  try {
    return activeProProduct(await Engine.billingQueryPurchases()) ?? null;
  } catch {
    return undefined;
  }
}

export async function buy(plan: ProductInfo): Promise<boolean> {
  if (!(await connect())) return false;
  return Engine.billingPurchase(plan.productId, plan.type, plan.offerToken ?? null);
}

export function onPurchases(cb: (owned: string | undefined, code: number) => void) {
  return Engine.addListener('onPurchasesUpdated', (e) => cb(activeProProduct(e.purchases), e.code));
}
