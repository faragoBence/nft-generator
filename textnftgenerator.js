const basePath = process.cwd();

const { width, height, editionSize, startEditionFrom } = require(`${basePath}/baseconfig.js`);
const { backgroundColor, fontColor, fontSize, numberOfEmptyRows, layers } = require(`${basePath}/text/textconfig.js`);
const { createCanvas } = require("canvas");
const console = require("console");
const fs = require("fs");
const opentype = require('opentype.js');
const drawText = require("node-canvas-text").default;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");
const DnaHelper = require(`${basePath}/utils/dnahelper.js`);
const MetaDataHelper = require(`${basePath}/utils/metadatahelper.js`);
const util = require('util');
const ImageUploader = require(`${basePath}/nft-port/imageuploader.js`);
const MetaUploader = require(`${basePath}/nft-port/metauploader.js`);
let logFile = fs.createWriteStream('log.txt', { flags: 'w' });
let logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;

// Holds which dna has already been used during generation
let dnaList = [];
// Nft data collection
let nftDataArray = [];

const generate = async () => {
  console.log("##################");
  console.log("Generating your NFT collection");
  console.log("##################");
  console.log();

  await MetaDataHelper.generateCollectionMetadata("text");
  await generateLocalImages();
  await MetaDataHelper.generateLocalMetadata("text", nftDataArray);

  imageUploader = new ImageUploader();
  await imageUploader.uploadCollectionImage("text");
  await imageUploader.uploadImages("text");

  metaUploader = new MetaUploader();
  await metaUploader.uploadCollectionMeta("text");
  await metaUploader.uploadMetas("text");

  console.log("#########################################");
  console.log("NFT generation finished");
  console.log("#########################################");
  console.log();
}

const generateLocalImages = async () => {
  let editionCount = startEditionFrom;
  const fontType = await opentype.load(`${basePath}/text/input/fonts/Roboto-Black.ttf`);
  while (editionCount <= editionSize) {
    console.log("-----------------");
    console.log("Generating %d of %d", editionCount, editionSize);
    
    const saveFile = async () => {
      // Calculate the NFT dna by getting a random part for each layer
      let newDna = DnaHelper.createTextDna(layers);
      while (!DnaHelper.isDnaUnique(dnaList, newDna)) {
        // Recalculate dna as this has been used before.
        console.log("Found duplicate DNA " + newDna.join("-") + ", recalculate...");
        newDna = DnaHelper.createTextDna(layers);
      }
      console.log("- dna: " + newDna.join("-"));

      // Propagate information about required layer contained within config into a mapping object
      let results = DnaHelper.constructLayerToTextDna(newDna, layers);
      let attributesList = [];

      await Promise.all(results).then((elementArray) => {
        // Create empty image
        ctx.clearRect(0, 0, width, height);
        // Draw a random background color
        drawBackground();
        // Store information about each layer to add it as meta information
        attributesList = [];
        // Draw each layer
        index = 0;
        elementArray.forEach((element) => {
          let name = element.selectedElement;
          if (element.layerNamePrefix) {
            name = element.layerName + " : " + name;
          }
          addRowToImage(name, index, fontType);
          index++;
          attributesList.push(getAttributeForElement(element));
        });
      });
      dnaList.push(newDna);

      let filename = editionCount.toString() + ".png";
      let filetype = "image/png";

      // Save locally as file
      fs.writeFileSync(`${basePath}/text/output/${filename}`, canvas.toBuffer(filetype));

      console.log("Nft " + editionCount.toString() + " generated successfully");

      nftDataArray[editionCount] = {
        editionCount: editionCount,
        newDna: newDna,
        attributesList: attributesList,
      };
    };

    await saveFile();
    editionCount++;
  }
}

// Prepare attributes for the given element to be used as metadata
const getAttributeForElement = (element) => {
  return attribute = {
    trait_type: element.layerName,
    value: element.selectedElement,
  };
};

const addRowToImage = (text, index, fontType) => {
  // Calculating the text position
  let headerRect = {
    x: 0,
    y: (numberOfEmptyRows + index) * fontSize * 2,
    width: canvas.width,
    height: canvas.height / 3.5 
  };

  drawText(ctx, text, fontType, headerRect, {
    minSize: 5,
    maxSize: fontSize,
    vAlign: 'top',
    hAlign: 'left',
    fitMethod: 'baseline',
    rectFillOnlyText: true,
    textFillStyle : fontColor,
    drawRect: false
  });
}

const drawBackground = () => {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
};

generate();