import '../../stencil.core';
import { ComponentInterface } from '../../stencil.core';
import { Mode } from '../../interface';
export declare class Grid implements ComponentInterface {
    mode: Mode;
    /**
     * If `true`, the grid will have a fixed width based on the screen size.
     */
    fixed: boolean;
    hostData(): {
        class: {
            [x: string]: boolean;
            'grid-fixed': boolean;
        };
    };
    render(): JSX.Element;
}
