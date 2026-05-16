import { useEffect, useMemo, useReducer } from "react";

import { getLeadById, getLeads } from "../api/leadApi";
import { ApiError } from "../lib/apiClient";
import { type LeadListData, type PublicLead } from "../types/api";
import { type LeadListQuery } from "../types/leads";

type AsyncStatus = "idle" | "loading" | "success" | "error";

interface LeadsState {
  status: AsyncStatus;
  data: LeadListData | null;
  error: string | null;
}

type LeadsAction =
  | {
      type: "loading";
    }
  | {
      type: "success";
      payload: LeadListData;
    }
  | {
      type: "error";
      payload: string;
    }
  | {
      type: "idle";
    };

const initialLeadsState: LeadsState = {
  status: "idle",
  data: null,
  error: null
};

const leadsReducer = (state: LeadsState, action: LeadsAction): LeadsState => {
  switch (action.type) {
    case "idle":
      return initialLeadsState;
    case "loading":
      return {
        ...state,
        status: "loading",
        error: null
      };
    case "success":
      return {
        status: "success",
        data: action.payload,
        error: null
      };
    case "error":
      return {
        status: "error",
        data: null,
        error: action.payload
      };
  }
};

interface LeadDetailsState {
  status: AsyncStatus;
  data: PublicLead | null;
  error: string | null;
}

type LeadDetailsAction =
  | {
      type: "idle";
    }
  | {
      type: "loading";
    }
  | {
      type: "success";
      payload: PublicLead;
    }
  | {
      type: "error";
      payload: string;
    };

const initialLeadDetailsState: LeadDetailsState = {
  status: "idle",
  data: null,
  error: null
};

const leadDetailsReducer = (
  state: LeadDetailsState,
  action: LeadDetailsAction
): LeadDetailsState => {
  switch (action.type) {
    case "idle":
      return initialLeadDetailsState;
    case "loading":
      return {
        ...state,
        status: "loading",
        error: null
      };
    case "success":
      return {
        status: "success",
        data: action.payload,
        error: null
      };
    case "error":
      return {
        status: "error",
        data: null,
        error: action.payload
      };
  }
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Request was cancelled";
  }

  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

export const useLeads = (
  token: string | null,
  query: LeadListQuery,
  refreshKey: number
): LeadsState => {
  const [state, dispatch] = useReducer(leadsReducer, initialLeadsState);
  const queryKey = useMemo(() => JSON.stringify(query), [query]);

  useEffect(() => {
    if (!token) {
      dispatch({
        type: "idle"
      });
      return;
    }

    const controller = new AbortController();

    dispatch({
      type: "loading"
    });

    void getLeads(token, query, controller.signal)
      .then((data) => {
        dispatch({
          type: "success",
          payload: data
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        dispatch({
          type: "error",
          payload: getErrorMessage(error)
        });
      });

    return () => {
      controller.abort();
    };
  }, [query, queryKey, refreshKey, token]);

  return state;
};

export const useLeadDetails = (
  token: string | null,
  leadId: string | null,
  refreshKey: number
): LeadDetailsState => {
  const [state, dispatch] = useReducer(leadDetailsReducer, initialLeadDetailsState);

  useEffect(() => {
    if (!token || !leadId) {
      dispatch({
        type: "idle"
      });
      return;
    }

    const controller = new AbortController();

    dispatch({
      type: "loading"
    });

    void getLeadById(token, leadId, controller.signal)
      .then((data) => {
        dispatch({
          type: "success",
          payload: data
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        dispatch({
          type: "error",
          payload: getErrorMessage(error)
        });
      });

    return () => {
      controller.abort();
    };
  }, [leadId, refreshKey, token]);

  return state;
};
