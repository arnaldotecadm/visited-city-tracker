import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MapaComponent } from "./testes/mapa/mapa.component";

const routes: Routes = [
  {
    path: "teste",
    component: MapaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
