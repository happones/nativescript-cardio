import { Common } from './cardio.common';

import * as app from "tns-core-modules/application";
import * as permissions from "nativescript-permissions";

declare var io: any;

export class Cardio  {

    onScan(): Promise<any> {

        return new Promise(function (resolve, reject) {

            if ((<any>android.support.v4.content.ContextCompat).checkSelfPermission(
                app.android.currentContext,
                (<any>android).Manifest.permission.CAMERA) !== android.content.pm.PackageManager.PERMISSION_GRANTED) {

                reject(new Error("Application does not have permissions to use Camera"));

                return;
            }


            let activity = app.android.foregroundActivity || app.android.startActivity;

            try {
                var scanIntent = new android.content.Intent(activity, io.card.payment.CardIOActivity.class);
                // customize these values to suit your needs.
                scanIntent.putExtra(io.card.payment.CardIOActivity.EXTRA_REQUIRE_EXPIRY, true); // default: false
                scanIntent.putExtra(io.card.payment.CardIOActivity.EXTRA_REQUIRE_CVV, false); // default: false
                scanIntent.putExtra(io.card.payment.CardIOActivity.EXTRA_REQUIRE_POSTAL_CODE, false); // default: false
        
                // MY_SCAN_REQUEST_CODE is arbitrary and is only used within this activity.
                activity.startActivityForResult(scanIntent, 1777);
            } catch(error) {
                reject(error);
            }
        

            try {
                activity.onActivityResult = function(requestCode, resultCode, data) {
        
                    if (requestCode == 1777) {
                        var resultDisplayStr = "";
                        if (data != null && data.hasExtra(io.card.payment.CardIOActivity.EXTRA_SCAN_RESULT)) {
                            var scanResult = data.getParcelableExtra(io.card.payment.CardIOActivity.EXTRA_SCAN_RESULT);
            
                            // Never log a raw card number. Avoid displaying it, but if necessary use getFormattedCardNumber()
                            resultDisplayStr = "Card Number: " + scanResult.getRedactedCardNumber() + "\n";
            
                            // Do something with the raw number, e.g.:
                            // myService.setCardNumber( scanResult.cardNumber );
            
                            if (scanResult.isExpiryValid()) {
                                resultDisplayStr += "Expiration Date: " + scanResult.expiryMonth + "/" + scanResult.expiryYear + "\n";
                            }
            
                            if (scanResult.cvv != null) {
                                // Never log or display a CVV
                                resultDisplayStr += "CVV has " + scanResult.cvv.length() + " digits.\n";
                            }
            
                            if (scanResult.postalCode != null) {
                                resultDisplayStr += "Postal Code: " + scanResult.postalCode + "\n";
                            }
                        }
                        else {
                            resultDisplayStr = "Scan was canceled.";
                        }
                        // do something with resultDisplayStr, maybe display it in a textView
                        console.log(resultDisplayStr);
                        resolve(resultDisplayStr);
                    }
                    // else handle other activity results
                    reject("other activity results");
                }
            } catch(error) {
                reject(error);
            }
        });
    }
}

export let requestPermissions = function () {
    return permissions.requestPermissions([
      (<any>android).Manifest.permission.WRITE_EXTERNAL_STORAGE,
      (<any>android).Manifest.permission.CAMERA
    ]);
};