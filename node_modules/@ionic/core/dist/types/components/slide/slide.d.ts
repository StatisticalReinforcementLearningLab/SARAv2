import { ComponentInterface } from '../../stencil.core';
import { EventEmitter } from 'ionicons/dist/types/stencil.core';
import { Mode } from '../../interface';
export declare class Slide implements ComponentInterface {
    mode: Mode;
    /** @internal */
    ionSlideChanged: EventEmitter<void>;
    componentDidLoad(): void;
    componentDidUnload(): void;
    hostData(): {
        class: {
            [x: string]: boolean;
            'swiper-slide': boolean;
            'swiper-zoom-container': boolean;
        };
    };
}
