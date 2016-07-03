import * as React from "react";

declare module "react-masonry-component" {

    interface MasonryPropTypes {
        disableImagesLoaded?: boolean;
        updateOnEachImageLoad?: boolean;
        onImagesLoaded?: (instance: any) => void;
        options?: Object;
        className?: string;
        elementType?: string;
    }

    export var Masonry: React.Component<MasonryPropTypes, void>;
}