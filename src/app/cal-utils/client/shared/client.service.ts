import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Client } from './client.model';
@Injectable()
export class ClientService {

    
  clientList: AngularFireList<any>;
  selectedClient: Client = new Client();
  allClients: Client[];
  clientNote: string;

  constructor(private firebase : AngularFireDatabase) { }

 getData(){
    this.clientList = this.firebase.list('clients');
    return this.clientList;
  }

  insertClient(client: Client): string 
  {
    console.log("Inside InsertClient ");
    return this.clientList.push({
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
      landline: client.landline,
      email: client.email,
      age: client.age,
      gender: client.gender,
      notes: client.notes
    }).key;
  }

  updateClient(client: Client) 
  {
    this.clientList.update( client.$key,
      {
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
      landline: client.landline,
      email: client.email,
      age: client.age,
      gender: client.gender,
      notes: client.notes
    });
  }

  deleteClient($key: string){
    this.clientList.remove($key);
  }

  //This method is used to update client notes from appointment input update
  updateClientNotes(clientKey: string, clientNotes: string) {
    this.clientList.update( clientKey,
      {
      notes: clientNotes
    });
  }
}
