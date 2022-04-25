const basePath = process.cwd();

const fs = require("fs");
const {
  nftdescription,
  collectionName,
  collectionDescription,
  sellerFees,
  walletAddress,
} = require(`${basePath}/baseconfig.js`);

class MetaDataHelper {
  static async generateLocalMetadata(type, nftDataArray) {
    const readDir = `${basePath}/${type}/output`;
    const regex = new RegExp("^([0-9]+).png$");
    const files = fs.readdirSync(readDir);
        
    for (const file of files) {
      if (regex.test(file)) {
        const imageId = file.split(".")[0];
        const filename = imageId.toString() + ".json";
        let nftMetadata = this.generateMetadata(
          nftDataArray[imageId].newDna,
          nftDataArray[imageId].editionCount,
          nftDataArray[imageId].attributesList,
          file
        );  

        // Save locally as file
        fs.writeFileSync(
          `${basePath}/${type}/output/metas/${filename}`,
          JSON.stringify(nftMetadata)
        );
      }
    }
  };
      
  // Add metadata for individual nft edition
  static generateMetadata (dna, edition, attributesList, path) {
    let dateTime = Date.now();
    let tempMetadata = {
      title : collectionName,
      dna: dna.join(""),
      name: `#${edition}`,
      description: nftdescription,
      image: path,
      edition: edition,
      date: dateTime,
      attributes: attributesList,
    };
    return tempMetadata;
  };
      
  static generateCollectionMetadata(type) {
    let collectionMetadata = {
      name: collectionName,
      description: collectionDescription,
      image: `${basePath}/${type}/input/collectionImage.jpg`,
      seller_fee_basis_points: sellerFees,
      fee_recipient: walletAddress,
    }
      
    // Save locally as file
    fs.writeFileSync(
      `${basePath}/${type}/output/metas/collectionMetadata.json`,
      JSON.stringify(collectionMetadata)
    );
  }
}

module.exports = MetaDataHelper;
