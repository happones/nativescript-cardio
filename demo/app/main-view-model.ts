import { Observable } from 'tns-core-modules/data/observable';
import { Cardio } from 'nativescript-cardio';

export class HelloWorldModel extends Observable {
  public message: string;
  private cardio: Cardio;

  constructor() {
    super();

    this.cardio = new Cardio();
    this.message = this.cardio.message;
  }
}
