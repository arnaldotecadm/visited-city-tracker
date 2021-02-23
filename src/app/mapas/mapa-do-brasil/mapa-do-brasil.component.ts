import { Component, HostListener, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { geoMercator, geoPath, select, selectAll } from "d3";
import * as topojson from "topojson-client";
import { MapaService } from "../mapa-service.service";

@Component({
  selector: "app-mapa-do-brasil",
  templateUrl: "./mapa-do-brasil.component.html",
  styleUrls: ["./mapa-do-brasil.component.css"],
})
export class MapaDoBrasilComponent implements OnInit {
  constructor(private mapService: MapaService, private router: Router) {}

  ngOnInit(): void {
    let svg = select("svg");

    this.draw(svg);
  }

  @HostListener("click", ["$event"])
  clickEvent(event) {
    if (event.target.nodeName != "path") {
      return;
    }

    if (+event.target.id == 42) {
      this.router.navigate(["santa-catarina"]);
    } else {
      this.router.navigate(["geral", { codarea: event.target.id }]);
    }
  }

  //         min-x,   min-y,  width             height
  viewbox = "-50.9904 -4.2718 30.58069999999999 29.745699999999995";
  draw(svg) {
    const projection = geoMercator().scale(40000);
    projection.reflectY();
    const pathGenerator = geoPath().projection(projection);

    this.mapService.getMapaBrasil().subscribe((data: any) => {
      let dados = topojson.feature(data, data.objects["BRUF"]);

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
        .attr("fill", "#000")
        .attr("id", this.getCodigoArea)
        .attr("d", pathGenerator)
        .append("title");
      //.html(this.fullfillStateName);

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
          .getEstadoByCodigoArea(codArea)
          .subscribe((data: any) => {
            item.childNodes[0].textContent = codArea + " - " + data.nome;
          });
      });
  }

  getCodigoArea(obj) {
    return obj.properties.codarea;
  }
}
