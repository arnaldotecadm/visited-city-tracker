import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SantaCatarinaComponent } from "./mapas/santa-catarina/santa-catarina.component";

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
