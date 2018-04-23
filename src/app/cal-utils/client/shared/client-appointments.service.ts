import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ClientAppointments } from './client-appointments.model';


  
@Injectable()
export class ClientAppointmentsService {

 
  clientAppointmentsList: AngularFireList<any>;
 //selectedClientAppointment: ClientAppointments = new ClientAppointments();
  selectedClientApps: string[] = [];
  noShow: number = 0;
  constructor(private firebase : AngularFireDatabase) { }

  getData(){
    this.clientAppointmentsList = this.firebase.list('clientAppointments');
    return this.clientAppointmentsList;
  }

  insertNewClient(client: string) 
  {
    this.selectedClientApps = [];
    console.log("Inside InsertClientAPpointment, adding new client to ClientAPP ");
    this.clientAppointmentsList.push({
      clientKey: client,
      appointmentKeys: this.selectedClientApps
    });
  }

  insertClientApp(clientKey: string, key: string) 
  {
    console.log(this.selectedClientApps);
    //var key = this.getClientAppKey(clientKey);
    console.log("Inserting appoitntment to Key: "+key);
    console.log("Inserting appoitntment to clientKey: "+clientKey);
    this.clientAppointmentsList.update(key, {
      clientKey: clientKey,
      appointmentKeys: this.selectedClientApps
    });
  }

  getClientAppKey(clientKey: string){
    var x = this.getData();
      x.snapshotChanges().subscribe(item => {
       
        item.forEach(element => {
          var y = element.payload.toJSON();
          y["$key"] = element.key;
          console.log(y["$key"]);
          console.log(y["clientKey"]);
          if(y["clientKey"]==clientKey){
              console.log(y);  
              this.insertClientApp(clientKey, y["$key"]);        
              //return y["$key"];
            }
          
        })
        
      });
      //return null;
  }

  //Inserting appointments of selected client from autofill to this.selectedClientApps array
  getClientAppointments(clientKey: string){
    console.log("inside getClientAppointments");
    console.log(clientKey);
    this.selectedClientApps = [];
      var x = this.getData();
      x.snapshotChanges().subscribe(item => {
       
        item.forEach(element => {
          var y = element.payload.toJSON();
          y["$key"] = element.key;
          if(y["clientKey"]==clientKey){
              console.log(y); 
              if(y["appointmentKeys"]!=null ||  y["appointmentKeys"] != undefined) {
                  //this.selectedClientApps = y["appointmentKeys"] as string[];
                  console.log(y["appointmentKeys"]);                  
                   
                   var z = this.firebase.list('clientAppointments/'+y["$key"]+'/appointmentKeys');
                   z.snapshotChanges().subscribe(item => {
                    item.forEach(element1 => {
                      var n = element1.payload.toJSON();
                      this.selectedClientApps.push(n as string);
                      
                    })
                    console.log(this.selectedClientApps);
                    this.getNoShows(this.selectedClientApps);
                   });

                }
              else
                  console.log("No Appointments");    
              
            }
          
        })
        
      });
  }

  getNoShows(arg: string[]) {
    
    var x = this.firebase.list('appointments');
    x.snapshotChanges().subscribe(item => {
      this.noShow = 0;
      item.forEach(element => {
          var y = element.payload.toJSON();
          y["$key"] = element.key;
          for(var i=0; i<arg.length; i++){
            
             if(y["$key"]==arg[i] ){
                if(y["noShow"]){
                   this.noShow = this.noShow + 1;
                }

             }
          }
          
      });
      console.log(this.noShow); 
    });
  }


}
