import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MapaDinamicoViaWsComponent } from "./mapas/mapa-dinamico-via-ws/mapa-dinamico-via-ws.component";
import { SantaCatarinaComponent } from "./mapas/santa-catarina/santa-catarina.component";

const routes: Routes = [
  {
    path: "santa-catarina",
    component: SantaCatarinaComponent,
  },

  {
    path: "geral",
    component: MapaDinamicoViaWsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
