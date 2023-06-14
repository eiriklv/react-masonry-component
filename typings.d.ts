import { ComponentClass } from "react";

export interface MasonryOptions {
    columnWidth?: number | string | HTMLElement | null;
    itemSelector?: string;
    gutter?: number | string;
    percentPosition?: boolean;
    horizontalOrder?: boolean;
    stamp?: string;
    fitWidth?: boolean;
    originLeft?: boolean;
    originTop?: boolean;
    containerStyle?: Object;
    transitionDuration?: number | string;
    resize?: boolean;
    initLayout?: boolean;
}

// https://imagesloaded.desandro.com/#background
export interface ImagesLoadedOptions {
    background?: string
    // something todo
}

export interface MasonryPropTypes {
    enableResizableChildren?: boolean;
    disableImagesLoaded?: boolean;
    updateOnEachImageLoad?: boolean;
    onImagesLoaded?: (instance: any) => void;
    options?: MasonryOptions;
    className?: string;
    elementType?: string;
    style?: Object;
    onLayoutComplete?: (instance: any) => void;
    onRemoveComplete?: (instance: any) => void;
    // for tsx
    children?: any
    imagesLoadedOptions?: ImagesLoadedOptions
}

declare const Masonry: ComponentClass<MasonryPropTypes>;
export as namespace Masonry;
export default Masonry;
