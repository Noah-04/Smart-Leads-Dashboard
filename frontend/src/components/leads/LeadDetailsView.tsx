import { CalendarClock, Mail, Trash2, UserRound } from "lucide-react";

import { formatDateTime } from "../../lib/format";
import { getLeadStatusTone } from "../../lib/leadPresentation";
import { type PublicLead } from "../../types/api";
import { Alert } from "../ui/Alert";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { LoadingState } from "../ui/LoadingState";
import { Panel } from "../ui/Panel";

interface LeadDetailsViewProps {
  data: PublicLead | null;
  error: string | null;
  canDelete: boolean;
  isDeleting: boolean;
  isLoading: boolean;
  onDelete: (leadId: string) => void;
  selectedLeadId: string | null;
}

export const LeadDetailsView = ({
  canDelete,
  data,
  error,
  isDeleting,
  isLoading,
  onDelete,
  selectedLeadId
}: LeadDetailsViewProps): JSX.Element => {
  return (
    <Panel>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">Lead Details</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Single lead view</p>
        </div>
        {canDelete && data ? (
          <Button
            icon={<Trash2 aria-hidden="true" className="h-4 w-4" />}
            isLoading={isDeleting}
            onClick={() => onDelete(data.id)}
            size="sm"
            variant="danger"
          >
            Delete
          </Button>
        ) : null}
      </div>

      <div className="mt-5">
        {!selectedLeadId ? (
          <EmptyState description="Select a lead from the list." title="No lead selected" />
        ) : null}

        {isLoading ? <LoadingState label="Loading lead details" /> : null}

        {error ? (
          <Alert title="Could not load lead" tone="error">
            {error}
          </Alert>
        ) : null}

        {!isLoading && !error && data ? (
          <div className="space-y-4">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <UserRound aria-hidden="true" className="h-4 w-4 text-slate-400" />
                    <p className="truncate font-medium text-slate-950 dark:text-white">{data.name}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Mail aria-hidden="true" className="h-4 w-4" />
                    <span className="truncate">{data.email}</span>
                  </div>
                </div>
                <Badge tone={getLeadStatusTone(data.status)}>{data.status}</Badge>
              </div>
            </div>

            <dl className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 p-3 dark:border-slate-800">
                <dt className="text-slate-500 dark:text-slate-400">Source</dt>
                <dd className="font-medium text-slate-950 dark:text-white">{data.source}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 p-3 dark:border-slate-800">
                <dt className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <CalendarClock aria-hidden="true" className="h-4 w-4" />
                  Created
                </dt>
                <dd className="text-right font-medium text-slate-950 dark:text-white">
                  {formatDateTime(data.createdAt)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 p-3 dark:border-slate-800">
                <dt className="text-slate-500 dark:text-slate-400">Updated</dt>
                <dd className="text-right font-medium text-slate-950 dark:text-white">
                  {formatDateTime(data.updatedAt)}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}
      </div>
    </Panel>
  );
};
