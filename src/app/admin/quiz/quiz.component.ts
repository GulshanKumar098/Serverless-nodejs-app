import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ActionEvent } from 'src/app/interfaces/admin.interface';
import { modalConfig } from 'src/app/interfaces/common';
import { AdminService } from 'src/app/services/admin.service';
import { ElementRef } from '@angular/core';

const HEADER_DATA: any[] = [
  { name: 'Quiz Name', key: 'name' },
  // { name: 'Question Length', key: 'name' },
]
interface Website {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})

export class quizComponent {
  constructor(private adminService: AdminService, private elementRef: ElementRef, private toastr: ToastrService, private modalService: BsModalService) {
  }

  columns: any[] = HEADER_DATA;
  actionEvent: ActionEvent;
  quizQuestionArr: any = [];
  allSchools: any = [];
  allPDA: any = [];
  data: any = null;
  allQuiz: any = [];
  selectedSchool = 0;
  selectedPDA = 0;
  quizName = "";
  schoolName: any = [];
  modalRef: BsModalRef;
  isTable = true;
  isAddModel: boolean = true;
  editSelectId: any;
  @ViewChild('createQuiz') updateTemplate: TemplateRef<any>;
  @ViewChild('deleteTemplate') deleteTemplate: TemplateRef<any>;
  questionError = false;
  choiceError = false;
  actionEvents(event: ActionEvent) {
    this.actionEvent = event;
    if (event?.type === 'edit') {
      this.openEditModel();
    }
    else if (event?.type === 'delete') {
      this.openDeleteModel()
    }
  }
  openDeleteModel() {
    this.modalRef = this.modalService.show(this.deleteTemplate, modalConfig);
  }

  openEditModel() {
    this.schoolName = [];
    this.isAddModel = false;
    this.isTable = false;
    this.quizName = "";
    this.quizName = this.actionEvent?.data?.name;
    this.quizQuestionArr = [];
    this.editSelectId = this.actionEvent?.data?.id;
    if (this.actionEvent?.data && this.actionEvent?.data?.schools && this.actionEvent?.data?.schools?.length > 0) {
      var schoolData: any = [];
      this.actionEvent?.data?.schools.forEach((element: any) => schoolData.push(element?.id));
      this.schoolName = schoolData;
    }
    if (this.actionEvent?.data && this.actionEvent?.data?.questions && this.actionEvent?.data?.questions?.length > 0) {
      var pdaData: any = [];
      this.actionEvent?.data?.questions.forEach((element: any) => {
        element.pda_id = element?.pda?.id
        pdaData.push(element);
      });
      this.quizQuestionArr = pdaData;
    }
  }

  //   updateQuiz(){
  //     this.isTable = true;
  //     var filterData=this.allQuiz.findIndex(item:any=>item.id=)
  // }
  async updateQuiz() {
    this.questionError = false;
    this.choiceError = false;
    if (!this.quizName || !(this.quizName && this.quizName.trim())) {
      this.toastr.error("error", "Please enter quiz name")
      return;
    }
    // if (!this.schoolName || this.schoolName?.length === 0) {
    //   this.toastr.error("error", "Please select school")
    //   return;
    // }
    if (!this.quizQuestionArr || this.quizQuestionArr?.length === 0) {
      this.toastr.error("error", "Please enter question")
      return;
    }


    if (this.quizQuestionArr?.length > 0) {
      await this.quizQuestionArr.forEach(async (element: any, index: any) => {
        if (!element?.question_text || !(element?.question_text && element?.question_text.trim())) {
          this.questionError = true;
          this.toastr.error("error", `Please enter question name in question number ${index + 1}`)
          return;
        }
        if (!element.choices || (element.choices && element.choices.length === 0)) {
          this.choiceError = true
          this.toastr.error("error", `Please enter option in question number ${index + 1}`)
          return;
        }
        if (element?.choices && element?.choices?.length > 0) {
          await element?.choices.forEach((questionOption: any, choiceIndex: any) => {
            if (!questionOption?.choice_text || !(questionOption?.choice_text && questionOption?.choice_text.trim())) {
              this.choiceError = true
              this.toastr.error("error", `Please enter option name in question number ${index + 1} and option number ${choiceIndex + 1} `)
              return;
            }
          });
        }
      });
    }

    if (this.questionError || this.choiceError) {
      return;
    }
    var postdata = {
      "id": this.editSelectId,
      "name": this.quizName,
      "school_ids": this.schoolName,
      "questions": this.quizQuestionArr
    }
    let url = 'tests/' + this.editSelectId;
    this.adminService.put(url, postdata).subscribe(response => {
      if (response) {
        this.toastr.success('success', 'Updated Successfully!');
        this.isTable = true;
        this.getSchoolsList();
        this.getpdas();
        this.getQuizList();
      }
    });
  }

