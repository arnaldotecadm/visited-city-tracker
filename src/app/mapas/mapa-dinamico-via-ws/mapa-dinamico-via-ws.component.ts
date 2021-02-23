import { Component, HostListener, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { geoMercator, geoPath, select, selectAll } from "d3";
import * as topojson from "topojson-client";
import { MapaService } from "../mapa-service.service";

@Component({
  selector: "app-mapa-dinamico-via-ws",
  templateUrl: "./mapa-dinamico-via-ws.component.html",
  styleUrls: ["./mapa-dinamico-via-ws.component.css"],
})
export class MapaDinamicoViaWsComponent implements OnInit {
  codArea;
  viewbox;

  lastClick = 0;
  ultimoItemSelecionado;
  itemSelecionado;
  cidadeVisitadaLista = [];
  dataSource;

  constructor(private route: ActivatedRoute, private mapService: MapaService) {
    this.codArea = +this.route.snapshot.paramMap.get("codarea");
  }

  ngOnInit(): void {
    this.viewbox = this.getViewBox();

    let svg = select("svg");

    this.draw(svg);
  }

  @HostListener("click", ["$event"])
  clickEvent(event) {
    if (event.target.nodeName != "path") {
      return;
    }

    this.itemSelecionado = event.target;

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

    if (
      this.cidadeVisitadaLista.length > 0 &&
      this.cidadeVisitadaLista.filter(
        (i) => i.getAttribute("id") == this.itemSelecionado.getAttribute("id")
      ).length > 0
    ) {
      let index = this.cidadeVisitadaLista.indexOf(this.itemSelecionado);
      this.itemSelecionado.setAttribute("fill", "#FFF");
      this.cidadeVisitadaLista.splice(index, 1);
    } else {
      this.cidadeVisitadaLista.push(this.itemSelecionado);
      this.itemSelecionado.setAttribute("fill", this.getRandomColor());
    }
    // localStorage.setItem(
    //   "cidades_visitadas",
    //   JSON.stringify(this.cidadeVisitadaLista)
    // );
    this.dataSource = new MatTableDataSource(this.cidadeVisitadaLista);
  }

  getRandomColor(): string {
    const randomBetween = (min, max) =>
      min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(0, 255);
    const g = randomBetween(0, 255);
    const b = randomBetween(0, 255);
    return `rgb(${r},${g},${b})`;
  }

  getViewBox() {
    //         min-x,   min-y,  width             height
    switch (this.codArea) {
      case 33:
        return "-165.9904 65.2718 30.58069999999999 35.015699999999995";
      case 35:
        return "-185.9904 65.2718 30.58069999999999 35.015699999999995";
      case 41:
        return "-200.9904 75.2718 30.58069999999999 35.015699999999995";
      case 42:
        return "-200.9904 85.2718 30.58069999999999 35.015699999999995";
      case 43:
        return "-205.9904 95.2718 30.58069999999999 35.015699999999995";
      case 50:
        return "-205.9904 57.2718 30.58069999999999 35.015699999999995";
      default:
        return "-185.9904 70.2718 30.58069999999999 35.015699999999995";
    }
  }

  draw(svg) {
    const projection = geoMercator().scale(200000);
    projection.reflectY();
    const pathGenerator = geoPath().projection(projection);

    this.mapService
      .getListEstadosByCodArea(this.codArea)
      .subscribe((data: any) => {
        let dados;
        dados = topojson.feature(
          data,
          data.objects["UF" + this.codArea + "MU"]
        );
        const gMap = svg.append("g");
        gMap
          .attr("transform", "scale(0.001,0.001)")
          .selectAll("path")
          .data(dados.features)
          .enter()
          .append("path")
          .attr("class", "country")
          .attr("stroke", "#aaa")
          .attr("stroke-width", "20")
          .attr("fill", "#FFF")
          .attr("id", this.getCodigoArea)
          .attr("d", pathGenerator)
          .append("title");
        this.fullfillStateName();
      });
  }

  fullfillStateName() {
    selectAll("path")
      .nodes()
      .forEach((item: Element) => {
        item.setAttribute("fill", "#FFF");
        const codArea = item.getAttribute("id");
        this.mapService
          .getMunicipioByCodigoArea(codArea)
          .subscribe((data: any) => {
            item.childNodes[0].textContent = codArea + " - " + data.nome;
          });
      });
  }

  getCodigoArea(obj) {
    return obj.properties.codarea;
  }
}
