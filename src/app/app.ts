import {Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FJLA} from './fjla/fjla';
import {FJBA} from './fjba/fjba';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    FormsModule,
    FJLA,
    FJBA,
    NgClass
  ],
  styleUrl: './app.css'
})

export class App {
  // speichert die aktuelle auswahl
  kat= signal("")
  // Speichert die Auswahl bei Click auf den Button
  katAuswahl = signal("")
  // Speichert, ob das Hauptmenü angezeigt werden soll
  anz = true
  // wenn keine Kategorie ausgewählt wurde
  error = false

  // um Kategorie auszuwählen
  auswaehlen(){
    if(this.kat() == ""){
      this.error = true
    } else {
      this.error = false
      this.katAuswahl.set(this.kat())
      this.anz = false
    }
  }
  // um zum Hauptmenü zurückzukehren und eine neue Kategorie auszuwählen
  zurueck(){
    this.anz = true
    this.katAuswahl.set("")
    this.kat.set("")
  }
}
