import { NgModule } from '@angular/core';

// Import Angular Material modules
import {
  MdButtonModule,
  MdCardModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdSelectModule,
  MdSidenavModule,
  MdToolbarModule
} from '@angular/material';

// Add imported Angular Material modules to both imports and exports arrays
@NgModule({
  imports: [
    MdButtonModule,
    MdCardModule,
    MdDialogModule,
    MdIconModule,
    MdInputModule,
    MdSelectModule,
    MdSidenavModule,
    MdToolbarModule
  ],
  exports: [
    MdButtonModule,
    MdCardModule,
    MdDialogModule,
    MdIconModule,
    MdInputModule,
    MdSelectModule,
    MdSidenavModule,
    MdToolbarModule
  ]
})
export class MdModule { }
