import { LeadStatus } from "../types/domain";

export const getLeadStatusTone = (
  status: LeadStatus
): "teal" | "amber" | "rose" | "violet" => {
  if (status === LeadStatus.Qualified) {
    return "teal";
  }

  if (status === LeadStatus.Contacted) {
    return "violet";
  }

  if (status === LeadStatus.Lost) {
    return "rose";
  }

  return "amber";
};
