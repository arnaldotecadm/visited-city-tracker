import { HttpClient } from "@angular/common/http";
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
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
export class AppComponent implements OnInit {
  @ViewChild(MatMenuTrigger, { static: false }) menu: MatMenuTrigger;
  @ViewChildren("path") path: QueryList<any>;

  ultimoItemSelecionado;
  itemSelecionado;
  cidadeVisitadaLista = [];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  animal: string;
  name: string;
  menuX: number = 0;
  menuY: number = 0;
  title = "track-visited-city";
  selectedItem;
  visitedCityList = [];
  cidadesNomeadas = [];
  totalCidades = 295;
  modoDesenv = false;
  pathList = [];
  lastClick = 0;
  displayedColumns: string[] = ["nome"];

  constructor(public dialog: MatDialog, public http: HttpClient) {
    let listaPath = new ListaPathCidadeSantaCatarina();
    this.pathList = listaPath.pathList;
  }

  ngOnInit() {
    this.buscarNomeCidades();
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
  }
  @HostListener("click", ["$event"])
  clickEvent(event) {
    if (event.target.nodeName != "path") {
      return;
    }
    const currentTime = new Date().getTime();
    const ultimoClick = currentTime - this.lastClick;

    if (ultimoClick < 300) {
      event.stopPropagation();
      this.marcarComoVisitado(this.ultimoItemSelecionado);
    }
    this.lastClick = currentTime;
  }

  marcarComoVisitado(item = null) {
    if (item) {
      this.itemSelecionado = item;
    }
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

    this.dataSource = new MatTableDataSource(this.cidadeVisitadaLista);
  }

  itemClicado(item) {
    this.ultimoItemSelecionado = item;
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

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: "250px",
      data: { nome: "" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == -1) {
        return;
      }
      this.itemSelecionado.nome = result;
    });
  }

  buscarNomeCidades() {
    this.pathList.forEach((item) => {
      this.consultaWebService(item.id).subscribe((data: any) => {
        item.nome = data.nome;
      });
    });
  }

  consultaWebService(codigo) {
    return this.http.get(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios/" + codigo
    );
  }
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

  cancel() {
    this.dialogRef.close(-1);
  }
}
