// this script use Javascript V2 - upload to S3
const AWS    = require('aws-sdk')
const fs     = require('fs')
var files = fs.readdirSync('./test_report/');

let today = new Date();
let currentDate = today.getFullYear()+'-'+String((today.getMonth()+1)).padStart(2, '0')+'-'+String(today.getDate()).padStart(2, '0');

const apiPath = "auto-test-api-output/" + currentDate + "/";

const s3 = new AWS.S3({
    accessKeyId: "",
    secretAccessKey: "",
    region: process.env.AWS_REGION
})

for (let item in files){
    let file = files[item];
    console.log("Start upload " + file + " to S3");

    fs.readFile("./test_report/" + file, (err, data) => {
            if (err) { throw err }

            var reportData = new Buffer.from(data);

            const params = {
                Bucket: "sbh-qc",
                Key: apiPath + file,
                ContentType: "text/plain;charset=utf-8",
                Body: reportData
            }

            s3.putObject(params, (err) => {
                if (err) { throw err; }
                console.log(file + " uploaded to S3")
            })
        })
}