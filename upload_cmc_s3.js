// this script use Javascript V3 - upload to CMC S3
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const fs     = require('fs')
var files = fs.readdirSync('./test_report/');

let today = new Date();
let currentDate = today.getFullYear()+'-'+String((today.getMonth()+1)).padStart(2, '0')+'-'+String(today.getDate()).padStart(2, '0');

const apiPath = "auto-test-api-output/" + currentDate + "/";

// ====== JS VV3
// Create an S3 client instance with credentials
const s3Client = new S3Client({
    region: "hcm-1",
    credentials: {
        accessKeyId: "",
        secretAccessKey: ""
    },
    endpoint: "https://s3.hcm-1.cloud.cmctelecom.vn"
});

// Files to upload
async function uploadFileToS3(file) {
    try {
        console.log("Start upload " + file + " to S3");

        const filePath = path.join("./test_report/", file);

        // Read the file data
        const fileData = fs.readFileSync(filePath);  // Synchronously reading file data
        const reportData = Buffer.from(fileData); // Convert data to buffer

        // S3 upload parameters
        const params = {
            Bucket: "sbh-qc",  // Your S3 bucket name
            Key: apiPath + file,  // File path in S3 bucket
            Body: reportData,
            ACL: 'public-read', // Set permission - read file
            ContentType: "text/plain;charset=utf-8"  // Content-Type header
        };

        // Upload to S3 using PutObjectCommand
        const command = new PutObjectCommand(params);
        const response = await s3Client.send(command); // Send the upload command
        console.log(file + " uploaded to S3 successfully", response);
    } catch (error) {
        console.error("Error uploading file:", file, error);
    }
}

// Loop through files and upload each one
for (let item in files) {
    let file = files[item];
    uploadFileToS3(file);
}