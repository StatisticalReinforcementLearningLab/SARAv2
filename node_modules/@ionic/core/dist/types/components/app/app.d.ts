import { ComponentInterface, QueueApi } from '../../stencil.core';
import { Config, Mode } from '../../interface';
export declare class App implements ComponentInterface {
    mode: Mode;
    el: HTMLElement;
    win: Window;
    config: Config;
    queue: QueueApi;
    componentDidLoad(): void;
    hostData(): {
        class: {
            [x: string]: boolean;
            'ion-page': boolean;
            'force-statusbar-padding': boolean;
        };
    };
}
