import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';
export class AlertController {
    create(options) {
        return createOverlay(this.doc.createElement('ion-alert'), options);
    }
    dismiss(data, role, id) {
        return dismissOverlay(this.doc, data, role, 'ion-alert', id);
    }
    async getTop() {
        return getOverlay(this.doc, 'ion-alert');
    }
    static get is() { return "ion-alert-controller"; }
    static get properties() { return {
        "create": {
            "method": true
        },
        "dismiss": {
            "method": true
        },
        "doc": {
            "context": "document"
        },
        "getTop": {
            "method": true
        }
    }; }
}
