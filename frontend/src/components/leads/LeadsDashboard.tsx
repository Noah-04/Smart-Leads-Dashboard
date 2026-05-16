import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { deleteLead, exportLeadsCsv } from "../../api/leadApi";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useLeadDetails, useLeads } from "../../hooks/useLeads";
import { ApiError } from "../../lib/apiClient";
import { type PublicLead } from "../../types/api";
import { LeadSource, LeadStatus, UserRole } from "../../types/domain";
import { type LeadFilterState, type LeadListQuery } from "../../types/leads";
import { type AuthSession } from "../../types/session";
import { type FormMode } from "../../types/ui";
import { LeadForm } from "../forms/LeadForm";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { LeadDetailsView } from "./LeadDetailsView";
import { LeadFilters } from "./LeadFilters";
import { LeadsList } from "./LeadsList";

interface LeadsDashboardProps {
  session: AuthSession;
}

const initialFilters: LeadFilterState = {
  page: 1,
  searchInput: "",
  sort: "latest",
  source: "all",
  status: "all"
};

const toLeadQuery = (
  filters: LeadFilterState,
  debouncedSearch: string
): LeadListQuery => {
  const trimmedSearch = debouncedSearch.trim();

  return {
    page: filters.page,
    search: trimmedSearch.length > 0 ? trimmedSearch : undefined,
    sort: filters.sort,
    source: filters.source === "all" ? undefined : (filters.source as LeadSource),
    status: filters.status === "all" ? undefined : (filters.status as LeadStatus)
  };
};

const getMutationErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Lead operation failed";
};

const fallbackCsvFilename = (): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `leads-export-${timestamp}.csv`;
};

const downloadCsvFile = (blob: Blob, filename: string | null): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename ?? fallbackCsvFilename();
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const LeadsDashboard = ({ session }: LeadsDashboardProps): JSX.Element => {
  const [filters, setFilters] = useState<LeadFilterState>(initialFilters);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(filters.searchInput, 450);
  const query = useMemo<LeadListQuery>(() => {
    return toLeadQuery(filters, debouncedSearch);
  }, [debouncedSearch, filters]);
  const leadsState = useLeads(session.accessToken, query, refreshKey);
  const leadDetailsState = useLeadDetails(session.accessToken, selectedLeadId, refreshKey);
  const leads = leadsState.data?.leads ?? [];
  const canDeleteLeads = session.user.role === UserRole.Admin;

  useEffect(() => {
    if (leads.length === 0) {
      setSelectedLeadId(null);
      return;
    }

    const selectedLeadStillVisible = leads.some((lead) => lead.id === selectedLeadId);

    if (!selectedLeadStillVisible) {
      setSelectedLeadId(leads[0]?.id ?? null);
    }
  }, [leads, selectedLeadId]);

  const refreshLeads = (): void => {
    setRefreshKey((currentKey) => currentKey + 1);
  };

  const handleLeadSaved = (lead: PublicLead, mode: FormMode): void => {
    setMutationError(null);
    setSelectedLeadId(lead.id);
    setFilters((currentFilters) => ({
      ...currentFilters,
      page: mode === "create" ? 1 : currentFilters.page,
      sort: mode === "create" ? "latest" : currentFilters.sort
    }));
    refreshLeads();
  };

  const handleDeleteLead = async (leadId: string): Promise<void> => {
    const shouldDelete = window.confirm("Delete this lead permanently?");

    if (!shouldDelete) {
      return;
    }

    try {
      setMutationError(null);
      setIsDeleting(true);
      await deleteLead(session.accessToken, leadId);
      setSelectedLeadId(null);
      refreshLeads();
    } catch (error: unknown) {
      setMutationError(getMutationErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCsv = async (): Promise<void> => {
    const { page: _page, ...exportQuery } = query;

    try {
      setMutationError(null);
      setIsExporting(true);
      const file = await exportLeadsCsv(session.accessToken, exportQuery);
      downloadCsvFile(file.blob, file.filename);
    } catch (error: unknown) {
      setMutationError(getMutationErrorMessage(error));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Leads Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Search, filter, paginate, and inspect leads
          </p>
        </div>
        <Button
          icon={<Download aria-hidden="true" className="h-4 w-4" />}
          isLoading={isExporting}
          onClick={() => {
            void handleExportCsv();
          }}
          variant="secondary"
        >
          Export CSV
        </Button>
      </div>

      {mutationError ? (
        <Alert title="Lead operation failed" tone="error">
          {mutationError}
        </Alert>
      ) : null}

      <LeadFilters
        filters={filters}
        isSearchDebouncing={filters.searchInput.trim() !== debouncedSearch.trim()}
        onChange={setFilters}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <LeadsList
          data={leadsState.data}
          error={leadsState.error}
          isLoading={leadsState.status === "loading"}
          onPageChange={(page) => {
            setFilters((currentFilters) => ({
              ...currentFilters,
              page
            }));
          }}
          onSelectLead={setSelectedLeadId}
          selectedLeadId={selectedLeadId}
        />
        <div className="grid gap-5 xl:self-start">
          <LeadDetailsView
            canDelete={canDeleteLeads}
            data={leadDetailsState.data}
            error={leadDetailsState.error}
            isDeleting={isDeleting}
            isLoading={leadDetailsState.status === "loading"}
            onDelete={(leadId) => {
              void handleDeleteLead(leadId);
            }}
            selectedLeadId={selectedLeadId}
          />
          <LeadForm
            onSaved={handleLeadSaved}
            selectedLead={leadDetailsState.data}
            token={session.accessToken}
          />
          {!canDeleteLeads ? (
            <EmptyState
              description="Sales users can create, view, and update leads, but deletion is restricted to Admin accounts."
              title="Delete restricted"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};
