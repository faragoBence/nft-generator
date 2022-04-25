const basePath = process.cwd();

const { width, height, editionSize } = require(`${basePath}/baseconfig.js`);

// Prefix to add to edition dna ids (to distinguish dna counts from different generation processes for the same collection)
const editionDnaPrefix = 0;

const ImageLayerService = require(`${basePath}/image/imagelayerservice`);
const imageLayerService = new ImageLayerService(editionDnaPrefix, width, height);

// Create required weights for each weight, call 'addRarity' with the id and from which to which element this rarity should be applied
let rarityWeights = [
  imageLayerService.addRarity("original", 1, editionSize),
  /* 
  imageConfigService.addRarity("rare", 1, 1),
  imageConfigService.addRarity("super_rare", 1, 1),
  */
];

/* 
Create required layers:
  For each layer, call 'addLayer' with the id and optionally the positioning and size
  The id would be the name of the folder in your input directory, e.g. 'ball' for ./input/ball
*/
const layers = [
  imageLayerService.addLayer("Background", rarityWeights, { x: 0, y: 0 }, { width: width, height: height }),
  imageLayerService.addLayer("Skins", rarityWeights),
  imageLayerService.addLayer("Base", rarityWeights),
  imageLayerService.addLayer("Eyes", rarityWeights),
  imageLayerService.addLayer("Hairs", rarityWeights),
  imageLayerService.addLayer("Ears", rarityWeights),
  imageLayerService.addLayer("Mouths", rarityWeights),
  imageLayerService.addLayer("Noses", rarityWeights),
];

module.exports = {
  rarityWeights,
  layers
};