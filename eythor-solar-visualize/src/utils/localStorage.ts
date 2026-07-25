export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  purpose: string;
  kilowatts: string;
  houseNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  action: string;
}

const CUSTOMER_KEY = 'eythor_customer_info';

export function saveCustomerInfo(info: Partial<CustomerInfo>): void {
  const existing = getCustomerInfo() || {} as CustomerInfo;
  const merged = { ...existing, ...info };
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(merged));
}

export function getCustomerInfo(): CustomerInfo | null {
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CustomerInfo;
  } catch {
    return null;
  }
}

export function clearCustomerInfo(): void {
  localStorage.removeItem(CUSTOMER_KEY);
}