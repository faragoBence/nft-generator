
// NFTPort API KEY
const auth = "YOUR NFTPORT API KEY";
// Your NFTPort API key rate limit
const limit = 3;
// Image width in pixels
const width = 1000;
// Image height in pixels
const height = 1000;
// Description for NFT in metadata file
const nftdescription = 'One of the "My Dream PC" NFT collection';
// Name of the collection on Opensea.io
const collectionName = "My Dream PC";
// Description of the collection on Opensea.io
const collectionDescription = "My Dream PC is a randomized computer NFT collection, generated and stored on chain. Feel free to use My Dream PC in any way you want.";
// Percentage of the token price that goes to the royalty address. 100 bps = 1%
const sellerFees = 500;
// Where seller fees will be paid to
const walletAddress = "0x7ADd4749A576569bD964959062032a63D401884A";
// Id for edition to start from
const startEditionFrom = 1;
// Amount of NFTs to generate in edition
const editionSize = 2;

module.exports = {
  auth,
  limit,
  width,
  height,
  nftdescription,
  collectionName,
  collectionDescription,
  sellerFees,
  walletAddress,
  editionSize,
  startEditionFrom,
};