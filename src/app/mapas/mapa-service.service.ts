import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { environment } from "../../environments/environment";
import { ListaPathCidadeSantaCatarina } from "../lista-cidades-santa-catarina";

const CIDADES_WS_BASE = environment.CIDADES_WS;
const URL_SERVICO_DADOS = environment.URL_BASE_SERVICO_DADOS;

@Injectable({
  providedIn: "root",
})
export class MapaService {
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

  toggleCidadeVisitada(item) {
    // localStorage.setItem(
    //   "cidades_visitadas",
    //   JSON.stringify(this.cidadeVisitadaLista)
    // );
  }

  getMapaBrasil() {
    return this.http.get(
      URL_SERVICO_DADOS +
        "v3/malhas/paises/BR?intrarregiao=UF&formato=application/json"
    );
  }

  getListEstadosByCodArea(codArea) {
    return this.http.get(
      URL_SERVICO_DADOS +
        "v3/malhas/estados/" +
        codArea +
        "?qualidade=minima&intrarregiao=municipio&formato=application/json"
    );
  }

  getEstadoByCodigoArea(codarea) {
    return this.http.get(
      URL_SERVICO_DADOS + "v1/localidades/estados/" + codarea
    );
  }

  getMunicipioByCodigoArea(codarea) {
    return this.http.get(
      URL_SERVICO_DADOS + "v1/localidades/municipios/" + codarea
    );
  }
}
