import '../../stencil.core';
import { ComponentInterface, EventEmitter, EventListenerEnable, QueueApi } from '../../stencil.core';
import { Config, MenuChangeEventDetail, MenuControllerI, MenuI, Mode, Side } from '../../interface';
export declare class Menu implements ComponentInterface, MenuI {
    private animation?;
    private lastOnEnd;
    private gesture?;
    private blocker;
    mode: Mode;
    isAnimating: boolean;
    width: number;
    _isOpen: boolean;
    backdropEl?: HTMLElement;
    menuInnerEl?: HTMLElement;
    contentEl?: HTMLElement;
    menuCtrl?: MenuControllerI;
    el: HTMLIonMenuElement;
    isPaneVisible: boolean;
    isEndSide: boolean;
    config: Config;
    isServer: boolean;
    lazyMenuCtrl: HTMLIonMenuControllerElement;
    enableListener: EventListenerEnable;
    win: Window;
    queue: QueueApi;
    doc: Document;
    /**
     * The content's id the menu should use.
     */
    contentId?: string;
    /**
     * An id for the menu.
     */
    menuId?: string;
    /**
     * The animation type of the menu.
     * Available options: `"overlay"`, `"reveal"`, `"push"`.
     * Custom animations can be registered by the menu controller.
     */
    type?: string;
    typeChanged(type: string, oldType: string | undefined): void;
    /**
     * If `true`, the menu is disabled.
     */
    disabled: boolean;
    protected disabledChanged(): void;
    /**
     * Which side of the view the menu should be placed.
     */
    side: Side;
    protected sideChanged(): void;
    /**
     * If `true`, swiping the menu is enabled.
     */
    swipeGesture: boolean;
    protected swipeGestureChanged(): void;
    /**
     * The edge threshold for dragging the menu open.
     * If a drag/swipe happens over this value, the menu is not triggered.
     */
    maxEdgeStart: number;
    /**
     * Emitted when the menu is about to be opened.
     */
    ionWillOpen: EventEmitter<void>;
    /**
     * Emitted when the menu is about to be closed.
     */
    ionWillClose: EventEmitter<void>;
    /**
     * Emitted when the menu is open.
     */
    ionDidOpen: EventEmitter<void>;
    /**
     * Emitted when the menu is closed.
     */
    ionDidClose: EventEmitter<void>;
    /**
     * Emitted when the menu state is changed.
     * @internal
     */
    protected ionMenuChange: EventEmitter<MenuChangeEventDetail>;
    componentWillLoad(): Promise<void>;
    componentDidLoad(): void;
    componentDidUnload(): void;
    onSplitPaneChanged(ev: CustomEvent): void;
    onBackdropClick(ev: any): void;
    /**
     * Get whether or not the menu is open. Returns `true` if the menu is open.
     */
    isOpen(): Promise<boolean>;
    /**
     * Get whether or not the menu is active. Returns `true` if the menu is active.
     *
     * A menu is active when it can be opened or closed, meaning it's enabled
     * and it's not part of an `ion-split-pane`.
     */
    isActive(): Promise<boolean>;
    /**
     * Open the menu. Returns `false` if the menu is already open or it can't be opened.
     *
     * @param animated If `true`, the menu will animate on open.
     */
    open(animated?: boolean): Promise<boolean>;
    /**
     * Close the menu. Returns `false` if the menu is already closed or it can't be closed.
     *
     * @param animated If `true`, the menu will animate on close.
     */
    close(animated?: boolean): Promise<boolean>;
    /**
     * Toggle the menu open or closed. If the menu is already open, it will try to
     * close the menu, otherwise it will try to open it. Returns `false` if
     * the operation can't be completed successfully.
     *
     * @param animated If `true`, the menu will animate on open and close.
     */
    toggle(animated?: boolean): Promise<boolean>;
    /**
     * Sets the menu to open or closed.
     * Returns `false` if the operation can't be completed successfully.
     *
     * @param shouldOpen If `true`, the menu should open.
     * @param animated If `true`, the menu will animate on open and close.
     */
    setOpen(shouldOpen: boolean, animated?: boolean): Promise<boolean>;
    _setOpen(shouldOpen: boolean, animated?: boolean): Promise<boolean>;
    private loadAnimation;
    private startAnimation;
    private _isActive;
    private canSwipe;
    private canStart;
    private onWillStart;
    private onStart;
    private onMove;
    private onEnd;
    private beforeAnimation;
    private afterAnimation;
    private updateState;
    private forceClosing;
    hostData(): {
        role: string;
        class: {
            [x: string]: boolean;
            'menu-enabled': boolean;
            'menu-side-end': boolean;
            'menu-side-start': boolean;
            'menu-pane-visible': boolean;
        };
    };
    render(): JSX.Element[];
}
