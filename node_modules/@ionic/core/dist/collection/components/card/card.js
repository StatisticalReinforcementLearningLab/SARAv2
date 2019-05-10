import { createColorClasses, openURL } from '../../utils/theme';
export class Card {
    constructor() {
        this.button = false;
        this.type = 'button';
        this.disabled = false;
        this.routerDirection = 'forward';
    }
    isClickable() {
        return (this.href !== undefined || this.button);
    }
    hostData() {
        return {
            class: Object.assign({ [`${this.mode}`]: true }, createColorClasses(this.color), { 'card-disabled': this.disabled, 'ion-activatable': this.isClickable() })
        };
    }
    render() {
        const clickable = this.isClickable();
        if (!clickable) {
            return [
                h("slot", null)
            ];
        }
        const { href, mode, win, routerDirection, type } = this;
        const TagType = clickable ? (href === undefined ? 'button' : 'a') : 'div';
        const attrs = TagType === 'button' ? { type } : { href };
        return (h(TagType, Object.assign({}, attrs, { class: "card-native", disabled: this.disabled, onClick: (ev) => openURL(win, href, ev, routerDirection) }),
            h("slot", null),
            clickable && mode === 'md' && h("ion-ripple-effect", null)));
    }
    static get is() { return "ion-card"; }
    static get encapsulation() { return "scoped"; }
    static get properties() { return {
        "button": {
            "type": Boolean,
            "attr": "button"
        },
        "color": {
            "type": String,
            "attr": "color"
        },
        "disabled": {
            "type": Boolean,
            "attr": "disabled"
        },
        "href": {
            "type": String,
            "attr": "href"
        },
        "mode": {
            "type": String,
            "attr": "mode"
        },
        "routerDirection": {
            "type": String,
            "attr": "router-direction"
        },
        "type": {
            "type": String,
            "attr": "type"
        },
        "win": {
            "context": "window"
        }
    }; }
    static get style() { return "/**style-placeholder:ion-card:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-card:**/"; }
}
