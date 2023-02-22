import { StructurePreviewProps } from "@mendix/pluggable-widgets-commons";
import {
    hidePropertiesIn,
    hidePropertyIn,
    Problem,
    Properties,
    transformGroupsIntoTabs
} from "@mendix/pluggable-widgets-tools";
import { container, dropzone, rowLayout, text } from "@mendix/pluggable-widgets-commons/dist/structure-preview-api";
import { GalleryPreviewProps } from "../typings/GalleryProps";

export function getProperties(
    values: GalleryPreviewProps,
    defaultProperties: Properties,
    platform: "web" | "desktop"
): Properties {
    if (values.pagination !== "buttons") {
        hidePropertyIn(defaultProperties, values, "pagingPosition");
    }

    if (values.showEmptyPlaceholder === "none") {
        hidePropertyIn(defaultProperties, values, "emptyPlaceholder");
    }

    if (values.filterList?.length === 0 && values.sortList?.length === 0 && values.itemSelection === "None") {
        hidePropertyIn(defaultProperties, values, "filtersPlaceholder");
    }

    if (values.itemSelection === "None") {
        hidePropertyIn(defaultProperties, values, "onSelectionChange");
    }

    if (platform === "web") {
        if (!values.advanced) {
            hidePropertiesIn(defaultProperties, values, [
                "pagination",
                "pagingPosition",
                "showEmptyPlaceholder",
                "emptyPlaceholder",
                "itemClass",
                "filtersPlaceholder",
                "filterList",
                "sortList",
                "emptyMessageTitle",
                "filterSectionTitle"
            ]);
        }

        transformGroupsIntoTabs(defaultProperties);
    } else {
        hidePropertyIn(defaultProperties, values, "advanced");
    }

    return defaultProperties;
}

export function check(values: GalleryPreviewProps): Problem[] {
    const errors: Problem[] = [];
    if (!values.desktopItems || values.desktopItems < 1 || values.desktopItems > 12) {
        errors.push({
            property: "desktopItems",
            message: "Desktop items must be a number between 1 and 12"
        });
    }
    if (!values.phoneItems || values.phoneItems < 1 || values.phoneItems > 12) {
        errors.push({
            property: "phoneItems",
            message: "Phone items must be a number between 1 and 12"
        });
    }
    if (!values.tabletItems || values.tabletItems < 1 || values.tabletItems > 12) {
        errors.push({
            property: "tabletItems",
            message: "Tablet items must be a number between 1 and 12"
        });
    }
    if (values.itemSelection !== "None" && values.onClick !== null) {
        errors.push({
            property: "onClick",
            message: '"On click action" must be set to "Do nothing" when "Selection" is enabled'
        });
    }
    return errors;
}

export function getPreview(values: GalleryPreviewProps, isDarkMode: boolean): StructurePreviewProps {
    const titleHeader = rowLayout({
        columnSize: "fixed",
        backgroundColor: isDarkMode ? "#3B5C8F" : "#DAEFFB",
        borders: true,
        borderWidth: 1
    })(
        container({
            padding: 4
        })(text({ fontColor: isDarkMode ? "#6DB1FE" : "#2074C8" })("Gallery"))
    );

    const headerEnabled = values.filterList.length > 0 || values.sortList.length > 0 || values.itemSelection !== "None";
    const header =
        headerEnabled &&
        rowLayout({
            columnSize: "fixed",
            borders: true
        })(
            dropzone(dropzone.placeholder("Gallery header: place data control widgets here"))(values.filtersPlaceholder)
        );

    const content = container({
        borders: true
    })(
        rowLayout({
            columnSize: "fixed"
        })(dropzone(dropzone.placeholder("Gallery item: place widgets here"))(values.content)),
        rowLayout({
            columnSize: "grow"
        })(
            container({ grow: 1 })(),
            container({ grow: 0 })(
                text({
                    fontColor: isDarkMode ? "#DEDEDE" : "#899499"
                })(
                    `Desktop ${values.desktopItems} ${getSingularPlural("Column", values.desktopItems!)}, Tablet ${
                        values.tabletItems
                    } ${getSingularPlural("Column", values.tabletItems!)}, Phone ${
                        values.phoneItems
                    } ${getSingularPlural("Column", values.phoneItems!)}`
                )
            )
        )
    );

    const footerEnabled = values.showEmptyPlaceholder === "custom";
    const footer =
        footerEnabled &&
        rowLayout({
            columnSize: "fixed",
            borders: true
        })(dropzone(dropzone.placeholder("Empty list message: place widgets here"))(values.emptyPlaceholder));

    return container()(titleHeader, header, content, footer);
}

function getSingularPlural(word: string, elements: number): string {
    return elements > 1 ? word + "s" : word;
}
