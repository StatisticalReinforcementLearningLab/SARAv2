import '../../stencil.core';
import { ComponentInterface } from '../../stencil.core';
import { Mode } from '../../interface';
export declare class FabList implements ComponentInterface {
    mode: Mode;
    el: HTMLIonFabElement;
    /**
     * If `true`, the fab list will show all fab buttons in the list.
     */
    activated: boolean;
    protected activatedChanged(activated: boolean): void;
    /**
     * The side the fab list will show on relative to the main fab button.
     */
    side: 'start' | 'end' | 'top' | 'bottom';
    hostData(): {
        class: {
            [x: string]: boolean;
            'fab-list-active': boolean;
        };
    };
    render(): JSX.Element;
}
