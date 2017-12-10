import { Component, OnInit } from '@angular/core';
import { CognitoUtil } from "../../service/cognito.service";
import { environment } from "../../../environments/environment";
import * as AWS from "aws-sdk/global";
import * as S3 from "aws-sdk/clients/s3";

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.html',
  styleUrls: ['./file-manager.css']
})
export class FileManagerComponent implements OnInit {

  s3: any;
  errorMessage: String;
  fileName: String;

  constructor(
    public cognitoUtil: CognitoUtil) {

      console.log('FileManagerComponent.constructor()');

      AWS.config.update({
          region: environment.bucketRegion,
      });

      let clientParams:any = {
          region: environment.bucketRegion,
          apiVersion: '2006-03-01',
          params: {Bucket: environment.s3BucketName}
      };
      if (environment.s3_endpoint) {
          clientParams.endpoint = environment.s3_endpoint;
      }
      this.s3 = new S3(clientParams);

    }

    onFileSelectButtonClick(event:any) {
      console.log('FileManagerComponent.onFileSelectButtonClick()', event.target.files[0]);
        if (event.target.files == null) {
          console.log('No file was selected.');
            this.errorMessage = "No file was selected.";
            return;
        }
        this.errorMessage = null;
        this.fileName = event.target.files[0].name;

        /* this.uploadFile(files); */
    }


    public uploadFile(selectedFile) {
      console.log('FileManagerComponent.uploadFile()', selectedFile);
      let fileName = selectedFile.name;
      let folderFileKey = environment.folderName + '/' + this.cognitoUtil.getCognitoIdentity() + "/";
      let FileKey = folderFileKey + fileName;

      this.s3().upload({
          Key: FileKey,
          ContentType: selectedFile.type,
          Body: selectedFile,
          StorageClass: 'STANDARD',
          ACL: 'private'
      }, function (err, data) {
          if (err) {
              console.log('There was an error uploading your file: ', err);
              return false;
          }
          console.log('Successfully uploaded file.');
          return true;
      });


    }


  ngOnInit() {
    console.log('FileManagerComponent.ngOnInit()');
  }

}
