import '../../stencil.core';
import { ComponentInterface, EventEmitter, QueueApi } from '../../stencil.core';
import { Mode, PickerColumn } from '../../interface';
/**
 * @internal
 */
export declare class PickerColumnCmp implements ComponentInterface {
    mode: Mode;
    private bounceFrom;
    private lastIndex?;
    private minY;
    private maxY;
    private optHeight;
    private rotateFactor;
    private scaleFactor;
    private velocity;
    private y;
    private optsEl?;
    private gesture?;
    private rafId;
    private tmrId;
    private noAnimate;
    el: HTMLElement;
    queue: QueueApi;
    /**
     * Emitted when the selected value has changed
     * @internal
     */
    ionPickerColChange: EventEmitter<PickerColumn>;
    /** Picker column data */
    col: PickerColumn;
    protected colChanged(): void;
    componentWillLoad(): void;
    componentDidLoad(): Promise<void>;
    componentDidUnload(): void;
    private emitColChange;
    private setSelected;
    private update;
    private decelerate;
    private indexForY;
    private onStart;
    private onMove;
    private onEnd;
    private refresh;
    hostData(): {
        class: {
            [x: string]: boolean;
            'picker-col': boolean;
            'picker-opts-left': boolean;
            'picker-opts-right': boolean;
        };
        style: {
            'max-width': string | undefined;
        };
    };
    render(): (JSX.Element | undefined)[];
}
