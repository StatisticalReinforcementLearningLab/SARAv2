export class CardContent {
    hostData() {
        return {
            class: {
                [`${this.mode}`]: true,
                [`card-content-${this.mode}`]: true
            }
        };
    }
    static get is() { return "ion-card-content"; }
    static get properties() { return {
        "mode": {
            "type": String,
            "attr": "mode"
        }
    }; }
    static get style() { return "/**style-placeholder:ion-card-content:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-card-content:**/"; }
}
