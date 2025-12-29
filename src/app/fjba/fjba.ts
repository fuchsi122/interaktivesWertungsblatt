import {Component, ElementRef, signal, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FJ} from '../FJ';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';

@Component({
  selector: 'app-fjba',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './fjba.html',
  styleUrl: './fjba.css',
})

export class FJBA {
  // -------------------------------- Auswahl der Mitglieder
  // speichert das Mitglied
  auswahl = signal<FJ>(new FJ("", new Date()));
  // Speichert die mitglieder die zur Auswahl stehen im Dropdown Menü
  daten = signal([
    new FJ("Richard Pugl", new Date(2015, 4, 17)),
    new FJ("Christoph Muhr", new Date(2015, 5, 22)),
    new FJ("Nogay Denktas", new Date(2015, 2, 17)),
    new FJ("Irene Scheichelbauer", new Date(2014,9,14)),
    new FJ("Alex Bichler", new Date(2014,9,6))
  ])


  // -------------------------------- Bewerbsbahn
  // Namen der Fehler und wie viele Zeit als Straffe es gibt
  fehlerBahn = signal(["Nicht ordnungsgemäß überwundenes Hindernis", "Offenes Kupplungspaar", "Nicht Ordnungsgemäß ausgelegter C-Druckschlauch", "Liegengebliebenes oder verlorenes Gerät", "Falsch am Gerätegestell abgelegtes Gerät"])
  fehlerpunkteBahn = signal([10,20,10,5,10])
  // Sollen die Punkte und Fehler angezeigt werden
  anzeigenBahn = false
  // Speichert die Zeit der Bewerbsbahn
  zeitBahn = signal(0.0)
  // Speichert die Punkte auf der Bewerbsbahn
  punkteBahn = signal(0)
  // Berechnet die Punkte
  berechneBahn(){
    if(this.zeitBahn() != 0) {
      this.anzeigenBahn = true;
      this.punkteBahn.set(this.startpunkte(this.auswahl().alter) - (this.zeitBahn() + this.gesamtFehlerBahn()[0]));
    }
  }

  // Speichert welcher Fehler wie oft gemacht wurde
  fehlerzeileBahn = signal([0,0,0,0,0])
  // Berechnet die gesamten Fehler
  gesamtFehlerBahn(){
    let sum = 0;
    let anz = 0;
    for(let i = 0; i < 5; i++){
        sum += this.fehlerzeileBahn()[i] * this.fehlerpunkteBahn()[i]
        anz += this.fehlerzeileBahn()[i]
    }
    return [sum, anz];
  }

  // Funktion um die Startpunkte zu berechnen
  startpunkte(alter :number){
    if(alter <= 10){
      return 1000
    } else {
      return 997
    }
  }


  // --------------------------------  Beenden und Neu starten
  // um, die Seite dann als PDF zu speichern
  @ViewChild('pageToSave', { static: false })
  pageToSave!: ElementRef;

  // Um die ausgefüllte Seite zu sichern
  sichern() {
    if (!this.pageToSave) return;

    html2canvas(this.pageToSave.nativeElement, { scale: 2 }).then((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Wertungsblatt_FJBA.pdf');
    });
  }
  // Setzt alles Zurück
  zuruecksetzten() {
    this.auswahl.set(new FJ("", new Date()))

    this.anzeigenBahn = false
    this.punkteBahn.set(0)
    this.zeitBahn.set(0)
    this.fehlerzeileBahn.set([0,0,0,0,0])
  }
}
