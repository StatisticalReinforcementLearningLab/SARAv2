import { ComponentInterface } from '../../stencil.core';
import { Mode } from '../../interface';
export declare class Buttons implements ComponentInterface {
    mode: Mode;
    hostData(): {
        class: {
            [x: string]: boolean;
        };
    };
}
