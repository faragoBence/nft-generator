const fs = require("fs");
const dir = __dirname;

class ImageLayerService {

    constructor(editionDnaPrefix, width, height) {
      this.editionDnaPrefix = editionDnaPrefix;
      this.width = width;
      this.height = height;
    }

    // Adds a rarity to the configuration. This is expected to correspond with a directory containing the rarity for each defined layer
    // @param id - id of the rarity
    // @param from - number in the edition to start this rarity from
    // @param to - number in the edition to generate this rarity to
    addRarity = (id, from, to) => {
      const rarityWeight = {
          value: id,
          from: from,
          to: to,
          layerPercent: {},
      };
      return rarityWeight;
    };
  
    // Get the name without last 4 characters (slice .png from the file name)
    cleanName = (str) => {
      let name = str.slice(0, -4);
      return name;
    };
  
    // Reads the filenames of a given folder and returns it with its name and path
    getElements = (path, elementCount) => {
      return fs
      .readdirSync(path)
      .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
      .map((i) => {
        return {
          id: elementCount,
          name: this.cleanName(i),
          path: `${path}/${i}`,
        };
      });
    };
  
    // Adds a layer to the configuration. The layer will hold information on all the defined parts and where they should be rendered in the image
    // @param id - id of the layer
    // @param rarityWeights - an array containing the defined nft rarities
    // @param position - on which x/y value to render this part
    // @param size - of the image
    addLayer = (id, rarityWeights, position, size) => {
      if (!id) {
        console.log("Error adding layer, parameters id required");
        return null;
      }
      if (!position) {
        position = { x: 0, y: 0 };
      }
      if (!size) {
        size = { width: this.width, height: this.height };
      }

      // Add two different dimension for elements:
      //  1: All elements with their path information
      //  2: Only the ids mapped to their rarity
      let elements = [];
      let elementCount = 0;
      let elementIdsForRarity = {};
      rarityWeights.forEach((rarityWeight) => {
        let elementsForRarity = this.getElements(`${dir}\\input\\${id}\\${rarityWeight.value}`);

        elementIdsForRarity[rarityWeight.value] = [];
        elementsForRarity.forEach((elementForRarity) => {
          elementForRarity.id = `${this.editionDnaPrefix}${elementCount}`;
          elements.push(elementForRarity);
          elementIdsForRarity[rarityWeight.value].push(elementForRarity.id);
          elementCount++;
        });
        elements[rarityWeight.value] = elementsForRarity;
      });

      let elementsForLayer = {
        id: id,
        position: position,
        size: size,
        elements,
        elementIdsForRarity,
      };
      return elementsForLayer;
    };
  
    // Adds layer-specific percentages to use one vs another rarity
    // @param rarityId - the id of the rarity to specifiy
    // @param rarityWeights - an array containing the defined nft rarities
    // @param layerId - the id of the layer to specifiy
    // @param percentages - an object defining the rarities and the percentage with which a given rarity for this layer should be used
    addRarityPercentForLayer = (rarityId, rarityWeights, layerId, percentages) => {
      let rarityFound = false;
      rarityWeights.forEach((rarityWeight) => {
        if (rarityWeight.value === rarityId) {
          let percentArray = [];
          for (let percentType in percentages) {
            percentArray.push({
                id: percentType,
                percent: percentages[percentType],
            });
          }
          rarityWeight.layerPercent[layerId] = percentArray;
          rarityFound = true;
        }
      });
      if (!rarityFound) {
        console.log(`Rarity ${rarityId} not found, failed to add percentage information`);
      }
    };
}

module.exports = ImageLayerService;
  