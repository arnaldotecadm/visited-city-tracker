import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { geoMercator, geoPath, json, select } from "d3";
import * as topojson from "topojson-client";

@Component({
  selector: "app-mapa-dinamico-via-ws",
  templateUrl: "./mapa-dinamico-via-ws.component.html",
  styleUrls: ["./mapa-dinamico-via-ws.component.css"],
})
export class MapaDinamicoViaWsComponent implements OnInit {
  codArea;

  viewbox;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.codArea = +this.route.snapshot.paramMap.get("codarea");

    this.viewbox = this.getViewBox();

    let svg = select("svg");
    this.draw(svg);
  }

  @HostListener("click", ["$event"])
  clickEvent(event) {
    if (event.target.nodeName != "path") {
      return;
    }
    console.log(event.target.id);
  }

  getViewBox() {
    //         min-x,   min-y,  width             height
    switch (this.codArea) {
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

    json(
      "https://servicodados.ibge.gov.br/api/v3/malhas/estados/" +
        this.codArea +
        "?qualidade=minima&intrarregiao=municipio&formato=application/json"
    ).then((data: any) => {
      let dados;
      dados = topojson.feature(data, data.objects["UF" + this.codArea + "MU"]);
      console.log(dados);

      //svg.attr()

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
        .attr("d", pathGenerator);
    });
  }
  getCodigoArea(obj) {
    return obj.properties.codarea;
  }
}
