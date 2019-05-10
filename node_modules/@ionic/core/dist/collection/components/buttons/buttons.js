export class Buttons {
    hostData() {
        return {
            class: {
                [`${this.mode}`]: true
            }
        };
    }
    static get is() { return "ion-buttons"; }
    static get encapsulation() { return "scoped"; }
    static get style() { return "/**style-placeholder:ion-buttons:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-buttons:**/"; }
}
