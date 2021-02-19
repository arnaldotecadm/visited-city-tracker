import { PlatformModule } from "@angular/cdk/platform";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";
import {
  DialogOverviewExampleDialog,
  SantaCatarinaComponent,
} from "./santa-catarina.component";

@NgModule({
  declarations: [SantaCatarinaComponent, DialogOverviewExampleDialog],
  imports: [
    CommonModule,

    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatTableModule,
    PlatformModule,
    MatExpansionModule,
  ],
  exports: [SantaCatarinaComponent],
  entryComponents: [DialogOverviewExampleDialog],
})
export class SantaCatarinaModule {}
