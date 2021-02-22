import { Platform } from "@angular/cdk/platform";
import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatAccordion } from "@angular/material/expansion";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MapaService } from "../mapa-service.service";

@Component({
  selector: "app-santa-catarina",
  templateUrl: "./santa-catarina.component.html",
  styleUrls: ["./santa-catarina.component.css"],
})
export class SantaCatarinaComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatSort) sort: MatSort;

  ultimoItemSelecionado;
  itemSelecionado;
  cidadeVisitadaLista = [];
  dataSource;

  selectedItem;
  visitedCityList = [];
  cidadesNomeadas = [];
  pathList = [];
  lastClick = 0;
  displayedColumns: string[] = ["nome"];
  selected;

  constructor(
    public dialog: MatDialog,
    public platform: Platform,
    private mapaService: MapaService
  ) {
    console.log(platform.ANDROID || platform.IOS);
  }

  ngOnInit() {
    this.mapaService.getAllCitySantaCatarina().subscribe((data) => {
      this.pathList = data;
      this.buscarNomeCidades();
      this.loadVisitedCityList();
      this.marcarCidadesVisitadasStorage();
    });
  }

  loadVisitedCityList() {
    this.mapaService.getVisitedCityByState().subscribe((data) => {
      this.cidadeVisitadaLista.push(...data);
      this.dataSource = new MatTableDataSource(this.cidadeVisitadaLista);
      this.dataSource.sort = this.sort;
    });
  }

  toggleSelecItemtable(item) {
    if (this.selected && item.id == this.selected.id) {
      this.selected = null;
    } else {
      this.selected = item;
    }
  }

  limparCidadesVisitadas() {
    this.cidadeVisitadaLista.forEach((item) => {
      let city = this.pathList.filter((pl) => pl.id == item.id)[0];
      if (city) {
        city.fill = "#FFF";
      }
    });
    this.cidadeVisitadaLista = [];
    localStorage.setItem(
      "cidades_visitadas",
      JSON.stringify(this.cidadeVisitadaLista)
    );
    this.dataSource = new MatTableDataSource(this.cidadeVisitadaLista);
  }

  marcarCidadesVisitadasStorage() {
    this.cidadeVisitadaLista.forEach((item) => {
      let city = this.pathList.filter((pl) => pl.id == item.id)[0];
      if (city) {
        city.fill = this.getRandomColor();
      }
    });
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

  getRandomColor(): string {
    const randomBetween = (min, max) =>
      min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(0, 255);
    const g = randomBetween(0, 255);
    const b = randomBetween(0, 255);
    return `rgb(${r},${g},${b})`;
  }

  marcarComoVisitado(item = null) {
    if (item) {
      this.itemSelecionado = item;
    }

    if (
      this.cidadeVisitadaLista.filter((i) => i.d == this.itemSelecionado.d)
        .length > 0
    ) {
      let index = this.cidadeVisitadaLista.indexOf(this.itemSelecionado);
      this.itemSelecionado.fill = "#FFF";
      this.cidadeVisitadaLista.splice(index, 1);
    } else {
      this.cidadeVisitadaLista.push(this.itemSelecionado);
      this.itemSelecionado.fill = this.getRandomColor();
    }
    localStorage.setItem(
      "cidades_visitadas",
      JSON.stringify(this.cidadeVisitadaLista)
    );
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

  buscarNomeCidades() {
    this.pathList.forEach((item) => {
      this.mapaService.getCityInfoByCode(item.id).subscribe((data: any) => {
        item.nome = data.nome;
      });
    });
  }
}
