// Bauplan für FJ-Mitglied, mit Name, Geburtsdatum und berechnet dann das Alter
export class FJ {
  alter = 0;
  constructor(public name: string, public gebDate:Date) {
    let today = new Date();
    let age = today.getFullYear() - this.gebDate.getFullYear();
    let m = today.getMonth() - this.gebDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.gebDate.getDate())) {
      age--;
    }
    this.alter = age
  }
}
