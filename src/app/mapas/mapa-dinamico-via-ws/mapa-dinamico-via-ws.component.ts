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
  displayedColumns: string[] = ["nome"];
  dataSource;
  selected;

  estadoSelecionado;

  constructor(
    private route: ActivatedRoute,
    private mapService: MapaService,
    private router: Router
  ) {
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
    this.mapService
      .getEstadoByCodigoArea(this.codArea)
      .subscribe((data: any) => {
        this.estadoSelecionado = data.nome;
      });

    this.viewbox = this.getViewBox();

    let svg = select("svg");

    this.draw(svg);
  }

  irParaMenuInicial() {
    this.router.navigate(["brasil"]);
  }

  loadVisitedCityList() {
    this.mapService.getVisitedCityByState(this.codArea).subscribe((data) => {
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
      codArea: this.codArea,
      nome: this.itemSelecionado.getAttribute("nome"),
    };

    if (
      this.cidadeVisitadaLista.length > 0 &&
      this.cidadeVisitadaLista.filter(
        (i) => i.id == this.itemSelecionado.getAttribute("id")
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
      "cidades_visitadas_" + this.codArea,
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
      case 11:
        return "-237.9904 23.2718 35.58069999999999 30.015699999999995";
      case 12:
        return "-263.9904 15.9718 35.58069999999999 40.015699999999995";
      case 13:
        return "-245.9904 -13.9718 35.58069999999999 55.015699999999995";
      case 14:
        return "-233.9904 -23.9718 35.58069999999999 40.015699999999995";
      case 15:
        return "-200.9904 -13.9718 35.58069999999999 55.015699999999995";
      case 16:
        return "-198.9904 -17.9718 35.58069999999999 30.015699999999995";
      case 17:
        return "-185.9904 15.9718 35.58069999999999 33.015699999999995";
      case 21:
        return "-173.9904 0.9718 35.58069999999999 40.015699999999995";
      case 22:
        return "-165.9904 7.9718 35.58069999999999 35.015699999999995";
      case 23:
        return "-155.9904 7.9718 35.58069999999999 25.015699999999995";
      case 24:
        return "-145.9904 13.9718 35.58069999999999 20.015699999999995";
      case 25:
        return "-145.9904 17.9718 35.58069999999999 20.015699999999995";
      case 26:
        return "-150.9904 20.9718 35.58069999999999 20.015699999999995";
      case 27:
        return "-145.9904 27.9718 35.58069999999999 20.015699999999995";
      case 28:
        return "-147.9904 27.9718 35.58069999999999 20.015699999999995";
      case 29:
        return "-165.9904 25.9718 35.58069999999999 40.015699999999995";
      case 31:
        return "-175.9904 47.2718 30.58069999999999 35.015699999999995";
      case 32:
        return "-160.9904 60.2718 40.58069999999999 25.015699999999995";
      case 33:
        return "-165.9904 70.2718 40.58069999999999 25.015699999999995";
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
      case 51:
        return "-217.9904 23.2718 45.58069999999999 45.015699999999995";
      case 52:
        return "-185.9904 37.2718 30.58069999999999 35.015699999999995";
      case 53:
        return "-180.9904 40.2718 30.58069999999999 35.015699999999995";
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
            item.setAttribute("nome", data.nome);
          });
      });

    this.loadVisitedCityList();
  }

  getCodigoArea(obj) {
    return obj.properties.codarea;
  }

  toggleSelecItemtable(item) {
    if (this.selected && item.id == this.selected.id) {
      this.selected = null;
    } else {
      this.selected = item;
    }
  }
}
