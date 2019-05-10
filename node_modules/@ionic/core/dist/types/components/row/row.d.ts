import '../../stencil.core';
import { ComponentInterface } from '../../stencil.core';
import { Mode } from '../../interface';
export declare class Row implements ComponentInterface {
    mode: Mode;
    hostData(): {
        class: {
            [x: string]: boolean;
        };
    };
    render(): JSX.Element;
}
