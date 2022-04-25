const basePath = process.cwd();

const { width, height, editionSize, startEditionFrom } = require(`${basePath}/baseconfig.js`);
const { rarityWeights, layers } = require(`${basePath}/image/imageconfig.js`);
const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const fs = require("fs");
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
let dnaListByRarity = {};
// Image data collection
const imageDataArray = [];

// Create generative art by using the canvas api
const generate = async () => {
  console.log("##################");
  console.log("Generating your NFT collection");
  console.log("##################");
  console.log();

  // Prepare dnaList object
  rarityWeights.forEach((rarityWeight) => {
    dnaListByRarity[rarityWeight.value] = [];
  });

  await MetaDataHelper.generateCollectionMetadata("image");
  await generateLocalImages();
  await MetaDataHelper.generateLocalMetadata("image", imageDataArray);
  
  imageUploader = new ImageUploader();
  await imageUploader.uploadCollectionImage("image");
  await imageUploader.uploadImages("image");
  
  metaUploader = new MetaUploader();
  await metaUploader.uploadCollectionMeta("image");
  await metaUploader.uploadMetas("image");

  console.log("#########################################");
  console.log("NFT generation finished");
  console.log("#########################################");
  console.log();
};

const generateLocalImages = async () => {
  // Create NFTs from startEditionFrom to editionSize
  let editionCount = startEditionFrom;

  while (editionCount <= editionSize) {
    console.log("-----------------");
    console.log("Generating %d of %d", editionCount, editionSize);

    // Upload to ipfs
    const saveFile = async () => {
      // Get rarity from to config to create NFT as
      let rarity = getRarity(editionCount);
      console.log("- rarity: " + rarity);

      // Calculate the NFT dna by getting a random part for each layer
      let newDna = DnaHelper.createImageDna(layers, rarity, rarityWeights);
      while (!DnaHelper.isDnaUnique(dnaListByRarity[rarity], newDna)) {
        // Recalculate dna as this has been used before.
        console.log("Found duplicate DNA " + newDna.join("-") + ", recalculate...");
        newDna = DnaHelper.createImageDna(layers, rarity, rarityWeights);
      }
      console.log("- dna: " + newDna.join("-"));

      // Propagate information about required layer contained within config into a mapping object
      let results = DnaHelper.constructLayerToImageDna(newDna, layers, rarity);
      let loadedElements = [];

      // Load all images to be used by canvas
      results.forEach((layer) => {
        loadedElements.push(loadLayerImg(layer));
      });

      let attributesList = [];

      await Promise.all(loadedElements).then((elementArray) => {
        // Create empty image
        ctx.clearRect(0, 0, width, height);
        // Draw a random background color
        drawBackground();
        // Store information about each layer to add it as meta information
        attributesList = [];
        // Draw each layer
        elementArray.forEach((element) => {
          drawElement(element);
          attributesList.push(getAttributeForElement(element));
        });
        // Add an image signature as the edition count to the top left of the image
        signImage(`#${editionCount}`);
      });
      dnaListByRarity[rarity].push(newDna);

      let filename = editionCount.toString() + ".png";
      let filetype = "image/png";

      // Save locally as file
      fs.writeFileSync(`./image/output/${filename}`, canvas.toBuffer(filetype));

      console.log("Nft " + editionCount.toString() + " generated successfully");

      imageDataArray[editionCount] = {
        editionCount: editionCount,
        newDna: newDna,
        attributesList: attributesList,
      };
    };

    await saveFile();
    editionCount++;
  }
}

// Adds a signature to the top left corner of the canvas
const signImage = (signiture) => {
  ctx.fillStyle = "#000000";
  ctx.font = "bold 30pt Helvetica";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(signiture, 40, 40);
};

// Generate a random color hue
const generateColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, 85%)`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = generateColor();
  ctx.fillRect(0, 0, width, height);
};

// Prepare attributes for the given element to be used as metadata
const getAttributeForElement = (element) => {
  let selectedElement = element.layer.selectedElement;
  let attribute = {
    name: selectedElement.name,
    rarity: selectedElement.rarity,
  };
  return attribute;
};

// Loads an image from the layer path, returns the image in a format usable by canvas
const loadLayerImg = async (layer) => {
  return new Promise(async (resolve) => {
    const image = await loadImage(`${layer.selectedElement.path}`);
    resolve({ layer: layer, loadedImage: image });
  });
};

const drawElement = (element) => {
  ctx.drawImage(
    element.loadedImage,
    element.layer.position.x,
    element.layer.position.y,
    element.layer.size.width,
    element.layer.size.height
  );
};

// Holds which rarity should be used for which image in edition
let rarityForEdition = [];

// Get the rarity for the image by edition number that should be generated
const getRarity = (editionCount) => {
  if (rarityForEdition.length === 0) {
    rarityWeights.forEach((rarityWeight) => {
      for (let i = rarityWeight.from; i <= rarityWeight.to; i++) {
        rarityForEdition.push(rarityWeight.value);
      }
    });
  }
  return rarityForEdition[editionSize - editionCount];
};

// Initiate code
generate();
