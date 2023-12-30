import { Component } from '@angular/core';
import { Employe } from '../models/employe.model';
import { EmployeService } from '../services/employe.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EmployeResponse } from '../models/employe-response.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css'],
})
export class EmployeComponent {
  employes: Employe[] = [];
  employe: Employe = {
    id: 0,
    cni: '',
    firstname: '',
    lastname: '',
    email: '',
    birthDate: new Date(),
    rendement: 0,
    objectif: 0,
    atteint: 0,
    retraite: new Date(),
    performanceComment: '',
  };
  newEmploye: Employe = {
    id: 0,
    cni: '',
    firstname: '',
    lastname: '',
    email: '',
    birthDate: new Date(),
    rendement: 0,
    objectif: 0,
    atteint: 0,
    retraite: new Date(),
    performanceComment: '',
  };
  keyword: string = ''; // fro search on table
  currentPage: number = 1;
  pageSize: number = 7;
  totalPages: number = 0;
  closeResult!: string; // for modal pop up

  constructor(
    private employeService: EmployeService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private toaster: ToastrService
  ) {}

  /*--------------------------------- fETCH DATA FOR TABLE ----------------------------- */
  ngOnInit(): void {
    this.FetchEmployes();
  }
  FetchEmployes() {
    this.employeService
      .getAllEmployes(this.keyword, this.currentPage, this.pageSize)
      .subscribe((response: EmployeResponse) => {
        this.employes = response.content;
        this.totalPages = response.totalPages;
      });
  }
  /*-------------------------------------- Pagination ------------------------------------ */
  handleGoToPage(keyword? : string, page?: number ) {
    this.currentPage = page || 1 ;
    this.keyword = keyword || '';
    this.FetchEmployes();
  }
  handleNext() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.FetchEmployes();
    }
  }
  handlePrevious() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.FetchEmployes();
    }
  }

  /*--------------------------------- TRAITEMENT DE L'AJOUT ----------------------------- */
  ajouterEmploye() {
    this.employeService.createEmploye(this.newEmploye).subscribe(() => {
      this.newEmploye = {
        id: 0,
        cni: '',
        firstname: '',
        lastname: '',
        email: '',
        birthDate: new Date(),
        rendement: 0,
        objectif: 0,
        atteint: 0,
        retraite: new Date(),
        performanceComment: '',
      };
      this.employeService
        .getAllEmployes(this.keyword, this.currentPage, this.pageSize)
        .subscribe((response: EmployeResponse) => {
          this.employes = response.content;
          this.totalPages = response.totalPages;
        });
      this.modalService.dismissAll();
    });
    this.toaster.success('New empolye added successfully', 'Success', {
      timeOut: 3000,
    });
  }

  ajouterEmployeModal(AjouterModal: any) {
    this.modalService
      .open(AjouterModal, { ariaLabelledBy: 'ajouter-modal-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed with ${reason}`;
        }
      );
  }

  /*--------------------------------- TRAITEMENT DE LA MODIFICATION ----------------------------- */
  modifierEmploye() {
    this.employeService.updateEmploye(this.employe).subscribe(() => {
      this.employeService
        .getAllEmployes(this.keyword, this.currentPage, this.pageSize)
        .subscribe((response: EmployeResponse) => {
          this.employes = response.content;
          this.totalPages = response.totalPages;
          this.modalService.activeInstances.closed;
        });
    });
    this.toaster.warning('The empolye modified successfully', 'Warning', {
      timeOut: 3000,
    });
  }
  modifierEmployeModal(modifierEmployee: any, id: number) {
    this.modalService
      .open(modifierEmployee, { ariaLabelledBy: 'modifier-modal-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed with ${reason}`;
        }
      );
    this.afficherDetailsEmploye(id);
  }

  afficherDetailsEmploye(id: number) {
    this.employeService.getEmployeById(id).subscribe((employe) => {
      this.employe = employe;
    });
  }

  formatDate(date: Date | null): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }

  /*--------------------------------- TRAITEMENT DE LA SUPPERSION ----------------------------- */
  supprimerEmploye(id: number) {
    this.employeService.deleteEmploye(id).subscribe(() => {
      this.employes = this.employes.filter((employe) => employe.id !== id);
    });
    this.toaster.error('The empolye deleted successfully', 'Error', {
      timeOut: 3000,
    });
  }
}
