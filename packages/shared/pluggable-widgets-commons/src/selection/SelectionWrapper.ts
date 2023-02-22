import { ActionValue, ListValue, ObjectItem } from "mendix";
import type { SelectionSingleValue, SelectionMultiValue } from "./tmp-pluggable-types";

type SelectionProperty = SelectionSingleValue | SelectionMultiValue;
type SelectionType = "Single" | "Multi";
type SelectionStatus = "all" | "some" | "none";

export interface SelectionWrapper {
    type: SelectionType;
    selectionStatus: SelectionStatus;
    isSelected(value: ObjectItem): boolean;
    add(value: ObjectItem): void;
    remove(value: ObjectItem): void;
    selectAll(): void;
    selectNone(): void;
}

export class SelectionWrapperImpl implements SelectionWrapper {
    private property: SelectionProperty;
    private list: ListValue;
    private onChange: ActionValue | undefined;

    constructor(property: SelectionProperty, datasource: ListValue, onChange: ActionValue | undefined) {
        this.property = property;
        this.list = datasource;
        this.onChange = onChange;
    }

    get type(): SelectionType {
        return this.property.type;
    }

    get selectionStatus(): SelectionStatus {
        if (this.property.type === "Single") {
            throw new Error("Status not available in single selection mode.");
        }
        if (this.property.selection.length === 0) {
            return "none";
        }
        const selectedIds = new Set(this.property.selection.map(obj => obj.id));
        const isAll = (this.list.items ?? []).every(obj => selectedIds.has(obj.id));
        return isAll ? "all" : "some";
    }

    add(value: ObjectItem): void {
        if (this.property.type === "Single") {
            this.setSelection(value);
        } else {
            if (!this.isSelected(value)) {
                this.setSelection(this.property.selection.concat(value));
            }
        }
    }

    remove(value: ObjectItem): void {
        if (this.property.type === "Single") {
            this.setSelection(undefined);
        } else {
            if (this.isSelected(value)) {
                this.setSelection(this.property.selection.filter(obj => obj.id !== value.id));
            }
        }
    }

    isSelected(value: ObjectItem): boolean {
        if (this.property.type === "Single") {
            return this.property.selection?.id === value.id;
        } else {
            return this.property.selection.some(obj => obj.id === value.id);
        }
    }

    selectAll(): void {
        if (this.property.type === "Single") {
            throw new Error("selectAll method is not available in single selection mode.");
        }

        if (this.list.status !== "available") {
            throw new Error("Cannot select all when datasource is not available.");
        }

        this.setSelection(this.list.items ?? []);
    }

    selectNone(): void {
        if (this.property.type === "Single") {
            throw new Error("selectNone method is not available in single selection mode.");
        }

        if (this.list.status !== "available") {
            throw new Error("Cannot clear selection when datasource is not available.");
        }

        this.setSelection([]);
    }

    private setSelection(value: ObjectItem | undefined | ObjectItem[]): void {
        if (Array.isArray(value)) {
            if (this.property.type === "Multi") {
                this.property.setSelection(value);
            }
        } else if (this.property.type === "Single") {
            this.property.setSelection(value);
        } else {
            throw new Error("Cannot apply new value to current selection type");
        }

        if (this.onChange?.canExecute && !this.onChange.isExecuting) {
            this.onChange.execute();
        }
    }
}
