import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  SimpleChanges,
  Input,
  OnInit,
  OnChanges,
  ElementRef
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ActionEvent } from 'src/app/interfaces/admin.interface';
import { MatSort } from '@angular/material/sort';
import {HttpAPIService} from "../../services/http-api.service";
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// from 'html-to-pdfmake' import * ;
import htmlToPdfmake from 'html-to-pdfmake';

import html2canvas from 'html2canvas';
import { DashboardService } from 'src/app/teacher/dashboard/dashboard.service';


interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-material-table',
  templateUrl: './material-table.component.html',
  styleUrls: ['./material-table.component.scss']
})
export class MaterialTableComponent implements OnInit,OnChanges {
  @Input() columns: any[];
  @Input() actionHidden: boolean=false;
  @Input() viewHidden: boolean=false;
  @Input() PDFHidden: boolean=false;
  title2: string = 'htmltopdf';

  @ViewChild('pdfTable') pdfTable: ElementRef;

  @Input() inputData: any;
  @Input() inputExtra: any;
  displayedColumns: string[]
  dataSource: any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSourceOne: MatTableDataSource<PeriodicElement>;
  displayedColumnsOne: string[];
  @Output() actionEvent:EventEmitter<ActionEvent>=new EventEmitter();
  @ViewChild('empTbSort') empTbSort = new MatSort();
  @Input() title:string='';
  service: HttpAPIService;
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(changes){
      this.inputData=changes?.['inputData']?.currentValue;
      this.dataSourceOne.data = this.inputData;
      this.dataSourceOne.sort = this.empTbSort;

    }
  }
  constructor(service:HttpAPIService, private dashboardService: DashboardService) {
    this.dataSourceOne = new MatTableDataSource;
    this.service = service;
  }

  ngOnInit(){
    this.dataSourceOne.data = this.inputData;
    this.displayedColumnsOne = this.columns.map(column => column.key);
    if(!this.actionHidden){

      this.displayedColumnsOne.push('action')
    }
    if(!this.viewHidden){
      this.displayedColumnsOne.push('view')
    }
    if(!this.PDFHidden){
      this.displayedColumnsOne.push('pdf')
    }
    //this.displayedColumnsOne.push('pdf')
  }

  isStudentCompleteQuiz(stdId: number) {
    return !this.dashboardService.failedStudentsIds.includes(stdId)
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceOne.filter = filterValue.trim().toLowerCase();
  }

  updateRowData(id:any){
    this.inputExtra.updateRowData(id)
  }



  ngAfterViewInit() {
    this.dataSourceOne.paginator = this.paginator;
    this.dataSourceOne.sort = this.empTbSort;

  }


 editItem(item: any,index:number) {
  this.actionEvent.emit({type:'edit',data:item,index:index})
 }

 deleteItem(item: any,index:number) {
  this.actionEvent.emit({type:'delete',data:item,index:index})
 }
 viewItem(item: any,index:number) {
  this.actionEvent.emit({type:'view',data:item,index:index});
 }

  fullDetailsViewPdf(item: any,index:number) {
    this.service.generatePdf(`students/${item.id}/geeneratePdf`).subscribe({
      next: (response) => {
        // this.openHTMLContentInNewTab(response);
        this.saveAsPDF(response);
        // this.convertToPDF(response);
        // const doc = new jsPDF();
        //
        // // const pdfTable = this.pdfTable.nativeElement;
        //
        // var html = htmlToPdfmake(response);
        //
        // const documentDefinition = { content: html };
        // pdfMake.createPdf(documentDefinition).open();
      }
    })
  }
  overviewViewPdf(item: any,index:number){
    this.service.generatePdf(`students/${item.id}/generateOverviewPdf`).subscribe({
      next: (response) => { 
        this.saveAsOverviewPDF(response); 
      }
    })
  }
  convertToPDF(htmlContent: string) {
    const pdf = new jsPDF();

    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    // Get the iframe's content window
    const iframeWindow = iframe.contentWindow;

    if(iframeWindow){
      // Set the HTML content within the iframe
      iframeWindow.document.open();
      iframeWindow.document.write(htmlContent);
      iframeWindow.document.close();

      // Use html2canvas to render the HTML content within the iframe as an image
      html2canvas(iframeWindow.document.body).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, 220, 1097);

        // Save the PDF file
        pdf.save('converted.pdf');

        // Remove the temporary iframe
        document.body.removeChild(iframe);
      });
    }

  }
  openHTMLContentInNewTab(htmlContent: string) {
    const newTab = window.open();
    if(newTab)
    {
      newTab.document.open();
      newTab.document.write(htmlContent);
      newTab.print();
      // newTab.document.close();
    }
  }

  saveAsPDF(htmlContent: string) {
    const pdf = new jsPDF();

    const iframe = document.createElement('iframe');
    // iframe.style.display = 'none';
    document.body.appendChild(iframe);

    iframe.onload = () => {
      const iframeWindow = iframe.contentWindow;
      if(iframeWindow)
      {
        iframeWindow.document.open();
        iframeWindow.document.write(htmlContent);
        setTimeout(() => {
          if(iframe)
          {
            iframe?.contentWindow?.print();
          }
          document.body.removeChild(iframe);
        }, 1500);
        iframeWindow.document.close();

      };
      }

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;
  }
  saveAsOverviewPDF(htmlContent: string){
    const pdf = new jsPDF();

    const iframe = document.createElement('iframe');
    // iframe.style.display = 'none';
    document.body.appendChild(iframe);

    iframe.onload = () => {
      const iframeWindow = iframe.contentWindow;
      if(iframeWindow)
      {
        iframeWindow.document.open();
        iframeWindow.document.write(htmlContent);
        setTimeout(() => {
          if(iframe)
          {
            iframe?.contentWindow?.print();
          }
          document.body.removeChild(iframe);
        }, 1500);
        iframeWindow.document.close();

      };
      }

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;
  }
}
