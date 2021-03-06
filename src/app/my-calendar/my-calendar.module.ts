import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './../../environments/environment';
//import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule,  CalendarNativeDateFormatter, CalendarDateFormatter, DateFormatterParams, DateAdapter  } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MyCalendarComponent } from './my-calendar.component';
import { CalUtilsModule } from './../cal-utils/cal-utils.module';
import { AppComponent } from './../app.component';

import { AppRoutingModule } from './../app-routing.module';


import { CalEventsService } from './../cal-events.service'
import{ ClientService } from '../cal-utils/client/shared/client.service';
import{ ClientAppointmentsService } from '../cal-utils/client/shared/client-appointments.service';

import { CalendarEventTitleFormatter} from 'angular-calendar';
import { CustomEventTitleFormatter } from './../custom-event-title-formatter.service';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';


export class CustomDateFormatter extends CalendarNativeDateFormatter {

    public dayViewHour({date, locale}: DateFormatterParams): string {
      return new Intl.DateTimeFormat('en-us', {
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    }
  
  }


@NgModule({
  imports: [
      CommonModule,
//      BrowserModule,
      BrowserAnimationsModule,
      NgbModule.forRoot(),
      NgbModalModule.forRoot(),
      FormsModule,
      ReactiveFormsModule,
      CalendarModule.forRoot({
        // dateFormatter: {
        //   provide: CalendarDateFormatter, 
        //   useClass: CustomDateFormatter
        // }
        provide: DateAdapter,
        useFactory: adapterFactory
      },
      {
        dateFormatter: {
            provide: CalendarDateFormatter, 
             useClass: CustomDateFormatter
           }
      }
      
      ),
      CalUtilsModule,
      CalendarModule,
      AppRoutingModule
  ],
    declarations: [MyCalendarComponent, LoadingSpinnerComponent],
    exports: [MyCalendarComponent, LoadingSpinnerComponent

    ],
    providers: [CalEventsService, ClientService, ClientAppointmentsService,
        {
            provide: CalendarEventTitleFormatter,
            useClass: CustomEventTitleFormatter
        }
    ]
})
export class MyCalendarModule { }
