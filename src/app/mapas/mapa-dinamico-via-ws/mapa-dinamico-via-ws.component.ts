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
  pathList = [];
  dataSource;

  constructor(private route: ActivatedRoute, private mapService: MapaService) {
    this.codArea = +this.route.snapshot.paramMap.get("codarea");
  }

  get cidadeSelecionada(): string {
    let nomeSelecao = "";

    if (this.itemSelecionado) {
      if (this.itemSelecionado.nome) {
        nomeSelecao =
          this.itemSelecionado.nome + " - " + this.itemSelecionado.id;
      } else {
        nomeSelecao = "Cidade selecionada: " + this.itemSelecionado.id;
      }
    }

    return nomeSelecao;
  }

  ngOnInit(): void {
    this.viewbox = this.getViewBox();

    let svg = select("svg");

    this.draw(svg);
  }

  loadVisitedCityList() {
    this.mapService.getVisitedCityByState().subscribe((data) => {
      this.cidadeVisitadaLista.push(...data);
      this.dataSource = new MatTableDataSource(this.cidadeVisitadaLista);
      this.marcarCidadesVisitadasStorage();
    });
  }

  marcarCidadesVisitadasStorage() {
    this.cidadeVisitadaLista.forEach((item) => {
      let city = this.pathList.filter((pl) => pl.id == item.id)[0];
      if (city) {
        city.setAttribute("fill", this.getRandomColor());
        city.setAttribute("cor", city.getAttribute("fill"));
        city.setAttribute("visitado", "true");
      }
    });
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
    } else {
      this.itemClicado(this.itemSelecionado);
    }

    this.lastClick = currentTime;
  }

  itemClicado(item) {
    this.limparItensSelecionados();
    if (item && !!!item.selecionado) {
      item.setAttribute("selecionado", "true");
    } else {
      item.em.setAttribute("selecionado", "false");
    }

    item.setAttribute(
      "fill",
      item.getAttribute("selecionado") ? "#A9A9A9" : "#FFF"
    );
    this.ultimoItemSelecionado = item;
  }

  limparItensSelecionados() {
    this.pathList = selectAll("path").nodes();
    selectAll("path")
      .nodes()
      .forEach((item: Element) => {
        let itemCor = item.getAttribute("cor");
        item.setAttribute("fill", itemCor ? itemCor : "#FFF");
        item.setAttribute("selecionado", "false");
      });
  }

  marcarComoVisitado(item = null) {
    if (item) {
      this.itemSelecionado = item;
    }

    let cidade = {
      id: this.itemSelecionado.id,
      nome: this.itemSelecionado.nome,
    };

    if (
      this.cidadeVisitadaLista.length > 0 &&
      this.cidadeVisitadaLista.filter(
        (i) => i.codArea == this.itemSelecionado.getAttribute("id")
      ).length > 0
    ) {
      let index = this.cidadeVisitadaLista.indexOf(cidade);
      this.itemSelecionado.setAttribute("fill", "#FFF");
      this.itemSelecionado.setAttribute("cor", "#FFF");
      this.itemSelecionado.setAttribute("visitado", "false");
      this.cidadeVisitadaLista.splice(index, 1);
    } else {
      this.cidadeVisitadaLista.push(cidade);
      this.itemSelecionado.setAttribute("fill", this.getRandomColor());
      this.itemSelecionado.setAttribute(
        "cor",
        this.itemSelecionado.getAttribute("fill")
      );
      this.itemSelecionado.setAttribute("visitado", "true");
    }

    localStorage.setItem(
      "cidades_visitadas",
      JSON.stringify(this.cidadeVisitadaLista)
    );
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
        return "-185.9904 67.2718 30.58069999999999 25.015699999999995";
      case 41:
        return "-197.9904 75.2718 40.58069999999999 25.015699999999995";
      case 42:
        return "-200.9904 85.2718 30.58069999999999 35.015699999999995";
      case 43:
        return "-203.9904 95.2718 30.58069999999999 35.015699999999995";
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
    this.pathList = selectAll("path").nodes();

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

    this.loadVisitedCityList();
  }

  getCodigoArea(obj) {
    return obj.properties.codarea;
  }
}
