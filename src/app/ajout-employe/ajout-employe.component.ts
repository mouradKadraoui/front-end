import { Component } from '@angular/core';
import { Employe } from '../employe/employe.model';
import { Router } from '@angular/router';
import { EmployeService } from '../employe.service';

@Component({
  selector: 'app-ajout-employe',
  templateUrl: './ajout-employe.component.html',
  styleUrls: ['./ajout-employe.component.css']
})
export class AjoutEmployeComponent {

  newEmploye : Employe = {id:0,firstname:'',lastname:'',email:'',date_naissance:'',performanceComment:''};

  constructor(private employeService : EmployeService,private router: Router){}
  ajouterEmploye(){
    this.employeService.createEmploye(this.newEmploye).subscribe(()=>{
      this.newEmploye ={id:0,firstname:'',lastname:'',email:'',date_naissance:'',performanceComment:''};
      this.router.navigate(['/employe'])
    })
  }

}