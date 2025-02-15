# export NEWMAN="$(pwd)/node_modules/.bin/newman"
export NEWMAN="/usr/local/bin/newman"

############## run on dev environment #################
# must add '--insecure' when run newman to ignore ssl certificate
# must add '-x' => report fail will hook to slack (missing it will ignore fail case)

############## run on local #################
#cd /Users/[]/Documents/AutoAPI/

currentDate=$(date '+%Y-%m-%d')
currentUTC=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
# timestamp=$(date +%s)
dir=test_report
env=sbh_stg.postman_environment

system=cmc
if [ $system = 'cmc' ]; then
  endpoint_s3=s3.hcm-1.cloud.cmctelecom.vn
else
  endpoint_s3=s3.ap-southeast-1.amazonaws.com
fi;

if [ ! -d $dir ]; then
    mkdir -p $dir;
fi;

./lark_notifier.sh "------- Start DAILY Test -------"
./lark_notifier.sh "SBH - Pro Web Testing..."
for filename in ./proweb3/*.json; do
#  ./lark_notifier.sh $(basename $filename)
  logfile=$(basename $filename)
  logfile=${logfile%.json}
  $NEWMAN run $filename -e config/${env}.json --insecure -x >${dir}/${logfile}.log -r lark,cli
  ./lark_notifier.sh "Log here: https://${endpoint_s3}/sbh-qc/auto-test-api-output/${currentDate}/${logfile}.log"
  psql "postgresql://account:pwd@ip:host/mydb" <<EOF
INSERT INTO public.qc_auto_report_n_log (project, auto_type, env, log_file_link, report_file_link, created_at) 
VALUES ('sbh','auto_api','${env}','https://${endpoint_s3}/sbh-qc/auto-test-api-output/${currentDate}/${logfile}.log', '', '${currentUTC}');
EOF
done

./lark_notifier.sh "SBH - App Testing..."
./lark_notifier.sh "product_ingredient Testing..."
for filename in ./app/product_ingredient/*.json; do
#  ./lark_notifier.sh $(basename $filename)
  logfile=$(basename $filename)
  logfile=${logfile%.json}
  $NEWMAN run $filename -e config/${env}.json --insecure -x >${dir}/${logfile}.log -r lark,cli
  ./lark_notifier.sh "Log here: https://${endpoint_s3}/sbh-qc/auto-test-api-output/${currentDate}/${logfile}.log"
  psql "postgresql://postgres:bo_duong_2024@4.193.151.40:5433/mydb" <<EOF
INSERT INTO public.qc_auto_report_n_log (project, auto_type, env, log_file_link, report_file_link, created_at) 
VALUES ('sbh','auto_api','${env}','https://${endpoint_s3}/sbh-qc/auto-test-api-output/${currentDate}/${logfile}.log', '', '${currentUTC}');
EOF
done

./lark_notifier.sh "warehouse Testing..."
for filename in ./app/warehouse/*.json; do
#  ./lark_notifier.sh $(basename $filename)
  logfile=$(basename $filename)
  logfile=${logfile%.json}
  $NEWMAN run $filename -e config/${env}.json --insecure -x >${dir}/${logfile}.log -r lark,cli
  ./lark_notifier.sh "Log here: https://${endpoint_s3}/sbh-qc/auto-test-api-output/${currentDate}/${logfile}.log"
  psql "postgresql://postgres:bo_duong_2024@4.193.151.40:5433/mydb" <<EOF
INSERT INTO public.qc_auto_report_n_log (project, auto_type, env, log_file_link, report_file_link, created_at) 
VALUES ('sbh','auto_api','${env}','https://${endpoint_s3}/sbh-qc/auto-test-api-output/${currentDate}/${logfile}.log', '', '${currentUTC}');
EOF
done

./lark_notifier.sh "order Testing..."
for filename in ./app/order/*.json; do
#  ./lark_notifier.sh $(basename $filename)
  logfile=$(basename $filename)
  logfile=${logfile%.json}
  $NEWMAN run $filename -e config/${env}.json --insecure -x >${dir}/${logfile}.log -r lark,cli
  ./lark_notifier.sh "Log here: https://${endpoint_s3}/sbh-qc/auto-test-api-output/${currentDate}/${logfile}.log"
  psql "postgresql://postgres:bo_duong_2024@4.193.151.40:5433/mydb" <<EOF
INSERT INTO public.qc_auto_report_n_log (project, auto_type, env, log_file_link, report_file_link, created_at) 
VALUES ('sbh','auto_api','${env}','https://${endpoint_s3}/sbh-qc/auto-test-api-output/${currentDate}/${logfile}.log', '', '${currentUTC}');
EOF
done

# for filename in ./app/order_stg/*.json; do
# #  ./lark_notifier.sh $(basename $filename)
#   logfile=$(basename $filename)
#   logfile=${logfile%.json}
#   $NEWMAN run $filename -e config/${env}.json --insecure -x >${dir}/${logfile}.log -r lark,cli
#   ./lark_notifier.sh "Log here: https://${endpoint_s3}/sbh-qc/auto-test-api-output/${currentDate}/${logfile}.log"
#   psql "postgresql://postgres:bo_duong_2024@4.193.151.40:5433/mydb" <<EOF
# INSERT INTO public.qc_auto_report_n_log (project, auto_type, env, log_file_link, report_file_link, created_at) 
# VALUES ('sbh','auto_api','${env}','https://${endpoint_s3}/sbh-qc/auto-test-api-output/${currentDate}/${logfile}.log', '', '${currentUTC}');
# EOF
# done

./lark_notifier.sh "role_permission Testing..."
for filename in ./app/role_permission/*.json; do
#  ./lark_notifier.sh $(basename $filename)
  logfile=$(basename $filename)
  logfile=${logfile%.json}
  # $NEWMAN run $filename -e config/sbh_dev.postman_environment.json --insecure -x >$dir/$logfile.log -r lark,cli
  $NEWMAN run $filename -e config/${env}.json --insecure -x >${dir}/${logfile}.log -r lark,cli
  # ./lark_notifier.sh "Log here: $(pwd)/${dir}/${logfile}.log"
  ./lark_notifier.sh "Log here: https://${endpoint_s3}/sbh-qc/auto-test-api-output/${currentDate}/${logfile}.log"
  psql "postgresql://account:pwd@4.193.151.40:5433/mydb" <<EOF
INSERT INTO public.qc_auto_report_n_log (project, auto_type, env, log_file_link, report_file_link, created_at) 
VALUES ('sbh','auto_api','${env}','https://${endpoint_s3}/sbh-qc/auto-test-api-output/${currentDate}/${logfile}.log', '', '${currentUTC}');
EOF
done

# upload file to S3
# npm start
if [ $system = 'cmc' ]; then
  node upload_cmc_s3.js
else
  node upload_file_to_s3.js
fi;

# remove .log file
for filename in ./test_report/*.log; do
  rm $filename
done

./lark_notifier.sh "------- End DAILY Test -------"