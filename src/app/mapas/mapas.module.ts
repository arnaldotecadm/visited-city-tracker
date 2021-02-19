import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MapaDinamicoViaWsModule } from "./mapa-dinamico-via-ws/mapa-dinamico-via-ws.module";
import { SantaCatarinaModule } from "./santa-catarina/santa-catarina.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, SantaCatarinaModule, MapaDinamicoViaWsModule],
})
export class MapasModule {}
