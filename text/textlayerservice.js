const fs = require("fs");
const basePath = process.cwd();

class TextLayerService {

    parsedData = [];

    parseJson = () => {
        let rawdata = fs.readFileSync(`${basePath}/text/input/input.json`);
        this.parsedData = JSON.parse(rawdata);
    }

    addLayer = (jsonRootWrapperName, layerName, layerNamePrefix) => {
        // If the json not parsed yet, the script read and parse it
        if (this.parsedData.length === 0) {
            this.parseJson();
        }

        let elementsForLayer = {
            layerName: layerName,
            layerNamePrefix: layerNamePrefix,
            elements: this.parsedData[jsonRootWrapperName][layerName],
        };

        return elementsForLayer;
    }
}

module.exports = TextLayerService;
