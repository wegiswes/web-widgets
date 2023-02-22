import type { ObjectItem } from "mendix";

type Option<T> = T | undefined;

interface SelectionValue<T> {
    /**
     * The current value of this selection.
     *
     * @beta
     */
    readonly selection: T;

    /**
     * Sets the value of this selection.
     *
     * @param value The new selection.
     *
     * @throws if the value is not valid for this selection, such as <code>undefined</code> for a multi-selection or an {@link ObjectItem} which
     * belongs to a different data source.
     *
     * @remark
     * This function returns nothing, but will cause the widget to receive new props.
     *
     * @beta
     */
    readonly setSelection: (value: T) => void;
}

export type SelectionSingleValue = SelectionValue<Option<ObjectItem>> & { type: "Single" };

export type SelectionMultiValue = SelectionValue<ObjectItem[]> & { type: "Multi" };
