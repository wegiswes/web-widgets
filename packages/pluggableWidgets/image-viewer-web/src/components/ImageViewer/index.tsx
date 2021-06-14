import { createElement, CSSProperties, FunctionComponent, useCallback } from "react";
import { HeightUnitEnum, WidthUnitEnum, OnClickTypeEnum } from "../../../typings/ImageViewerProps";
import { useLightboxState } from "../../utils/lightboxState";
import { ImageViewerUi, ImageViewerContentProps } from "./ui";
import { Lightbox, LightboxProps } from "../Lightbox";

import "../../ui/ImageViewer.scss";

export type ImageViewerImageProps = {
    type: "image" | "icon";
    image: string | undefined;
};

export interface ImageViewerProps extends ImageViewerImageProps {
    class: string;
    style?: CSSProperties;
    widthUnit: WidthUnitEnum;
    width: number;
    heightUnit: HeightUnitEnum;
    height: number;
    iconSize: number;
    responsive: boolean;
    onClickType: OnClickTypeEnum;
    onClick?: () => void;
}

export const ImageViewer: FunctionComponent<ImageViewerProps> = ({
    class: className,
    style,
    widthUnit,
    width,
    heightUnit,
    height,
    iconSize,
    responsive,
    onClickType,
    onClick,
    type,
    image
}) => {
    const { lightboxIsOpen, openLightbox, closeLightbox } = useLightboxState();

    const onCloseLightbox = useCallback<LightboxProps["onClose"]>(
        event => {
            event?.stopPropagation();
            closeLightbox();
        },
        [closeLightbox]
    );

    const onImageClick = useCallback<ImageViewerContentProps["onClick"]>(
        event => {
            event.stopPropagation();
            if (lightboxIsOpen) {
                return;
            }
            if (onClickType === "action") {
                onClick?.();
            } else if (onClickType === "enlarge") {
                openLightbox();
            }
        },
        [onClick, onClickType, openLightbox, lightboxIsOpen]
    );

    const sharedContentProps: ImageViewerContentProps = {
        style,
        onClick: onImageClick
    };

    const content =
        type === "image" ? (
            <ImageViewerUi.Image
                image={image}
                height={height}
                heightUnit={heightUnit}
                width={width}
                widthUnit={widthUnit}
                {...sharedContentProps}
            />
        ) : (
            <ImageViewerUi.Glyphicon icon={image} size={iconSize} {...sharedContentProps} />
        );

    return (
        <ImageViewerUi.Wrapper
            className={className}
            responsive={responsive}
            hasImage={image !== undefined && image.length > 0}
        >
            {content}
            {lightboxIsOpen && (
                <Lightbox isOpen={lightboxIsOpen} onClose={onCloseLightbox}>
                    {content}
                </Lightbox>
            )}
        </ImageViewerUi.Wrapper>
    );
};
