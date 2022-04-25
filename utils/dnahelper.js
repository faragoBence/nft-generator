class DnaHelper {
    // Create a dna based on the available layers for the given rarity
    static createImageDna = (layers, rarity, rarityWeights) => {
      let randNum = [];
      let rarityWeight = rarityWeights.find((rw) => rw.value === rarity);
      layers.forEach((layer) => {
        let num = Math.floor(Math.random() * layer.elementIdsForRarity[rarity].length);
        if (rarityWeight && rarityWeight.layerPercent[layer.id]) {
          // If there is a layerPercent defined, we want to identify which dna to actually use here (instead of only picking from the same rarity)
          let rarityForLayer = this.getRandomRarity(rarityWeight.layerPercent[layer.id]);
          num = Math.floor(Math.random() * layer.elementIdsForRarity[rarityForLayer].length);
          randNum.push(layer.elementIdsForRarity[rarityForLayer][num]);
        } else {
          randNum.push(layer.elementIdsForRarity[rarity][num]);
        }
      });
      return randNum;
    };

    static createTextDna = (layers) => {
      let randNum = [];
      layers.forEach((layer) => {
        let num = Math.floor(Math.random() * layer.elements.length);
        randNum.push(num);
      });
      return randNum;
    }

    /* 
     Check the configured layer to find information required for rendering the layer
     this maps the layer information to the generated dna and prepares it for drawing on a canvas
    */
    static constructLayerToImageDna = (dna = [], layers = [], rarity) => {
      let mappedDnaToLayers = layers.map((layer, index) => {
        let selectedElement = layer.elements.find(
          (element) => element.id === dna[index]
        );
        return {
          location: layer.location,
          position: layer.position,
          size: layer.size,
          selectedElement: { ...selectedElement, rarity: rarity },
        };
      });
      return mappedDnaToLayers;
    };

    static constructLayerToTextDna = (dna = [], layers = []) => {
      let mappedDnaToLayers = layers.map((layer, index) => {
        let selectedElement = layer.elements[dna[index]];
        return {
          layerName: layer.layerName,
          layerNamePrefix: layer.layerNamePrefix,
          selectedElement: selectedElement,
        };
      });
      return mappedDnaToLayers;
    };
  
    // Check if the given dna is contained within the given dnaList
    static isDnaUnique = (dnaList = [], dna = []) => {
      let foundDna = dnaList.find((i) => i.join("") === dna.join(""));
      return foundDna == undefined ? true : false;
    };

    
    static getRandomRarity = (rarityOptions) => {
      let randomPercent = Math.random() * 100;
      let percentCount = 0;
    
      for (let i = 0; i <= rarityOptions.length; i++) {
        percentCount += rarityOptions[i].percent;
        if (percentCount >= randomPercent) {
          console.log(`Use random rarity ${rarityOptions[i].id}`);
          return rarityOptions[i].id;
        }
      }
      return rarityOptions[0].id;
    };
}
module.exports = DnaHelper;
