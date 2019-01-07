import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterialModule } from '../metarial.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MeterialModule,
    FlexLayoutModule,
  ],
  exports: [
    CommonModule,
    MeterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule {

}
