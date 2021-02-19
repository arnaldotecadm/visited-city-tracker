import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SantaCatarinaComponent } from "./mapas/santa-catarina/santa-catarina.component";
import { MapaComponent } from "./testes/mapa/mapa.component";

const routes: Routes = [
  {
    path: "santa-catarina",
    component: SantaCatarinaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
