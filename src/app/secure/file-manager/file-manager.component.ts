import { Component, OnInit } from '@angular/core';
import { S3Service } from "../../service/s3.service";
import { environment } from "../../../environments/environment";
import * as AWS from "aws-sdk/global";
import * as S3 from "aws-sdk/clients/s3";

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.html',
  styleUrls: ['./file-manager.css']
})
export class FileManagerComponent implements OnInit {

  errorMessage: String;
  file: any;
  fileName: String;

  constructor(
    public s3Service: S3Service) {

      console.log('FileManagerComponent.constructor()');

    }

    onFileSelectButtonClick(event:any) {
      console.log('FileManagerComponent.onFileSelectButtonClick()', event.target.files[0]);
        if (event.target.files == null) {
          console.log('No file was selected.');
            this.errorMessage = "No file was selected.";
            return;
        }
        this.errorMessage = null;
        this.file = event.target.files[0]
        this.fileName = this.file.name;

        /* this.uploadFile(files); */
    }


    public uploadFile() {
      console.log('FileManagerComponent.uploadFile() - trying...', this.file);

      if (this.s3Service.uploadFile(this.file)) {
        console.log('it worked.');
      }

    }


  ngOnInit() {
    console.log('FileManagerComponent.ngOnInit()');
  }

}
