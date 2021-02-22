import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MapaDinamicoViaWsComponent } from "./mapas/mapa-dinamico-via-ws/mapa-dinamico-via-ws.component";
import { MapaDoBrasilComponent } from "./mapas/mapa-do-brasil/mapa-do-brasil.component";
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

  {
    path: "brasil",
    component: MapaDoBrasilComponent,
  },

  {
    path: "**",
    redirectTo: "brasil",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
