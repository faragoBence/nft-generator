const FormData = require("form-data");
const path = require("path");
const basePath = process.cwd();
const fs = require("fs");

const { RateLimit } = require('async-sema');
const { fetchWithRetry, fetchWithoutRetry } = require(`${basePath}/utils/fetcher.js`);

const { limit } = require(`${basePath}/baseconfig.js`);
const rateLimit = RateLimit(limit);

const regex = new RegExp("^([0-9]+).png");

class ImageUploader {
  async uploadImages(type) {
    console.log("Starting upload of images...");
    const files = fs.readdirSync(`${basePath}/${type}/output`);
    files.sort(function(a, b){
      return a.split(".")[0] - b.split(".")[0];
    });
    const allMetadata = [];
    for (const file of files) {
      try {
        if (regex.test(file)) {
          const fileName = path.parse(file).name;
          let jsonFile = fs.readFileSync(`${basePath}/${type}/output/metas/${fileName}.json`);
          let metaData = JSON.parse(jsonFile);
  
          if (!metaData.image.includes('https://')) {
            await rateLimit()
            const url = "https://api.nftport.xyz/v0/files";
            const formData = new FormData();
            const fileStream = fs.createReadStream(`${basePath}/${type}/output/${file}`);
            formData.append("file", fileStream);
            const options = {
              method: "POST",
              headers: {},
              body: formData,
            };
            const response = await fetchWithRetry(url, options);
            metaData.image = response.ipfs_url;
            metaData.file_url = response.ipfs_url;
  
            fs.writeFileSync(
              `${basePath}/${type}/output/metas/${fileName}.json`,
              JSON.stringify(metaData, null, 2)
            );
            console.log(`${response.file_name} uploaded & ${fileName}.json updated!`);
          } else {
            console.log(`${fileName} already uploaded.`);
          }
  
          allMetadata.push(metaData);
        }
      } catch (error) {
        console.log(`Catch: ${error}`);
      }
    }
  
    fs.writeFileSync(
      `${basePath}/${type}/output/metas/_metadata.json`,
      JSON.stringify(allMetadata, null, 2)
    );
  }

  async uploadCollectionImage(type)
  {
    console.log("Uploading collection image...");
    const collectionMetaPath = `${basePath}/${type}/output/metas/collectionMetadata.json`;
    let jsonFile = fs.readFileSync(collectionMetaPath);
    let metaData = JSON.parse(jsonFile);
    try {
      const url = "https://api.nftport.xyz/v0/files";
      const formData = new FormData();
      const fileStream = fs.createReadStream(metaData.image);
      formData.append("file", fileStream);
      const options = {
        method: "POST",
        headers: {},
        body: formData,
      };
      const response = await fetchWithoutRetry(url, options);
      metaData.image = response.ipfs_url;
      metaData.file_url = response.ipfs_url;
      fs.writeFileSync(
        collectionMetaPath,
        JSON.stringify(metaData, null, 2)
      );
      console.log(`Collection image uploaded and collectionMetadata.json updated!`);
    } catch (error) {
      console.log(`Catch: ${error}`);
    }
  }
}


module.exports = ImageUploader;