  deleteTest() {
    let url = `tests/${this.actionEvent.data.id}`
    this.adminService.delete(url).subscribe({
      next: response => {
        this.allQuiz = this.allQuiz.filter((x: any) => x.id !== this.actionEvent.data.id);
        this.allQuiz = structuredClone(this.allQuiz);
        if (response) {
          this.modalRef.hide();
          this.toastr.success('success', 'Quiz Deleted Successfully!');
        }
      },
      error: error => {
        this.toastr.error('error', error);
        this.modalRef.hide();
      }
    });
  }


  ngOnInit() {
    this.getSchoolsList();
    this.getpdas();
    this.getQuizList();
    if (this.elementRef) {
      this.elementRef.nativeElement.focus();
    }
  }

  getSchoolsList() {
    this.adminService.get('schools').subscribe({
      next: (response) => {
        this.allSchools = response.map(s =>s.id);
        this.selectedSchool = response[0].id;
      }
    })
  }

  getpdas() {
    this.adminService.get('personalDevelopmentAreas').subscribe({
      next: (response) => {
        this.allPDA = response;
        this.selectedPDA = response[0].id;
      }
    })
  }
  selectPDA(value: any, loopValue: any) {
    let PDAname = value.target.value;
    let selectedPDAindex = this.allPDA.findIndex((data: any) => data.content === PDAname);
    this.selectedPDA = this.allPDA[selectedPDAindex];
  }
  getQuizList() {
    this.adminService.get('tests').subscribe({
      next: (response) => {
        this.allQuiz = response;
      }
    })
  }

  deleteQuestion(id: number) {
    this.quizQuestionArr.splice(id, 1);

  }

  deleteOption(questionId: number, optionId: number) {
    this.quizQuestionArr[questionId].choices.splice(optionId, 1);
  }

  async saveQiuz() {
    this.questionError = false;
    this.choiceError = false;
    if (!this.quizName || !(this.quizName && this.quizName.trim())) {
      this.toastr.error("error", "Please enter quiz name")
      return;
    }
  //  if (!this.schoolName || this.schoolName?.length === 0) {
  //     this.toastr.error("error", "Please select school")
  //     return;
  //   }
    if (!this.quizQuestionArr || this.quizQuestionArr?.length === 0) {
      this.toastr.error("error", "Please enter question")
      return;
    }


    if (this.quizQuestionArr?.length > 0) {
      await this.quizQuestionArr.forEach(async (element: any, index: any) => {
        if (!element?.question_text || !(element?.question_text && element?.question_text.trim())) {
          this.questionError = true;
          this.toastr.error("error", `Please enter question name in question number ${index + 1}`)
          return;
        }
        if (!element.choices || (element.choices && element.choices.length === 0)) {
          this.choiceError = true
          this.toastr.error("error", `Please enter option in question number ${index + 1}`)
          return;
        }
        if (element?.choices && element?.choices?.length > 0) {
          await element?.choices.forEach((questionOption: any, choiceIndex: any) => {
            if (!questionOption?.choice_text || !(questionOption?.choice_text && questionOption?.choice_text.trim())) {
              this.choiceError = true
              this.toastr.error("error", `Please enter option name in question number ${index + 1} and option number ${choiceIndex + 1} `)
              return;
            }
          });
        }
      });
    }

    if (this.questionError || this.choiceError) {
      return;
    }
    let body = {
      name: this.quizName,
      school_ids: this.allSchools,
      questions: this.quizQuestionArr
    };
    await this.adminService.post("tests", body).subscribe(data => {
      this.closeQiuz();
      this.getQuizList();
    })

  }

  createQuestion() {
    this.quizQuestionArr.push({
      question_text: "",
      pda_id: this.selectedPDA,
      choices: [],
    });
  }

  checkCheckBoxvalue(event: any, questionId: number, optionId: number) {
    if (event.target.checked) {
      this.quizQuestionArr[questionId].choices[optionId].is_correct = true;
    } else {
      this.quizQuestionArr[questionId].choices[optionId].is_correct = false;
    }
  }

  createOption(id: number) {
    this.quizQuestionArr[id].choices.push({
      choice_text: "",
      is_correct: false

    });
  }



  confirmEvent() {
    if (this.actionEvent === null || this.actionEvent === undefined || this.actionEvent.type === 'null') {
      this.saveQiuz();
    }
    else if (this.actionEvent && this.actionEvent.type === 'edit') {
      this.updateQuiz();
    }
    else if (this.actionEvent && this.actionEvent.type === 'delete') {
      this.deleteTest();
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.actionEvent = null as any;
  }
  selectSchoolSet(value: any) {
    let schoolName = value.target.value;
    const selectedSchoolIndex = this.allSchools.findIndex((data: any) => data.name === schoolName);
    this.selectedSchool = this.allSchools[selectedSchoolIndex].id;
    this.schoolName = this.selectedSchool;

  }
  selectedSchools(event: any) {
    
  }
  openFormModal() {
    this.isAddModel = true;
    this.isTable = false;
    this.actionEvent = {
      type: "null",
      data: {},
    }
  }

  closeQiuz() {
    this.quizName = "";
    this.quizQuestionArr = [];
    this.selectedSchool = this.allSchools[0].id;
    this.isTable = true;
  }
}