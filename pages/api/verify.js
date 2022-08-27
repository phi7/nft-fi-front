import { ethers } from "ethers"

//電子署名の検証を行い、さらに指定するコントラクトのNFTを持っているかを確認
export default async function apiVerify(req, res) {
  const specifiedNFTContractAddress = "0x842BDfd7da2d603b176f0E41B58a6f2D785aFBcA"

  const {message, address: expected, signature} = req.body
  const digest = ethers.utils.hashMessage(message)
  const actual = ethers.utils.recoverAddress(digest, signature)
  const isVerified = actual === expected
  //電子署名がOKなら
  if (isVerified) {

    try {
      const assetsJson = await(await fetch("https://testnets-api.opensea.io/api/v1/assets" + "?owner=" + actual + "&asset_contract_address=" + specifiedNFTContractAddress)).json();
      // console.log("assetsjson",assetsJson)
      const assets = assetsJson["assets"]
      
      res.send({assets})
    
    } catch (error) {
      console.log(error);
    }
  }
}
