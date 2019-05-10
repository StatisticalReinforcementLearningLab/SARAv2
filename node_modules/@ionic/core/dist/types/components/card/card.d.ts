import '../../stencil.core';
import { ComponentInterface } from '../../stencil.core';
import { Color, Mode, RouterDirection } from '../../interface';
export declare class Card implements ComponentInterface {
    win: Window;
    /**
     * The color to use from your application's color palette.
     * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
     * For more information on colors, see [theming](/docs/theming/basics).
     */
    color?: Color;
    /**
     * The mode determines which platform styles to use.
     */
    mode: Mode;
    /**
     * If `true`, a button tag will be rendered and the card will be tappable.
     */
    button: boolean;
    /**
     * The type of the button. Only used when an `onclick` or `button` property is present.
     */
    type: 'submit' | 'reset' | 'button';
    /**
     * If `true`, the user cannot interact with the card.
     */
    disabled: boolean;
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
    private isClickable;
    hostData(): {
        class: {
            'card-disabled': boolean;
            'ion-activatable': boolean;
        } | {
            'card-disabled': boolean;
            'ion-activatable': boolean;
        };
    };
    render(): JSX.Element;
}
