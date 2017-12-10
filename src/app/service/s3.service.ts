import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {CognitoUtil} from "./cognito.service";
import * as AWS from "aws-sdk/global";
import * as S3 from "aws-sdk/clients/s3";

/**
 * Created by Vladimir Budilov
 */

@Injectable()
export class S3Service {

    constructor(public cognitoUtil: CognitoUtil) {
      console.log('S3Service.constructor()');

    }

    private getS3(): any {
      console.log('S3Service.getS3()');
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
        var s3 = new S3(clientParams);

        return s3
    }

    public uploadFile(selectedFile): boolean {
      console.log('S3Service.uploadFile()');
        if (!selectedFile) {
            console.log('Please choose a file to upload first.');
            return;
        }
        let fileName = selectedFile.name;
/*
        let folderFileKey = environment.folderName + '/' + this.cognitoUtil.getCognitoIdentity() + "/";
*/
        let folderFileKey = environment.folderName + "/";
        let FileKey = folderFileKey + fileName;

        console.log('S3Service.uploadFile() - beginning upload');
        this.getS3().upload({
            Key: FileKey,
            ContentType: selectedFile.type,
            Body: selectedFile,
            StorageClass: 'STANDARD',
            ACL: 'private'
        }, function (err, data) {
            if (err) {
              console.log('S3Service.uploadFile() - error: ', err);
                return false;
            }
            console.log('S3Service.uploadFile() - success!');
            return true;
        });
    }

    public deleteFile(folderName, FileKey) {
      console.log('S3Service.deleteFile()');
        this.getS3().deleteObject({Key: FileKey}, function (err, data) {
            if (err) {
                console.log('There was an error deleting your file: ', err.message);
                return;
            }
            console.log('Successfully deleted file.');
        });
    }

    public viewFolder(folderName) {
      console.log('S3Service.viewFolder()');
        var folderFileKey = encodeURIComponent(environment.folderName) + '//';
        this.getS3().listObjects({Prefix: folderFileKey}, function (err, data) {
            if (err) {
                console.log('There was an error retrieving your folder: ' + err);
            }

        });
    }

}
