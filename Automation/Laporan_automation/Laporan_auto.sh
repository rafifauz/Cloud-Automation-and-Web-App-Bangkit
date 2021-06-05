#!/bin/bash

#export project_gcp='hera1234'
#export firestore_id='report'
#export table_id='hera1234.Laporan.reports'

project_gcp='hera1234'
firestore_id='report'
table_id='hera1234.Laporan.reports'

tanggal=$(date -d ' days''+7 hour' '+%d-%B-%Y')
echo $tanggal

echo "---------Open Project---------"
gcloud config set project $project_gcp

echo "---------Export Firestore Data---------"
gcloud firestore export gs://hera1234.appspot.com --collection-ids="$firestore_id"

echo "---------List Storage---------"
gsutil ls gs://hera1234.appspot.com/

#echo "---------Create BigQuery---------"
#bq --location=asia-southeast2 load --source_format=DATASTORE_BACKUP Laporan.reports gs://hera1234.appspot.com/2021-05-31T06:32:51_47136/all_namespaces/kind_report/all_namespaces_kind_report.export_metadata

echo "---------Update BigQuery---------"
bq --location=asia-southeast2 load \
--source_format=DATASTORE_BACKUP \
--replace \
Laporan.reports \
gs://hera1234.appspot.com/2021-05-31T06:32:51_47136/all_namespaces/kind_report/all_namespaces_kind_report.export_metadata

echo "---------Get Json List---------"
bq query --use_legacy_sql=false --format=prettyjson 'SELECT fullname,nik,address,description,category,phoneNumber,ttl,uploadTime FROM '"$table_id"' where fullname!="nanti dihapus Rafi"' > "Laporan_$tanggal.json"

echo "---------Json to csv---------"
python3 json_to_CSV.py Laporan_$tanggal

echo "---------Upload to drive---------"
rclone copy Laporan_$tanggal.csv gdrive-auto:
