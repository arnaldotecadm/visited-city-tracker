import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { environment } from "../../environments/environment";
import { ListaPathCidadeSantaCatarina } from "../lista-cidades-santa-catarina";

const CIDADES_WS_BASE = environment.CIDADES_WS;

@Injectable({
  providedIn: "root",
})
export class MapaServiceService {
  constructor(public http: HttpClient) {}

  getCityInfoByCode(codigo) {
    return this.http.get(CIDADES_WS_BASE + codigo);
  }

  getAllCitySantaCatarina() {
    return of(new ListaPathCidadeSantaCatarina().santaCatarinacityList);
  }

  getVisitedCityByState() {
    let cityList = [];

    if (localStorage.getItem("cidades_visitadas")) {
      cityList.push(...JSON.parse(localStorage.getItem("cidades_visitadas")));
    }

    return of(cityList);
  }
}
