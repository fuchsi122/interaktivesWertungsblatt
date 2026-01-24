import {Component, ElementRef, signal, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FJ} from '../FJ';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';
import {Stopuhr} from '../stopuhr/stopuhr';

@Component({
  selector: 'app-fjla',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    FormsModule,
    Stopuhr
  ],
  templateUrl: './fjla.html',
  styleUrl: './fjla.css',
})

export class FJLA {
  // -------------------------------- Auswahl der Mitglieder
  // speichert die Auswahl zur Altersberechnung und wer welche Position läuft
  auswahl = signal<(FJ)[]>(Array(10).fill(new FJ("", new Date())));
  // Speichert die mitglieder die zur Auswahl stehen im Dropdown Menü
  daten = signal([
    new FJ("Karin Muhr", new Date(2011, 5, 24)),
    new FJ("Lena Schimanko", new Date(2011, 1, 22)),
    new FJ("Jonas Fuchs", new Date(2011, 4, 17)),
    new FJ("Christoph Fuchs", new Date(2011, 4, 6)),
    new FJ("Fabian Teucher", new Date(2012, 8, 23)),
    new FJ("Lukas Roitner", new Date(2013, 0, 15)),
    new FJ("Emelie Pfeiffer", new Date(2012, 10, 7)),
    new FJ("Ilvy Pfeiffer", new Date(2013, 9, 20)),
    new FJ("Nico Pfeiffer", new Date(2011, 5, 29)),
    new FJ("Janina Winter", new Date(2011, 7, 31)),
    new FJ("Clara Stuphan", new Date(2013, 11, 6)),
    new FJ("Franziska Winter", new Date(2014, 5, 13)),
    new FJ("Emelie Luger", new Date(2014, 5, 11)),
    new FJ("Nina Schimanko", new Date(2014, 3, 11)),
    new FJ("Liam Weninger", new Date(2014, 1, 16)),
    new FJ("Irene Scheichelbauer", new Date(2014,9,14)),
    new FJ("Alex Bichler", new Date(2014,9,6))
  ])
  // Speichert die Positionen, die es gibt
  nummern = signal([1,2,3,4,5,6,7,8,9,0])
  // Blendet FJ-Mitglied aus, wenn es bereits ausgewählt wurde
  existiertBereits(fj:FJ){
    return this.auswahl().includes(fj)
  }
  // Berechnet das Gesamtalter
  gesAlter(){
    let sum = 0;
    for (let i = 0; i < 10; i++){
      sum += this.auswahl()[i].alter;
    }
    return sum;
  }


  // -------------------------------- Bewerbsbahn
  // Namen der Fehler und wie viele Zeit als Straffe es gibt
  fehlerBahn = signal(["Fehler am Hindernis","Verdrehen des Schlauches","Offenes Kupplungspaar","Falsch Verlegte C-Löschleitung","Liegengebliebenes oder verlorenes Gerät","Falsch am Gerätegestell abgelegtes Gerät","Falsch angefertigter Knoten", "Falsches Arbeite", "Sprechen während der Arbeit"])
  fehlerpunkteBahn = signal([10,5,20,10,5,10,10,10,10])
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
      this.punkteBahn.set(1000 - this.zeitBahn() - this.gesamtFehlerBahn()[0])
    }
  }

  // Speichert wer, welche Fehler wie oft gemacht hat
  fehlerzeileBahn = signal([[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]);
  // Berechnet die Fehler pro Zeile und die gesamten Fehler
  sumZeileBahn(i:number){
    let sum = 0;
    for(let j = 0; j < 10; j++){
      sum += this.fehlerzeileBahn()[i][j]
    }
    return sum;
  }
  gesamtFehlerBahn(){
    let sum = 0;
    let anz = 0;
    for(let i = 0; i < 9; i++){
      for (let j = 0; j < 10; j++){
        sum += this.fehlerzeileBahn()[i][j] * this.fehlerpunkteBahn()[i]
        anz += this.fehlerzeileBahn()[i][j]
      }
    }
    return [sum, anz];
  }


  // -------------------------------- Staffellauf
  // Namen der Fehler und wie viele Zeit als Straffe es gibt
  fehlerStaffel = signal(["Offenes Kupplungspaar","Fehler beim Hindernis","Stafette nicht über Ziellinie"])
  fehlerpunkteStaffel = signal([10,10,20])
  // Sollen die Punkte und Fehler angezeigt werden
  anzeigenStaffel = false
  // Speichert die Zeit beim Staffellauf
  zeitStaffel =signal(0.0)
  // Speichert die Punkte beim Staffellauf
  punkteStaffel = signal(0)
  // Berechnet die Punkte
  berechneStaffel(){
    if(this.zeitStaffel() != 0) {
      this.anzeigenStaffel = true
      this.punkteStaffel.set(100 - ((this.zeitStaffel() + this.gesamtFehlerStaffel()[0]) - this.sollzeit(this.gesAlter())))   // 1 durch Sollzeit ersetzten
    }
  }

  // Speichert wer, welche Fehler wie oft gemacht hat
  fehlerzeileStaffel = signal([[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]])
  // Berechnet die Fehler pro Zeile und die gesamten Fehler
  sumZeileStaffel(i:number){
    let sum = 0;
    for(let j = 0; j < 9; j++){
      sum += this.fehlerzeileStaffel()[i][j]
    }
    return sum;
  }
  gesamtFehlerStaffel(){
    let sum = 0;
    let anz = 0;
    for(let i = 0; i < 3; i++){
      for (let j = 0; j < 9; j++){
        sum += this.fehlerzeileStaffel()[i][j] * this.fehlerpunkteStaffel()[i]
        anz += this.fehlerzeileStaffel()[i][j]
      }
    }
    return [sum, anz];
  }

  // Funktion um die Sollzeit zu berechnen
  sollzeit(alter :number){
    if(alter <= 112){
      return 80
    } else if(alter > 112 && alter <= 121){
      return 77
    } else if(alter > 121 && alter <= 130){
      return 74
    }else if(alter > 130 && alter <= 139){
      return 71
    } else if(alter > 139 && alter <= 144){
      return 68
    }
    return 0
  }


  // --------------------------------  Beenden und Neu starten
  // Um, Seite dann als PDF zu speichern
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
      pdf.save('Wertungsblatt_FJLA.pdf');
    });
  }

  // Setzt alles Zurück
  zuruecksetzten(){
    this.auswahl.set(Array(10).fill(new FJ("", new Date())))

    this.anzeigenBahn = false
    this.punkteBahn.set(0)
    this.zeitBahn.set(0)
    this.fehlerzeileBahn.set([[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]])

    this.anzeigenStaffel = false
    this.punkteStaffel.set(0)
    this.zeitStaffel.set(0)
    this.fehlerzeileStaffel.set([[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]])

  }
}
