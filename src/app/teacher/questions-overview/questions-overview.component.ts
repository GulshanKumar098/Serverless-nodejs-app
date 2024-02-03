import { Component } from '@angular/core';
//import { saveAs } from "file-saver/dist/FileSaver"; 
import FileSaver from "file-saver";

@Component({
  selector: 'app-questions-overview',
  templateUrl: './questions-overview.component.html',
  styleUrls: ['./questions-overview.component.css']
})
export class QuestionsOverviewComponent {
  pdfName:string='Questions Overview'; 
  pdfPath ="../adminPanel/assets/pdf/questions-pd-transitional-quiz.pdf";

  downloadPdf() {
    const pdfUrl ="../adminPanel/assets/pdf/questions-pd-transitional-quiz.pdf";
    const pdfName = "transition-quiz-questions.pdf";
    FileSaver.saveAs(pdfUrl, pdfName);
  }
}
