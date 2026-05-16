import { Search } from "lucide-react";

import { leadSourceOptions, leadStatusOptions } from "../../lib/options";
import { type SelectOption } from "../../types/domain";
import {
  type LeadFilterState,
  type LeadSort,
  type SourceFilter,
  type StatusFilter
} from "../../types/leads";
import { Panel } from "../ui/Panel";
import { SelectInput } from "../ui/SelectInput";
import { TextInput } from "../ui/TextInput";

interface LeadFiltersProps {
  filters: LeadFilterState;
  isSearchDebouncing: boolean;
  onChange: (filters: LeadFilterState) => void;
}

const statusFilterOptions: readonly SelectOption<StatusFilter>[] = [
  {
    label: "All Statuses",
    value: "all"
  },
  ...leadStatusOptions
];

const sourceFilterOptions: readonly SelectOption<SourceFilter>[] = [
  {
    label: "All Sources",
    value: "all"
  },
  ...leadSourceOptions
];

const sortOptions: readonly SelectOption<LeadSort>[] = [
  {
    label: "Latest",
    value: "latest"
  },
  {
    label: "Oldest",
    value: "oldest"
  }
];

export const LeadFilters = ({
  filters,
  isSearchDebouncing,
  onChange
}: LeadFiltersProps): JSX.Element => {
  return (
    <Panel>
      <div className="grid gap-4 lg:grid-cols-[minmax(240px,1fr)_180px_180px_160px]">
        <TextInput
          icon={<Search aria-hidden="true" className="h-4 w-4" />}
          label="Search"
          onChange={(event) => {
            onChange({
              ...filters,
              page: 1,
              searchInput: event.target.value
            });
          }}
          placeholder="Search name or email"
          type="search"
          value={filters.searchInput}
        />
        <SelectInput
          label="Status"
          onChange={(event) => {
            onChange({
              ...filters,
              page: 1,
              status: event.target.value as StatusFilter
            });
          }}
          options={statusFilterOptions}
          value={filters.status}
        />
        <SelectInput
          label="Source"
          onChange={(event) => {
            onChange({
              ...filters,
              page: 1,
              source: event.target.value as SourceFilter
            });
          }}
          options={sourceFilterOptions}
          value={filters.source}
        />
        <SelectInput
          label="Sort"
          onChange={(event) => {
            onChange({
              ...filters,
              page: 1,
              sort: event.target.value as LeadSort
            });
          }}
          options={sortOptions}
          value={filters.sort}
        />
      </div>
      {isSearchDebouncing ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Searching...</p>
      ) : null}
    </Panel>
  );
};
