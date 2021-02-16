import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Observable, of } from "rxjs";
import { ListaPathCidadeSantaCatarina } from "./lista-cidades-santa-catarina";

export interface DialogData {
  animal: string;
  nome: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  @ViewChild(MatMenuTrigger, { static: false }) menu: MatMenuTrigger;
  @ViewChildren("path") path: QueryList<any>;

  itemSelecionado;
  cidadeVisitadaLista = [];

  animal: string;
  name: string;
  menuX: number = 0;
  menuY: number = 0;
  title = "track-visited-city";
  selectedItem;
  visitedCityList = [];
  cidadesNomeadas = [];
  //totalCidades = of(document.getElementsByTagName("path").length - 1);
  totalCidades = 295;
  modoDesenv = false;
  pathList = [];

  constructor(public dialog: MatDialog) {
    let listaPath = new ListaPathCidadeSantaCatarina();
    this.pathList = listaPath.pathList;
  }

  marcarComoVisitado() {
    const randomBetween = (min, max) =>
      min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(0, 255);
    const g = randomBetween(0, 255);
    const b = randomBetween(0, 255);
    const rgb = `rgb(${r},${g},${b})`;

    if (
      this.cidadeVisitadaLista.filter((i) => i.d == this.itemSelecionado.d)
        .length > 0
    ) {
      let index = this.cidadeVisitadaLista.indexOf(this.itemSelecionado);
      this.itemSelecionado.fill = "#FFF";
      this.cidadeVisitadaLista.splice(index, 1);
    } else {
      this.cidadeVisitadaLista.push(this.itemSelecionado);
      this.itemSelecionado.fill = rgb;
    }
  }

  itemClicado(item) {
    if (this.itemSelecionado && this.itemSelecionado == item) {
      this.itemSelecionado.selecionado = false;
      this.itemSelecionado = null;
    } else {
      this.limparItensSelecionados();
      this.itemSelecionado = item;
      this.itemSelecionado.selecionado = true;
    }
  }

  limparItensSelecionados() {
    this.pathList.forEach((item) => (item.selecionado = false));
  }

  intercept($event) {
    if ($event.tagName != "path") {
      return;
    }
    this.selectedItem = $event;

    if (this.modoDesenv) {
      if (this.menu) {
        this.menuX = (window.event as any).x - 10;
        this.menuY = (window.event as any).y - 10;
        this.menu.closeMenu(); // putting this does not work.
        this.menu.openMenu();
      }
    } else {
      this.toggleSelected();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: "250px",
      data: { nome: "" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      let index = -1;
      for (let i = 0; i <= this.cidadesNomeadas.length - 1; i++) {
        if (this.selectedItem.getAttribute("d") == this.cidadesNomeadas[i].id) {
          index = i;
        }
      }

      if (index >= 0) {
        this.cidadesNomeadas.splice(index, 1);
      }

      this.cidadesNomeadas.push(
        new City(this.selectedItem.getAttribute("d"), result)
      );

      this.agruparInformacoes();
    });
  }

  toggleSelected() {
    if (
      !this.selectedItem.getAttribute("selected") ||
      this.selectedItem.getAttribute("selected") == "false"
    ) {
      const randomBetween = (min, max) =>
        min + Math.floor(Math.random() * (max - min + 1));
      const r = randomBetween(0, 255);
      const g = randomBetween(0, 255);
      const b = randomBetween(0, 255);
      const rgb = `rgb(${r},${g},${b})`;

      this.selectedItem.setAttribute("fill", rgb);
      this.selectedItem.setAttribute("selected", "true");
      this.visitedCityList.push(
        new City(this.selectedItem.getAttribute("d"), "")
      );
      this.agruparInformacoes();
    } else {
      this.selectedItem.setAttribute("fill", "#FFF");
      this.selectedItem.setAttribute("selected", "false");

      let index = -1;
      for (let i = 0; i <= this.visitedCityList.length - 1; i++) {
        if (this.selectedItem.getAttribute("d") == this.visitedCityList[i].id) {
          index = i;
        }
      }
      this.visitedCityList.splice(index, 1);
    }
  }

  agruparInformacoes() {
    for (let i = 0; i <= this.visitedCityList.length - 1; i++) {
      for (let j = 0; j <= this.cidadesNomeadas.length - 1; j++) {
        if (this.cidadesNomeadas[j].id == this.visitedCityList[i].id) {
          this.visitedCityList[i].nome = this.cidadesNomeadas[j].nome;
        }
      }
    }
  }
}

export class City {
  constructor(public id: string, public nome: string) {}
}

@Component({
  selector: "dialog-overview-example-dialog",
  templateUrl: "dialog-overview-example-dialog.html",
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  confirm(data): void {
    this.dialogRef.close(data);
  }
}

export class PathSantaCatarina {
  teste = [
    { nome: "Arnaldo", teste: "sei la" },
    { nome: "Arnaldo", teste: "sei la" },
  ];
  pathList = [
    {
      class: "leaflet-interactive",
      stroke: "#bdc3c7",
      "stroke-opacity": "8",
      "stroke-width": "0.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-dasharray": "0",
      fill: "#FFF",
      "fill-opacity": "10",
      "fill-rule": "evenodd",
      d:
        "M333 266L336 268L331 273L333 275L322 276L322 274L314 270L323 261L326 261z",
    },
  ];
}
