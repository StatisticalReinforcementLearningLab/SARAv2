export class Footer {
    constructor() {
        this.translucent = false;
    }
    hostData() {
        return {
            class: {
                [`${this.mode}`]: true,
                [`footer-${this.mode}`]: true,
                [`footer-translucent`]: this.translucent,
                [`footer-translucent-${this.mode}`]: this.translucent,
            }
        };
    }
    static get is() { return "ion-footer"; }
    static get properties() { return {
        "mode": {
            "type": String,
            "attr": "mode"
        },
        "translucent": {
            "type": Boolean,
            "attr": "translucent"
        }
    }; }
    static get style() { return "/**style-placeholder:ion-footer:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-footer:**/"; }
}
