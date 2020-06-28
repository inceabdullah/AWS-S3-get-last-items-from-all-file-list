const AWS = require("aws-sdk");
const s3Secrets = require('./secrets/s3Secret.json');
AWS.config.update(s3Secrets);
const s3 = new AWS.S3();

const params = {
    Bucket: "habertellalitopimages",
    Prefix: "top_images/"
}


const sortByDate = (a,b) => {
    keyA = new Date(a.LastModified);
    keyB = new Date(b.LastModified);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
}


async function listAllObjectsFromS3Bucket(bucket, prefix) {
  /**
  * Thanks to Mandeep Singh Gulati who reads aws docs
  * Twitter: https://twitter.com/mandeep_m91
  * Page: http://codingfundas.com/node-js-aws-sdk-how-to-list-all-the-keys-of-a-large-s3-bucket/index.html
  * __      __
  *( _\    /_ )
  * \ _\  /_ / 
  *  \ _\/_ /_ _
  *  |_____/_/ /|
  *  (  (_)__)J-)
  *  (  /`.,   /
  *   \/  ;   /
  *    | === |dwb
  * 
  * Art by Donovan Bake
  * Ascii Art Page: https://www.asciiart.eu/people/body-parts/hand-gestures
  */ 
    let isTruncated = true;
    let marker;
    let allObjects = [];

    while(isTruncated) {
      let params = { Bucket: bucket };
      if (prefix) params.Prefix = prefix;
      if (marker) params.Marker = marker;
      try {
        const response = await s3.listObjects(params).promise();

        allObjects = allObjects.concat(response.Contents);

        isTruncated = response.IsTruncated;
        if (isTruncated) {
          marker = response.Contents.slice(-1)[0].Key;
        }
    } catch(error) {
        throw error;
      }
    }
    allObjects.sort(sortByDate);
    return allObjects
  }

  const asyncMain = async (last) => {

      
    var objs = await listAllObjectsFromS3Bucket(params.Bucket, params.Prefix);
    const lastObjs = objs.slice(-last);
    return lastObjs;

  }

  const resultOfLastObjects = asyncMain(2);
  resultOfLastObjects.then(result => {
    console.log("result: =>", result);
  });
