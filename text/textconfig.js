const basePath = process.cwd();

// Background color of the text based generated image
const backgroundColor = "#000000";
// Text color of the generated text based image
const fontColor = "#FFFFFF";
// Text maxSize which is printed to the nft
const fontSize = 40;
// The Number of empty rows before the first element printed 
const numberOfEmptyRows = 1;
//The name of the root wrapper in the input.json file
const jsonRootWrapperName = "computerParts";

const TextLayerService = require(`${basePath}/text/textlayerservice`);
const textLayerService = new TextLayerService();

const layers = [
  textLayerService.addLayer(jsonRootWrapperName, "Case", false),
  textLayerService.addLayer(jsonRootWrapperName, "CPU", false),
  textLayerService.addLayer(jsonRootWrapperName, "GPU", false),
  textLayerService.addLayer(jsonRootWrapperName, "Memory", false),
  textLayerService.addLayer(jsonRootWrapperName, "Motherboard", false),
  textLayerService.addLayer(jsonRootWrapperName, "Storage", false),
  textLayerService.addLayer(jsonRootWrapperName, "Power Supply", false),
  textLayerService.addLayer(jsonRootWrapperName, "Keyboard", true),
  textLayerService.addLayer(jsonRootWrapperName, "Monitor", true),
  textLayerService.addLayer(jsonRootWrapperName, "Mouse", true),
  textLayerService.addLayer(jsonRootWrapperName, "Mousepad", true),
];

module.exports = {
  backgroundColor,
  fontColor,
  fontSize,
  numberOfEmptyRows,
  layers,
};