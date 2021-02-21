import { Component, OnInit } from "@angular/core";
import { geoMercator, geoPath, json, select } from "d3";
import * as topojson from "topojson-client";

@Component({
  selector: "app-mapa-dinamico-via-ws",
  templateUrl: "./mapa-dinamico-via-ws.component.html",
  styleUrls: ["./mapa-dinamico-via-ws.component.css"],
})
export class MapaDinamicoViaWsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    let svg = select("svg");

    this.draw(svg);
  }

  //         min-x,   min-y,  width             height
  viewbox = "-185.9904 70.2718 30.58069999999999 35.015699999999995";
  draw(svg) {
    const projection = geoMercator().scale(200000);
    projection.reflectY();
    const pathGenerator = geoPath().projection(projection);

    json(
      "https://servicodados.ibge.gov.br/api/v3/malhas/estados/35?qualidade=minima&intrarregiao=municipio&formato=application/json"
    ).then((data: any) => {
      let dados;
      dados = data;
      dados = topojson.feature(data, data.objects["UF35MU"]);
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
        .attr("fill", "#000")
        .attr("d", pathGenerator);
    });
  }
}
