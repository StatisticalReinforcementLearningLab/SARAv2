import { h } from '../ionic.core.js';

import { c as createColorClasses } from './chunk-2f96b3d2.js';

class Text {
    hostData() {
        return {
            class: Object.assign({}, createColorClasses(this.color), { [`${this.mode}`]: true })
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-text"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "color": {
            "type": String,
            "attr": "color"
        },
        "mode": {
            "type": String,
            "attr": "mode"
        }
    }; }
    static get style() { return ":host(.ion-color){color:var(--ion-color-base)}"; }
}

export { Text as IonText };
