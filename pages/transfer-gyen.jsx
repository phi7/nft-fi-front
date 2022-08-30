import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

// import styles from '../styles/Home.module.css'
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import nftFi from "/src/nft-fi.json";
import nftMint from "/src/nft-mint.json";
import Countdown from './components/timer';
import PriceArea from './components/priceArea';

export default function TransferGyen() {
  //デプロイされたコントラクトのアドレス
  const CONTRACT_ADDRESS_NFT_FI = "0xDAB07fe1fEa0117A320F4CA07b66cedd8F306D83";
  const CONTRACT_ADDRESS_NFT_MINT = "0x842BDfd7da2d603b176f0E41B58a6f2D785aFBcA";
  //ABI
  const contractABI = "hoge"
  //現在のアカウント
  const [currentAccount, setCurrentAccount] = useState("");
  // console.log("currentAccount: ", currentAccount);
  // すべての出品されているNFTの情報
  const [collateralizedNFTs, setCollateralizedNFTs] = useState([]);
  // const [inputedText, setInputedText] = useState(0);


  //walletにアクセスできるかの確認
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      // ユーザーのウォレットへのアクセスが許可されているかどうかを確認
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        // すべての出品中のNFTを表示する関数を呼ぶ
        // getAllExhibitedNFTs();
      } else {
        console.log("No authorized account found");
        // alert("You are not connected to your wallet!");
        return;
      }

      //networkの確認
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain " + chainId);
      // 0x4 は　Rinkeby の ID です。
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //walletに接続する関数
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      //metamaskがなければアラート
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      //アカウントをゲット
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      //ネットワークの確認
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain " + chainId);
      //0x4はRinkebyのID
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      }

      //イベントリスナー
      // setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  //すべての出品されたNFT情報を取得
  const getAllCollateralizedNFTs = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftFiPortalContract = new ethers.Contract(
          CONTRACT_ADDRESS_NFT_FI,
          nftFi.abi,
          signer
        );
        //データをスマートコントラクトから取得
        const collateralizedNFTsFromContract = await nftFiPortalContract.getCollateralizedNFTs();
        /* UIに必要なのは、アドレス、タイムスタンプ、メッセージだけなので、以下のように設定 */
        const collateralizedNFTsCleaned = [];
        for (const collateralizedNFTFromContract of collateralizedNFTsFromContract){
          const asset = await getNFTInfo(collateralizedNFTFromContract.tokenId, collateralizedNFTFromContract.nftContractAddress);
          // console.log("huga",typeof(new Date(collateralizedNFTFromContract.timestamp * 1000)));
          collateralizedNFTsCleaned.push(
            {
            countIndex: ethers.BigNumber.from(collateralizedNFTFromContract.countIndex).toNumber(),
            nftContractAddress: collateralizedNFTFromContract.nftContractAddress,
            tokenId: collateralizedNFTFromContract.tokenId,
            timestamp: new Date(collateralizedNFTFromContract.timestamp * 1000),
            name: asset.name,
            image_thumbnail_url: asset.image_thumbnail_url,
            price: ethers.BigNumber.from(collateralizedNFTFromContract.price).toNumber(),
          }
          );
        }
        // const collateralizedNFTsCleaned =  collateralizedNFTsFromContract.map(async(collateralizedNFTFromContract) => {
        //   const asset = await getNFTInfo(collateralizedNFTFromContract.tokenId, collateralizedNFTFromContract.nftContractAddress);
        //   console.log("アセット",asset.image_thumbnail_url);
        //   return {
        //     countIndex: collateralizedNFTFromContract.countIndex,
        //     nftContractAddress: collateralizedNFTFromContract.nftContractAddress,
        //     tokenId: collateralizedNFTFromContract.tokenId,
        //     timestamp: new Date(collateralizedNFTFromContract.timestamp * 1000),
        //     name: asset.name,
        //     image_thumbnail_url: asset.image_thumbnail_url,
        //   };
        // });
        console.log("担保に出されたNFT", collateralizedNFTsCleaned);

        /* React Stateにデータを格納する */
        // console.log("set前", collateralizedNFTs);
        setCollateralizedNFTs(collateralizedNFTsCleaned);
        // console.log("set後", collateralizedNFTs);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error){
      console.log(error);
    }
  };

  //openseaのAPIを叩いてNFTのデータを取得する関数
  const getNFTInfo = async (tokenId, nftContractAddress) => {
    const assetsJson = await(await fetch("https://testnets-api.opensea.io/api/v1/assets" + "?token_ids=" + tokenId + "&asset_contract_address=" + nftContractAddress)).json();
      // console.log("assetsjson",assetsJson)
    const assets = assetsJson["assets"];
    console.log("assets[0",assets[0]);
    return assets[0];
  }

  //残り時刻変換関数
  //カウントダウンするように何かimportする必要がある
  const lmitedTimeCaliculate = (exhibitedTime) => {

  }


  //読み込まれたときにwalletがつながっているかチェック
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  
  //読み込まれたときにすべての出品されたNFTを読み込む
  useEffect(() => {
    (async () => {
      await getAllCollateralizedNFTs();
    })();
  }, []);

  //ただいま出品中のアカウント一覧
  return (
    <>
      <Head>
        <title>GMO NFT-Fi</title>
      </Head>
      <div className='bg-gray-800 h-screen w-screen'>
        <header className='bg-black h-[10%] flex flex-row justify-center items-center'>
          <Link href="/collateralize">
            <a className="text-white absolute left-0 p-2 m-4">collateralize</a>
          </Link>
          <div className=" text-blue-700 font-bold">GMO NFT-Fi</div>
          {currentAccount === "" ? (
            <button
              className="absolute right-0 m-4 border-solid border-2 p-2 rounded-md bg-gray-200 border-emerald-500 hover:bg-gray-400 "
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          ) : (
            <div className="absolute right-0 m-4 border-solid border-2 p-2 rounded-md bg-gray-200 border-emerald-500 hover:bg-gray-400 ">
              Wallet Connected!!
            </div>
          )}
        </header>
        <div className='h-[100%] bg-white flex flex-col justify-center items-center'>
          <div className='bg-gray-100 w-[70%] flex flex-row'>
            <div className='flex flex-col w-[70%] justify-center items-center'>
              NFT
            </div>
            <div className='w-[10%] bg-green-300 flex flex-col justify-center items-center'>Now Price</div>
            <div className='w-[10%] bg-blue-300 flex flex-col justify-center items-center'>Time Limit</div>
            <div className='w-[20%] bg-gray-100 flex flex-row justify-center items-center'>
              希望価格
            </div>
          </div>
          <div className='h-2'></div>
          {/* ループ処理をいれる */}
          {/* デザインについては要調整　画像をうつすとか */}
          {currentAccount &&
          collateralizedNFTs
            .slice(0)
            .reverse()
            .map((collateralizedNFT, index) => {
              console.log("nyan",collateralizedNFT);
              const etherLink = "https://rinkeby.etherscan.io/address/" + collateralizedNFT.nftContractAddress;
              const openseaTestNetLink = "https://testnets.opensea.io/assets/rinkeby/" + collateralizedNFT.nftContractAddress + "/" + collateralizedNFT.tokenId;
              // console.log(typeof(collateralizedNFT.timestamp));
              const startingDate =  collateralizedNFT.timestamp.getDate();
              const startingHours = collateralizedNFT.timestamp.getHours();
              const startingMinutes = collateralizedNFT.timestamp.getMinutes();
              const startingSeconds = collateralizedNFT.timestamp.getSeconds();
              return (
                <>
                  <div key={index} className='bg-gray-100 w-[70%] flex flex-row'>
                      {/* openseaのAPIをたたく */}
                    <img className='w-[20%]'
                      src={ collateralizedNFT.image_thumbnail_url }
                      alt="new"
                    />
                    <div className='flex flex-row w-[50%] items-center justify-center'>
                      {/* <div className='OpenSeaのリンク'>NFTアドレス：</div> */}
                      <a className='text-blue-600' href={openseaTestNetLink} target="_blank" rel="noopener noreferrer">{ collateralizedNFT.name }</a>
                    </div>
                    <div className='w-[10%] bg-green-300 flex flex-col justify-center items-center'> { collateralizedNFT.price }</div>
                    {/* <div className='w-[10%] bg-blue-300 flex flex-col justify-center items-center'>残り時間を表示</div> */}
                    <Countdown startingDate={startingDate} startingHours={startingHours} startingMinutes={startingMinutes} startingSeconds={startingSeconds} ></Countdown>
                    {/* <div className="flex"> */}
                    <PriceArea countIndex = {collateralizedNFT.countIndex}></PriceArea>
                    {/* <div key={index} className="text-black flex flex-col items-center justify-center w-[10%]">
                      <textarea
                        key={index}
                        value={inputedText}
                        onChange={(e) => setInputedText(e.target.value)}
                        cols={4}
                        rows={1}
                      />
                    </div> */}
                  {/* </div> */}
                    {/* <div className='w-[10%] bg-gray-100 flex flex-col justify-center items-center'>
                      <button className='bg-orange-400 border-solid border-1 p-2 rounded-md hover:bg-gray-400 m-4 text-white shadow-md' onClick={() => { makeBid(collateralizedNFT.countIndex, inputedText) }}>
                          Bid!
                      </button>
                    </div> */}
                  </div>
                  <div className='h-2'></div>
                </>
              );
            })}
        </div>
      </div>
    </>
  )
}
