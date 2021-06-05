#!/bin/bash    

tanggal=$(date -d ' days''+7 hour' '+%d-%B-%Y')
echo $tanggal

rclone copy tf-lite:'Model & Word Dict' ./

cd hera-bangkit && git pull origin main

cp ../modelpost.tflite ./app/src/main/assets
cp ../modellaporan.tflite ./app/src/main/assets
cp ../word_dict_laporan.json ./app/src/main/assets
cp ../word_dict_post.json ./app/src/main/assets
pwd
git add -A
pwd
git commit -m "TF Update version $tanggal"
git push origin main
git pull origin main

