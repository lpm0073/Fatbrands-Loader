import {environment} from "../../environments/environment";
import {CognitoUtil} from "./cognito.service";
import * as AWS from "aws-sdk/global";
import * as S3 from "aws-sdk/clients/s3";

/**
 * Created by Vladimir Budilov
 */


export class S3Service {

    constructor(public cognitoUtil: CognitoUtil) {

    }

    public getS3(): any {
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
        if (!selectedFile) {
            console.log('Please choose a file to upload first.');
            return;
        }
        let fileName = selectedFile.name;
        let folderFileKey = environment.folderName + '/' + this.cognitoUtil.getCognitoIdentity() + "/";
        let FileKey = folderFileKey + fileName;

        this.getS3().upload({
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

    public deleteFile(folderName, FileKey) {
        this.getS3().deleteObject({Key: FileKey}, function (err, data) {
            if (err) {
                console.log('There was an error deleting your file: ', err.message);
                return;
            }
            console.log('Successfully deleted file.');
        });
    }

    public viewFolder(folderName) {
        var folderFileKey = encodeURIComponent(environment.folderName) + '//';
        this.getS3().listObjects({Prefix: folderFileKey}, function (err, data) {
            if (err) {
                console.log('There was an error retrieving your folder: ' + err);
            }

        });
    }

}
