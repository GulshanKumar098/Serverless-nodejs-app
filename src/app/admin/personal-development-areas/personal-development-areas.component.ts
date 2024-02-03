import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'; 
import { AdminService } from './../../services/admin.service';
import { ActionEvent } from 'src/app/interfaces/admin.interface'; 
import { ToastrService } from 'ngx-toastr'; 
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { modalConfig } from 'src/app/interfaces/common';

const HEADER_DATA: any[] = [
  {name:'Personal Development Area', key:'content'}
]

@Component({
  selector: 'app-personal-development-areas',
  templateUrl: './personal-development-areas.component.html',
  styleUrls: ['./personal-development-areas.component.scss'],
})
export class PersonalDevelopmentAreasComponent implements OnInit{
  editForm: FormGroup=new FormGroup({
    content:new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z\\s/&]*$")])
  })
  @ViewChild('deleteTemplate') deleteTemplate: TemplateRef<any>;
  @ViewChild('updateTemplate') updateTemplate: TemplateRef<any>;
  columns: any[] = HEADER_DATA;
  data: any = null;
  modalRef: BsModalRef;
  actionEvent:ActionEvent;
  isAddModel: boolean=true;

  constructor(private modalService: BsModalService,private toastr: ToastrService,private adminService : AdminService,    ){
  }

  ngOnInit(){
    this.getPersonalDevelopmenetAreas();
  }

  getPersonalDevelopmenetAreas(){
    this.adminService.get('personalDevelopmentAreas').subscribe({
      next:(response)=>{
        this.data = response;
      }
    })
  }
  openFormModal() {
    this.isAddModel=true;
    this.modalRef = this.modalService.show(this.updateTemplate,modalConfig);
  }

  actionEvents(event:ActionEvent){
    this.actionEvent=event;
    if(event.type==='edit'){
      this.openEditModel()
    }
    else if(event.type==='delete'){
    this.openDeleteModel()
    }
  }

  openDeleteModel(){
    this.modalRef = this.modalService.show(this.deleteTemplate,modalConfig);
  }

  openEditModel(){
    this.isAddModel=false;
    this.editForm.get('content')?.setValue(this.actionEvent?.data?.content)
    this.modalRef = this.modalService.show(this.updateTemplate,modalConfig);
  }


  editPDA(){
    if(this.editForm.valid){
    let url='personalDevelopmentAreas/'+this.actionEvent.data.id+'?content='+this.editForm.get('content')?.value;
    this.adminService.put(url).subscribe(response=>{
      let index=this.data.findIndex((x:any)=>x.id===this.actionEvent.data.id);
      this.data[index]={...response};
      this.data=structuredClone(this.data)
         if(response){
           this.toastr.success('Updated Successfully!', this.editForm.value.content);
           this.modalRef.hide();
         }
     });
    }else{
      const errors = this.editForm.get("content")?.errors;
      if ( errors?.hasOwnProperty("required") ) {
        this.toastr.error('Please Enter Personal Development Area Name', 'Error')
      }
      if ( errors?.hasOwnProperty("pattern") ) {
        this.toastr.error('Your Allowed to use only characters and spaces', 'Error')
      }
    }
  }

  createPDA(){
    if(this.editForm.valid){
    let url='personalDevelopmentAreas?content='+this.editForm.get('content')?.value;
       this.adminService.post(url).subscribe(response=>{
      if(response){
        this.data.push(response);
        this.toastr.success('Created Successfully!', this.editForm.value.content);
        this.data=structuredClone(this.data);
        this.modalRef.hide();
        this.editForm.reset();
    }
    this.clearForm();
    });
  }else{
    const errors = this.editForm.get("content")?.errors;
    if ( errors?.hasOwnProperty("required") ) {
      this.toastr.error('Please Enter Personal Development Area Name', 'Error')
    }
    if ( errors?.hasOwnProperty("pattern") ) {
      this.toastr.error('Your Allowed to use only characters and spaces', 'Error')
    } 
  }
  }
  deletePDA(){
    let url=`personalDevelopmentAreas/${this.actionEvent.data.id}`
    this.adminService.delete(url).subscribe(response=>{
      this.data=this.data.filter((x:any)=>x.id!==this.actionEvent.data.id);
      this.data=structuredClone(this.data);
      if (response) {
        this.toastr.success('Deleted Successfully!', this.editForm.value.content);
        this.modalRef.hide(); 
        //added for delete issue
        this.actionEvent = null as any;
      }
    });
  }

  clearForm(){
    this.editForm.reset();
  }

  confirmEvent(){
    console.log('>> action event', this.actionEvent );
    if(this.actionEvent===null || this.actionEvent===undefined){
      this.createPDA();
    }
    else if(this.actionEvent && this.actionEvent.type==='edit'){
    this.editPDA();
    }
    else if(this.actionEvent && this.actionEvent.type==='delete'){
      this.deletePDA();
    }
  }

  ngOnDestroy(): void {
    this.actionEvent=null as any;
  }
}
