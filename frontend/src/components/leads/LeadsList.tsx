import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

import { formatDateTime } from "../../lib/format";
import { getLeadStatusTone } from "../../lib/leadPresentation";
import { type LeadListData, type PublicLead } from "../../types/api";
import { Alert } from "../ui/Alert";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { LoadingState } from "../ui/LoadingState";
import { Panel } from "../ui/Panel";

interface LeadsListProps {
  data: LeadListData | null;
  error: string | null;
  isLoading: boolean;
  selectedLeadId: string | null;
  onPageChange: (page: number) => void;
  onSelectLead: (leadId: string) => void;
}

const LeadRow = ({
  isSelected,
  lead,
  onSelectLead
}: {
  isSelected: boolean;
  lead: PublicLead;
  onSelectLead: (leadId: string) => void;
}): JSX.Element => {
  return (
    <button
      className={
        isSelected
          ? "grid w-full gap-3 rounded-md border border-teal-300 bg-teal-50 p-4 text-left shadow-sm dark:border-teal-800 dark:bg-teal-950/40"
          : "grid w-full gap-3 rounded-md border border-slate-200 bg-white p-4 text-left transition hover:border-teal-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-teal-800 dark:hover:bg-slate-900"
      }
      onClick={() => onSelectLead(lead.id)}
      type="button"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Eye aria-hidden="true" className="h-4 w-4 text-slate-400" />
            <p className="truncate font-medium text-slate-950 dark:text-white">{lead.name}</p>
          </div>
          <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{lead.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={getLeadStatusTone(lead.status)}>{lead.status}</Badge>
          <Badge>{lead.source}</Badge>
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Created {formatDateTime(lead.createdAt)}
      </p>
    </button>
  );
};

export const LeadsList = ({
  data,
  error,
  isLoading,
  onPageChange,
  onSelectLead,
  selectedLeadId
}: LeadsListProps): JSX.Element => {
  const leads = data?.leads ?? [];
  const pagination = data?.pagination ?? null;

  return (
    <Panel>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">Leads List</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {pagination ? `${pagination.totalRecords} total records` : "Backend results"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {error ? (
          <Alert title="Could not load leads" tone="error">
            {error}
          </Alert>
        ) : null}

        {isLoading && !data ? <LoadingState label="Loading leads" /> : null}

        {!isLoading && !error && data && leads.length === 0 ? (
          <EmptyState
            description="Adjust the filters or add a new lead from the API."
            title="No leads found"
          />
        ) : null}

        {leads.length > 0 ? (
          <div className="grid gap-3">
            {isLoading ? <LoadingState label="Refreshing leads" /> : null}
            {leads.map((lead) => (
              <LeadRow
                isSelected={selectedLeadId === lead.id}
                key={lead.id}
                lead={lead}
                onSelectLead={onSelectLead}
              />
            ))}
          </div>
        ) : null}
      </div>

      {pagination ? (
        <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
          </p>
          <div className="flex gap-2">
            <Button
              disabled={!pagination.hasPreviousPage || isLoading}
              icon={<ChevronLeft aria-hidden="true" className="h-4 w-4" />}
              onClick={() => onPageChange(pagination.page - 1)}
              variant="secondary"
            >
              Previous
            </Button>
            <Button
              disabled={!pagination.hasNextPage || isLoading}
              icon={<ChevronRight aria-hidden="true" className="h-4 w-4" />}
              onClick={() => onPageChange(pagination.page + 1)}
              variant="secondary"
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </Panel>
  );
};
