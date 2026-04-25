export type MerchantFormData = {
  businessName: string;
  location: { lat: number; lng: number; address: string };
  email: string;
  password: string;
};

export type RegistrationResult = {
  success: boolean;
  id: string;
  error?: string;
};

export async function registerMerchant(_data: MerchantFormData): Promise<RegistrationResult> {
  await new Promise((r) => setTimeout(r, 1500));
  return { success: true, id: `merchant_${Date.now()}` };
}
