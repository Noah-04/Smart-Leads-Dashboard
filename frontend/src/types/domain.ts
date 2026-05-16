export enum UserRole {
  Admin = "Admin",
  SalesUser = "Sales User"
}

export enum LeadStatus {
  New = "New",
  Contacted = "Contacted",
  Qualified = "Qualified",
  Lost = "Lost"
}

export enum LeadSource {
  Website = "Website",
  Instagram = "Instagram",
  Referral = "Referral"
}

export interface SelectOption<TValue extends string> {
  label: string;
  value: TValue;
}
