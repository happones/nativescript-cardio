import { Observable } from 'tns-core-modules/data/observable';
import { Cardio, requestPermissions } from 'nativescript-cardio';

export class HelloWorldModel extends Observable {

    private cardio: Cardio;

    constructor() {
        super();
        this.cardio = new Cardio();
    }

    onScanPress() {
        requestPermissions().then(
            () => {
                console.log("perismos dados");
                this.cardio.onScan().then(
                    (data) => {
                        console.log(data);
                    }, (error) => {
                        console.log(error);
                    }
                );
            }, () => {
                console.log("permissions neged");
            }
        );
    }
}
