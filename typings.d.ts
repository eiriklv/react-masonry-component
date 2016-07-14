import { Component } from "react";

declare module "react-masonry-component" {

    export interface MasonryOptions {
        columnWidth?: number;
        itemSelector?: string;
        gutter?: number;
        percentPosition?: boolean;
        stamp?: string;
        fitWidth?: boolean;
        originLeft?: boolean;
        originTop?: boolean;
        containerStyle?: Object;
        transitionDuration?: string;
        resize?: boolean;
        initLayout?: boolean;
    }

    interface MasonryPropTypes {
        disableImagesLoaded?: boolean;
        updateOnEachImageLoad?: boolean;
        onImagesLoaded?: (instance: any) => void;
        options?: MasonryOptions;
        className?: string;
        elementType?: string;
        style?: Object;
    }

    export default class Masonry extends Component<MasonryPropTypes, void> { }
}