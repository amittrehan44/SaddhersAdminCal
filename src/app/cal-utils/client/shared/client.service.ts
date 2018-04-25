import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Client } from './client.model';
@Injectable()
export class ClientService {

  clientList: AngularFireList<any>;
  selectedClient: Client = new Client();
  allClients: Client[];

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
      gender: client.gender
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
      gender: client.gender
    });
  }

  deleteClient($key: string){
    this.clientList.remove($key);
  }
}
