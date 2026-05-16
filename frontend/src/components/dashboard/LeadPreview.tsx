import { Clock, Mail, UserRound } from "lucide-react";

import { type LeadFormValues } from "../../lib/validation";
import { LeadStatus } from "../../types/domain";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { LoadingState } from "../ui/LoadingState";
import { Panel } from "../ui/Panel";

interface LeadPreviewProps {
  lead: LeadFormValues | null;
  isLoading: boolean;
}

const statusTone = (status: LeadStatus): "teal" | "amber" | "rose" | "violet" => {
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

export const LeadPreview = ({ isLoading, lead }: LeadPreviewProps): JSX.Element => {
  return (
    <Panel>
      <div>
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">Lead Preview</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Latest validated lead</p>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <LoadingState label="Preparing lead preview" />
        ) : lead ? (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <UserRound aria-hidden="true" className="h-4 w-4 text-slate-400" />
                  <p className="truncate font-medium text-slate-950 dark:text-white">{lead.name}</p>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Mail aria-hidden="true" className="h-4 w-4" />
                  <span className="truncate">{lead.email}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone={statusTone(lead.status)}>{lead.status}</Badge>
                <Badge tone="neutral">{lead.source}</Badge>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <Clock aria-hidden="true" className="h-4 w-4" />
              <span>Ready for API submission</span>
            </div>
          </div>
        ) : (
          <EmptyState
            description="Submit the lead form to see a validated record."
            title="No lead selected"
          />
        )}
      </div>
    </Panel>
  );
};
