#!/usr/bin/env bash

export AWS_PROFILE=fatburger

cd /Users/mcdaniel/github/fatbrands-loader/
npm run build
cd dist
aws s3 sync . s3://cognitoapp-dataloader/
