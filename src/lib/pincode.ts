export interface PincodeRule {
  min: number;
  max: number;
  name: string;
}

// Completely Disable COD
export const HIGH_RTO_ZONES: PincodeRule[] = [
  { min: 190001, max: 194999, name: "Jammu & Kashmir / Ladakh" },
  { min: 790001, max: 792999, name: "Arunachal Pradesh" },
  { min: 797001, max: 798999, name: "Nagaland" },
  { min: 796001, max: 796999, name: "Mizoram" },
  { min: 795001, max: 795999, name: "Manipur" },
  { min: 793001, max: 794999, name: "Meghalaya" },
  { min: 744101, max: 744999, name: "Andaman & Nicobar" },
  { min: 682551, max: 682559, name: "Lakshadweep" },
];

// Restrict COD (prepaid only)
export const RESTRICTED_ZONES: PincodeRule[] = [
  { min: 800001, max: 855999, name: "Bihar" },
  { min: 201000, max: 285999, name: "Uttar Pradesh" },
  { min: 822001, max: 835999, name: "Jharkhand" },
  { min: 721000, max: 743999, name: "West Bengal" },
  { min: 494001, max: 497999, name: "Chhattisgarh" },
  { min: 759001, max: 770999, name: "Odisha" },
];

// Major cities in restricted zones where COD is allowed
export const EXCEPTION_ZONES: PincodeRule[] = [
  { min: 201301, max: 201314, name: "Noida" }, // Adjust Noida range
  { min: 226001, max: 226030, name: "Lucknow" },
  { min: 208001, max: 208025, name: "Kanpur" },
];

export function checkCodEligibility(pincodeStr: string): { eligible: boolean; message?: string } {
  const pin = parseInt(pincodeStr.trim(), 10);
  if (isNaN(pin) || pin < 100000 || pin > 999999) {
    return { eligible: true }; // Let other validations handle invalid pin
  }

  // Check exceptions first
  for (const rule of EXCEPTION_ZONES) {
    if (pin >= rule.min && pin <= rule.max) {
      return { eligible: true };
    }
  }

  // Check High RTO (Disabled)
  for (const rule of HIGH_RTO_ZONES) {
    if (pin >= rule.min && pin <= rule.max) {
      return { eligible: false, message: `COD is not available for ${rule.name}` };
    }
  }

  // Check Restricted (Prepaid Only)
  for (const rule of RESTRICTED_ZONES) {
    if (pin >= rule.min && pin <= rule.max) {
      return { eligible: false, message: `COD is not available for ${rule.name}` };
    }
  }

  return { eligible: true };
}
