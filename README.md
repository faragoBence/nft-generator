# NFT collection generator

Utility for creating a generative art collection from supplied image layers or words, especially made for making NFT collectibles.
Then the generated images and metadata files are uploaded to IPFS storage, and you can mint them to any Blockchain which supports ERC-1155 standards.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Usage](#usage)
- [License](#license)


## Prerequisites

- [Download and install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Register a free account on NFTPort.xyz](https://www.nftport.xyz/sign-up)
- [Download the metamask chrome extension and create/import a wallet](https://metamask.io/download)


### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/faragoBence/nft-generator.git
   ```

2. Inside the repo directory install NPM packages

   ```sh
   npm install
   ```

## Setup

### For image-based NFTs

1.  Insert your image layers to the ./image/input folder.
    Specify the directory name based on the desired NFT attribute names. (Like in the given example)

2.  Replace the collectionImage.jpg in the ./image/input folder

3.  In the ./baseconfig.js specify the attributes of your NFT collection. (It must be obvious, based on the comments in the file)

4.  Then replace the name of the layers with yours in the ./image/imageconfig.js file



### For text-based NFTs

1.  Repleace the input.json file in the ./text/input directory, containing your desired words;

2.  Replace the collectionImage.jpg in the ./text/input folder

3.  In the ./baseconfig.js specify the attributes of your NFT collection. (It must be obvious, based on the comments in the file)

4.  Then specify the rest of the configurations in the ./text/textconfig.js file.

## Usage

#### 1.  Run one of these commands:  
   ##### For image-based NFTs:

   ```sh
   node imagenftgenerator
   ```

   ##### For text-based NFTs:

   ```sh
   node textnftgenerator
   ```

#### 2.  Update the NFTContanct.sol file based on this image:
![NftContact.sol update tutorial image](https://iili.io/VsbEFV.png)

#### 3. Go to [Remix.org](https://remix.ethereum.org) online Solidity IDE website and open NFTContact.sol:
![Open file tutorial image](https://iili.io/VsbNoJ.png)

#### 4. Compile the contract:
![Compile tutorial image](https://iili.io/VsbNoJ.png)

#### 5. Select injected Web3, login to Metamask and select desired blockhain in the Metamask wallet.
#### Then select NFTContact.sol from the contract list and click deploy:
![Deploy tutorial image](https://iili.io/VspQvS.png)

#### 6. Navigate to Opensea.io or any NFT marketplace, and u will see your freshly generated NFT collection.


## License

Distributed under the MIT License. See `LICENSE` for more information.
