import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { createLead, updateLead } from "../../api/leadApi";
import { ApiError } from "../../lib/apiClient";
import { leadSourceOptions, leadStatusOptions } from "../../lib/options";
import { leadFormSchema, type LeadFormValues } from "../../lib/validation";
import { type PublicLead } from "../../types/api";
import { LeadSource, LeadStatus } from "../../types/domain";
import { type FormMode } from "../../types/ui";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { Panel } from "../ui/Panel";
import { SegmentedControl } from "../ui/SegmentedControl";
import { SelectInput } from "../ui/SelectInput";
import { TextInput } from "../ui/TextInput";

interface LeadFormProps {
  selectedLead: PublicLead | null;
  token: string;
  onSaved: (lead: PublicLead, mode: FormMode) => void;
}

type SubmitState = "idle" | "success" | "error";

interface SubmitFeedback {
  state: SubmitState;
  message: string;
}

const formModeOptions = [
  {
    label: "Create",
    value: "create"
  },
  {
    label: "Edit",
    value: "edit"
  }
] as const;

const createDefaults: LeadFormValues = {
  name: "",
  email: "",
  status: LeadStatus.New,
  source: LeadSource.Website
};

const toLeadFormValues = (lead: PublicLead): LeadFormValues => {
  return {
    email: lead.email,
    name: lead.name,
    source: lead.source,
    status: lead.status
  };
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Lead could not be saved";
};

export const LeadForm = ({ onSaved, selectedLead, token }: LeadFormProps): JSX.Element => {
  const [mode, setMode] = useState<FormMode>("create");
  const [feedback, setFeedback] = useState<SubmitFeedback>({
    state: "idle",
    message: ""
  });

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: createDefaults,
    mode: "onTouched"
  });

  useEffect(() => {
    if (mode === "edit" && selectedLead) {
      form.reset(toLeadFormValues(selectedLead));
    } else {
      form.reset(createDefaults);
    }

    setFeedback({
      state: "idle",
      message: ""
    });
  }, [form, mode, selectedLead]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setFeedback({
        state: "idle",
        message: ""
      });

      const savedLead =
        mode === "create"
          ? await createLead(token, values)
          : selectedLead
            ? await updateLead(token, selectedLead.id, values)
            : null;

      if (!savedLead) {
        throw new Error("Select a lead before editing");
      }

      onSaved(savedLead, mode);

      if (mode === "create") {
        form.reset(createDefaults);
      }

      setFeedback({
        state: "success",
        message: mode === "create" ? "Lead created successfully." : "Lead updated successfully."
      });
    } catch (error: unknown) {
      setFeedback({
        state: "error",
        message: getErrorMessage(error)
      });
    }
  });

  return (
    <Panel>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">Lead Form</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {mode === "create" ? "Create lead records" : "Update the selected lead"}
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SegmentedControl<FormMode>
            label="Form mode"
            onChange={setMode}
            options={formModeOptions}
            renderIcon={(value) =>
              value === "create" ? (
                <Plus aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Pencil aria-hidden="true" className="h-4 w-4" />
              )
            }
            value={mode}
          />
        </div>
      </div>

      {feedback.state === "success" ? (
        <div className="mt-5">
          <Alert title="Lead saved" tone="success">
            {feedback.message}
          </Alert>
        </div>
      ) : null}

      {feedback.state === "error" ? (
        <div className="mt-5">
          <Alert title="Lead error" tone="error">
            {feedback.message}
          </Alert>
        </div>
      ) : null}

      {mode === "edit" && !selectedLead ? (
        <div className="mt-5">
          <Alert title="Select a lead" tone="info">
            Choose a lead from the list before editing.
          </Alert>
        </div>
      ) : null}

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            autoComplete="name"
            error={form.formState.errors.name?.message}
            label="Name"
            placeholder="Rahul Mehta"
            type="text"
            {...form.register("name")}
          />
          <TextInput
            autoComplete="email"
            error={form.formState.errors.email?.message}
            label="Email"
            placeholder="rahul@example.com"
            type="email"
            {...form.register("email")}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectInput
            error={form.formState.errors.status?.message}
            label="Status"
            options={leadStatusOptions}
            {...form.register("status")}
          />
          <SelectInput
            error={form.formState.errors.source?.message}
            label="Source"
            options={leadSourceOptions}
            {...form.register("source")}
          />
        </div>
        <div className="flex justify-end">
          <Button
            disabled={mode === "edit" && !selectedLead}
            icon={<Save aria-hidden="true" className="h-4 w-4" />}
            isLoading={form.formState.isSubmitting}
            type="submit"
          >
            Save Lead
          </Button>
        </div>
      </form>
    </Panel>
  );
};
