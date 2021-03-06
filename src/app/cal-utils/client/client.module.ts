import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientInputComponent } from './client-input/client-input.component';
import { ReactiveFormsModule } from '@angular/forms';

import {MatButtonModule, MatFormFieldControl, MatCheckboxModule, MatAutocompleteModule, MatFormFieldModule, MatAutocomplete, MatInputModule, MatTableModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NavbarComponent } from '../navbar/navbar.component';
import { AppRoutingModule } from '../../app-routing.module';
import { TextMaskModule } from 'angular2-text-mask';
import { ClientAutofillComponent } from './client-autofill/client-autofill.component';
import { ClientListComponent } from './client-list/client-list.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    TextMaskModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule
  ],
  declarations: [ClientInputComponent,  NavbarComponent, ClientAutofillComponent, ClientListComponent],
  exports: [ClientInputComponent, NavbarComponent, ClientAutofillComponent, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatTableModule]
})
export class ClientModule { }
