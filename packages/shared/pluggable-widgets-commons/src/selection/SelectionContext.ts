import { ActionValue, ListValue } from "mendix";
import { createContext, Context, useContext, useMemo } from "react";
import { SelectionWrapperImpl, SelectionWrapper } from "./SelectionWrapper";
import type { SelectionSingleValue, SelectionMultiValue } from "./tmp-pluggable-types";

const CONTEXT_OBJECT_PATH = "com.mendix.widgets.web.selectable.selectionContext" as const;

declare global {
    interface Window {
        [CONTEXT_OBJECT_PATH]?: SelectionContextObject;
    }
}

export interface SelectionAPI {
    selection: SelectionWrapper | undefined;
}
type SelectionContextValue = undefined | SelectionAPI;
type SelectionContextObject = Context<SelectionContextValue>;

export function getGlobalSelectionContext(): SelectionContextObject {
    if (window[CONTEXT_OBJECT_PATH] === undefined) {
        window[CONTEXT_OBJECT_PATH] = createContext<SelectionContextValue>(undefined);
    }

    return window[CONTEXT_OBJECT_PATH]!;
}

export function useCreateSelectionAPI(
    property: SelectionSingleValue | SelectionMultiValue,
    datasource: ListValue,
    onChange: ActionValue | undefined
): SelectionAPI {
    const api = useMemo(() => {
        const api: SelectionAPI = { selection: undefined };

        if (property) {
            api.selection = new SelectionWrapperImpl(property, datasource, onChange);
        }

        return api;
    }, [property, datasource, onChange]);

    return api;
}

type SelectionAPIMeta =
    | {
          hasError: true;
          error: Error;
      }
    | {
          hasError: false;
          value: SelectionWrapper | undefined;
      };
export function useSelectionAPI(): SelectionAPIMeta {
    const value = useContext(getGlobalSelectionContext());

    if (!value) {
        return { error: new Error("Out of SelectionAPIProvider"), hasError: true };
    } else {
        return { value: value.selection, hasError: false };
    }
}
