import { Component, OnInit } from "@angular/core";
import { geoMercator, geoPath, json, select } from "d3";

@Component({
  selector: "app-mapa",
  templateUrl: "./mapa.component.html",
  styleUrls: ["./mapa.component.css"],
})
export class MapaComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    let svg = select("svg");

    this.draw(svg);
  }

  draw(svg) {
    const projection = geoMercator().scale(1000);
    const pathGenerator = geoPath().projection(projection);

    json(
      "https://servicodados.ibge.gov.br/api/v3/malhas/estados/42?formato=application/vnd.geo+json&qualidade=minima&intrarregiao=municipio"
    ).then((data: any) => {
      let dados;
      dados = data;
      //dados = topojson.feature(data, data.objects["UF42MU"]);
      console.log(dados);

      const gMap = svg.append("g");
      gMap
        .selectAll("path")
        .data(dados.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("stroke", "#aaa")
        .attr("stroke-width", "0.5")
        .attr("fill", "transparent")
        .attr("d", pathGenerator);
    });
  }
}
