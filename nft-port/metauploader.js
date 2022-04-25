const path = require("path");
const basePath = process.cwd();
const fs = require("fs");
const FormData = require("form-data");

const { fetchWithoutRetry } = require(`${basePath}/utils/fetcher.js`);

const regex = new RegExp("^([0-9]+).json$");


class MetaUploader {
    
  async uploadMetas(type) {

    const metasDir = `${basePath}/${type}/output/metas`;
    console.log("Starting upload of metadata...");
    const files = fs.readdirSync(metasDir);
    files.sort(function (a, b) {
        return a.split(".")[0] - b.split(".")[0];
    });

    const formData = new FormData();
    for (const file of files) {
      if (regex.test(file)) {
        let jsonFile = fs.createReadStream(`${metasDir}/${file}`);
        formData.append("metadata_files", jsonFile);
      }
    }

    try {
      const url = "https://api.nftport.xyz/v0/metadata/directory";
      const options = {
        method: "POST",
        headers: {},
        body: formData,
      };
      const response = await fetchWithoutRetry(url, options);
      fs.writeFileSync(
        `${basePath}/${type}/output/ipfsUrl.json`,
        JSON.stringify(response.metadata_directory_ipfs_uri, null, 2)
      );
      console.log("Metadata files uploaded to: " + response.metadata_directory_ipfs_uri);
    } catch (err) {
      console.log(`Catch: ${err}`);
    }
  }

  async uploadCollectionMeta(type)
  {
    console.log("Uploading collection metadata...");
    const formData = new FormData();
    let jsonFile = fs.readFileSync(`${basePath}/${type}/output/metas/collectionMetadata.json`);
    formData.append("metadata_files", jsonFile);
    try {
      const url = "https://api.nftport.xyz/v0/metadata";
      const options = {
        method: "POST",
        headers: {},
        body: jsonFile,
      };
      const response = await fetchWithoutRetry(url, options);
      fs.writeFileSync(
        `${basePath}/${type}/output/collectionIpfsUrl.json`,
        JSON.stringify(response.metadata_uri, null, 2)
      );
      console.log("Collection metadata uploaded to: " + response.metadata_uri);
    } catch (err) {
      console.log(`Catch: ${err}`);
    }
  }
  
}


module.exports = MetaUploader;