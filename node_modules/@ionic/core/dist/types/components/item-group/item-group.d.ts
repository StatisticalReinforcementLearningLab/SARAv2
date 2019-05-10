import { ComponentInterface } from '../../stencil.core';
import { Mode } from '../../interface';
export declare class ItemGroup implements ComponentInterface {
    mode: Mode;
    hostData(): {
        'role': string;
        class: {
            [x: string]: boolean;
            'item': boolean;
        };
    };
}
