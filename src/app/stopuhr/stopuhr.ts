import {Component, signal} from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-stopuhr',
  imports: [
    DatePipe
  ],
  templateUrl: './stopuhr.html',
  styleUrl: './stopuhr.css',
})
export class Stopuhr {
  // Speichert die Zeit die gestopt wird
  zeit = signal(0)
  // Speichert welcher Button bei der Stopuhr gedrückt werden kann
  start= true;
  // Stopt die Zeit
  stopuhr = setInterval(() => 0)

  // Startete die Stopuhr, bzw. setzt die Stopung fort
  starten(){
    this.start = false;
    this.stopuhr = setInterval(() => this.zeit.set(this.zeit()+10),10)
  }
  // Stopt die Stopuhr
  stoppen(){
    this.start = true;
    let erg = this.zeit()
    this.zeit.set(erg);
    clearInterval(this.stopuhr)
  }
  // Setzt die Stophuhr wieder auf 0 zurück
  reset(){
    clearInterval(this.stopuhr);
    this.start = true;
    this.zeit.set(0);
  }
}
