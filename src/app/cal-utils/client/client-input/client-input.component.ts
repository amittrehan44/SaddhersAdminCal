import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

import {Client} from '../shared/client.model';
import {ClientService} from '../shared/client.service';
import {ClientAppointmentsService} from '../shared/client-appointments.service';
import {CalEventsService} from '../../../cal-events.service';
import {eventsAPI} from '../../../app.component'

@Component({
  selector: 'app-client-input',
  templateUrl: './client-input.component.html',
  styleUrls: ['./client-input.component.css']
})
export class ClientInputComponent implements OnInit {

  customerForm: FormGroup;
  customer: Client= new Client();
  emailMessage: string;
  private sub: Subscription;


  mask: any[] = ['+', '1', /[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];


  private validationMessages = {
    required: 'Please enter your email address.',
    pattern: 'Please enter a valid email address.'
};

pageTitle: string = 'Product Edit';



constructor(private fb: FormBuilder, 
            private route: ActivatedRoute,
            private router: Router, 
            public clientService: ClientService, 
            private clientAppService: ClientAppointmentsService, 
            private toastr: ToastrService,
            public _caleventService: CalEventsService,) { }


  ngOnInit() {

      this.clientService.getData();
      this.clientAppService.getData();

      this.customerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.maxLength(50)]],
            email: ['', [Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
            phone: ['', [Validators.pattern('[0-9+]{12}')]],
            landline: ['', [Validators.pattern('[0-9+]{12}')]],
            age: '',
            $key: '',
            gender: '',
            notes: '',
      });

      // Read the product Id from the route parameter
      this.sub = this.route.params.subscribe(
        params => {
            let id = params['id'];
            this.getClient(id);
        }
    );

      this.customerForm.valueChanges.subscribe(value=> 
        this.clientService.selectedClient = value);

        const emailControl = this.customerForm.get('email');
        emailControl.valueChanges.subscribe(value =>
          this.setMessage(emailControl));
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
        this.emailMessage = Object.keys(c.errors).map(key =>
            this.validationMessages[key]).join(' ');
    }
}

  resetForm(customerForm?: FormGroup) {
   
    //customerForm.reset();
    this.clientService.selectedClient = {
        $key: null,
        firstName: '',
        lastName: '',
        phone: '',
        landline: '',
        email: '',
        age: '',
        gender: '',
        notes: '',

    }

    this.customerForm.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      phone:'',
      landline: '',
      age: '',
      $key: null,
      gender: '',
      notes: ''

    });  

  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));

    if(this.customerForm.value.$key == null || this.customerForm.value.$key == ''){
      var k = this.clientService.insertClient(this.customerForm.value);
      this.clientAppService.insertNewClient(k);
    }
    else{
      this.clientService.updateClient(this.clientService.selectedClient);

      //update previus appointment of this client
      this.updatePreviousAppointments(this.clientService.selectedClient);
      
    }
     this.resetForm(this.customerForm);
     this.router.navigate(['/welcome']);
     this.toastr.success('Submitted Succcessfully', 'Client');
  }

  updatePreviousAppointments(client: Client) {

    console.log(client);
    console.log(this._caleventService.allAppointments);
    for(var i=0; i<this._caleventService.allAppointments.length; i++){
      if(client.$key == this._caleventService.allAppointments[i].clientKey){
        this._caleventService.updatePreviousAppointment(this._caleventService.allAppointments[i].$key, client);
      }
    } 
  }

  onDelete(key: string){
    if ( this.clientService.selectedClient.$key === null) {
      this.router.navigate(['/welcome']);
    } 
    else {
      if(confirm('Are you sure you want to remove this record?')== true){
        this.clientService.deleteClient(key);
        this.toastr.warning('Deleted Successfully', 'Client Register');
        this.router.navigate(['/welcome']);
      }
    }

   
  }


  //Below function should be transfered to service component
  getClient(key: string){
    console.log(key);

    if(key == '0'){
      this.pageTitle = 'Add Client';
      return this.resetForm(this.customerForm);
    }
    console.log("Key is not 0");
    var x = this.clientService.getData();
    x.snapshotChanges().subscribe(item => {
    
      item.forEach(element => {
      
          if(key == element.key){
            var y = element.payload.toJSON();
            y["$key"] = element.key;
            console.log(y);
            this.onEdit(y as Client)
          }
          
     // console.log(y);
        })
    
    });
  }

    onEdit(client: Client){
      if (this.customerForm) {
            this.customerForm.reset();
        }

        if(client.notes == undefined){
          client.notes = '';
        }
   
      this.clientService.selectedClient = client;

      if ( this.clientService.selectedClient.$key === null) {
            this.pageTitle = 'Add Client';
        } else {
            this.pageTitle = `Edit Client: ${this.clientService.selectedClient.firstName} ${this.clientService.selectedClient.lastName}`;
        }
      this.customerForm.patchValue({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        landline: client.landline,
        age: client.age,
        $key: client.$key,
        gender: client.gender,
        notes: client.notes,

      });  
    }

}
