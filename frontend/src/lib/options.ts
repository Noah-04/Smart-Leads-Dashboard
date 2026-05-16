import { LeadSource, LeadStatus, type SelectOption, UserRole } from "../types/domain";

export const userRoleOptions: readonly SelectOption<UserRole>[] = [
  {
    label: "Admin",
    value: UserRole.Admin
  },
  {
    label: "Sales User",
    value: UserRole.SalesUser
  }
];

export const leadStatusOptions: readonly SelectOption<LeadStatus>[] = [
  {
    label: "New",
    value: LeadStatus.New
  },
  {
    label: "Contacted",
    value: LeadStatus.Contacted
  },
  {
    label: "Qualified",
    value: LeadStatus.Qualified
  },
  {
    label: "Lost",
    value: LeadStatus.Lost
  }
];

export const leadSourceOptions: readonly SelectOption<LeadSource>[] = [
  {
    label: "Website",
    value: LeadSource.Website
  },
  {
    label: "Instagram",
    value: LeadSource.Instagram
  },
  {
    label: "Referral",
    value: LeadSource.Referral
  }
];
