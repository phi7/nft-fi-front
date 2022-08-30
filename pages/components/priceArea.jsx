import { useEffect, useState } from 'react';
import nftFi from "/src/nft-fi.json";
import { ethers } from "ethers";
import gyen from "/src/gyen.json";

export default function PriceArea(props) {
    const CONTRACT_ADDRESS_NFT_FI = "0xDAB07fe1fEa0117A320F4CA07b66cedd8F306D83";
    const CONTRACT_ADDRESS_GYEN = "";
    
    const [inputedText, setInputedText] = useState(0);
    // const countIndex = props.countIndex;
    // const currentAccount = props.currentAccount;
    //入札関数
  const makeBid = async(countIndex, price) => {
    //NFTを購入できるだけのGyenを保有しているかどうかを確認する
    //持っていなかったらalertを出したい
    //持っていたらapproveした旨を伝える
    const { ethereum } = window;
    console.log(ethers.BigNumber.from(String(price)));

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftFiPortalContract = new ethers.Contract(
          CONTRACT_ADDRESS_NFT_FI,
          nftFi.abi,
          signer
          );
        const gyenPortalContract = new ethers.Contract(
          CONTRACT_ADDRESS_GYEN,
          gyen.abi,
          signer
        );
        //データをスマートコントラクトから取得
        await nftFiPortalContract.makeBid(ethers.BigNumber.from(String(countIndex)), ethers.BigNumber.from(String(price)));
        //Gyenのaprrove boolが返る
          const gyenApproveFlag = await gyenPortalContract.approve(nftFiContract.address, ethers.BigNumber.from(String(price)));
         gyenApproveFlag ?? alert("GyenのApproveが完了");

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error){
      console.log(error);
    }

  }
    return (
        <>
        <div  className="text-black flex flex-col items-center justify-center w-[10%]">
            <textarea
                value={inputedText}
                onChange={(e) => setInputedText(e.target.value)}
                cols={4}
                rows={1}
            />
        </div>
        <div className='w-[10%] bg-gray-100 flex flex-col justify-center items-center'>
                      <button className='bg-orange-400 border-solid border-1 p-2 rounded-md hover:bg-gray-400 m-4 text-white shadow-md' onClick={() => { makeBid(countIndex, inputedText) }}>
                          Bid!
                      </button>
        </div>
        </>
    );


}