export interface ShippingOption {
  id: string;
  name: string;
  amount: number;
  formattedAmount: string;
  estimatedDays: string;
  description: string;
  isDefault?: boolean;
}

export interface CheckoutConfig {
  storeName: string;
  brandTagline: string;
  storeOwnerEmail: string;
  currency: string;
  currencySymbol: string;
  defaultCountry: string;
  supportedCountries: string[];
  shippingOptions: ShippingOption[];
  importantInformationNotes: string[];
}

export const CHECKOUT_CONFIG: CheckoutConfig = {
  storeName: "calligraphy__by_ulain8261",
  brandTagline: "Art Gallery & Original Paintings",
  storeOwnerEmail: "asiamubeenwarraich@gmail.com",
  currency: "PKR",
  currencySymbol: "Rs.",
  defaultCountry: "Pakistan",
  supportedCountries: [
    "Pakistan",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Saudi Arabia",
    "Canada"
  ],
  shippingOptions: [
    {
      id: "standard",
      name: "Standard Delivery",
      amount: 200,
      formattedAmount: "Rs. 200",
      estimatedDays: "3–5 working days",
      description: "Insured nationwide ground transit with reinforced packing",
      isDefault: true,
    },
    {
      id: "express",
      name: "Express Delivery",
      amount: 500,
      formattedAmount: "Rs. 500",
      estimatedDays: "1–2 working days",
      description: "Priority expedited art courier with direct signature verification",
      isDefault: false,
    },
  ],
  importantInformationNotes: [
    "Original paintings are carefully packed before dispatch.",
    "Nationwide delivery is available across Pakistan.",
    "Estimated delivery time will be shown on the shipping step.",
    "For international orders, shipping charges may vary.",
  ],
};
