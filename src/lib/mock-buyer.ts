export type BuyerFormData = {
  name: string;
  email: string;
  password: string;
};

export type RegistrationResult = {
  success: boolean;
  id: string;
  error?: string;
};

export async function registerBuyer(_data: BuyerFormData): Promise<RegistrationResult> {
  await new Promise((r) => setTimeout(r, 1500));
  return { success: true, id: `buyer_${Date.now()}` };
}
