import '../../stencil.core';
import { ComponentInterface } from '../../stencil.core';
import { Color, Mode, RouterDirection } from '../../interface';
export declare class Anchor implements ComponentInterface {
    mode: Mode;
    win: Window;
    /**
     * The color to use from your application's color palette.
     * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
     * For more information on colors, see [theming](/docs/theming/basics).
     */
    color?: Color;
    /**
     * Contains a URL or a URL fragment that the hyperlink points to.
     * If this property is set, an anchor tag will be rendered.
     */
    href?: string;
    /**
     * When using a router, it specifies the transition direction when navigating to
     * another page using `href`.
     */
    routerDirection: RouterDirection;
    onClick(ev: Event): void;
    hostData(): {
        class: {
            'ion-activatable': boolean;
        } | {
            [x: string]: boolean;
            'ion-activatable': boolean;
        };
    };
    render(): JSX.Element;
}
