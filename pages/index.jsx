import Head from 'next/head'
import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import { ethers } from "ethers";
import { useEffect, useState } from 'react';

export default function Home() {
  //デプロイされたコントラクトのアドレス
  const contractAddress = ""
  //ABI
  const contractABI = "hoge"
  //現在のアカウント
  const [currentAccount, setCurrentAccount] = useState("");
  // console.log("currentAccount: ", currentAccount);
  // すべての出品されているNFTの情報
  const [collateralizedNFTs, setCollateralizedNFTs] = useState([]);

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
  const getCollateralizedNFTs = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftFiPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        /* コントラクトからgetAllExhibitedNFTsメソッドを呼び出す */
        const collateralizedNFTs = await nftFiPortalContract.getCollateralizedNFTs();
        /* UIに必要なのは、アドレス、タイムスタンプ、メッセージだけなので、以下のように設定 */
        const collateralizedNFTsCleaned = collateralizedNFTs.map((collateralizedNFT) => {
          return {
            nftContractAddress: collateralizedNFT.nftContractAddress,
            tokenId: collateralizedNFT.tokenId,
            timestamp: new Date(collateralizedNFT.timestamp * 1000),
          };
        });

        /* React Stateにデータを格納する */
        setCollateralizedNFTs(collateralizedNFTsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //残り時刻変換関数
  //カウントダウンするように何かimportする必要がある
  const lmitedTimeCaliculate = (exhibitedTime) => {

  }

  //購入関数
  const buyNFT = () => {
    //NFTを購入できるだけのGyenを保有しているかどうかを確認する
    //持っていなかったらalertを出したい
    //持っていたらプールした旨を伝える
  }

  //読み込まれたときにwalletがつながっているかチェック
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  
  //読み込まれたときにすべての出品されたNFTを読み込む
  useEffect(() => {
    getCollateralizedNFTs();
  }, []);

  //ただいま出品中のアカウント一覧
  return (
    <>
      <Head>
        <title>GMO NFT-Fi</title>
      </Head>
      <div className='bg-gray-800 h-screen w-screen'>
        <header className='bg-black h-[10%] flex flex-row justify-center items-center'>
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
        <div className='h-[95%] bg-white flex flex-col justify-center items-center'>
          <div className='bg-yellow-300 w-[70%] flex flex-row'>
            <div className='flex flex-col w-[40%]'>
              <div className=''></div>
              <div className=''></div>
            </div>
            <div className='w-[20%] bg-green-300 flex flex-col justify-center items-center'>Now Price</div>
            <div className='w-[20%] bg-blue-300 flex flex-col justify-center items-center'>Time Limit</div>
            <div className='w-[20%] bg-gray-100 flex flex-row justify-center items-center'>
              <div ></div>
            </div>
          </div>
          {/* ループ処理をいれる */}
          {/* デザインについては要調整　画像をうつすとか */}
          {currentAccount &&
          collateralizedNFTs
            .slice(0)
            .reverse()
            .map((collateralizedNFT, index) => {
              const etherLink = "https://rinkeby.etherscan.io/address/" + collateralizedNFT.nftContractAddress;
              const openseaTestNetLink = "https://testnets.opensea.io/assets/rinkeby/" + collateralizedNFT.nftContractAddress + "/" + collateralizedNFT.tokenId;
              return (
                <>
                  <div key={index} className='bg-gray-100 w-[70%] flex flex-row'>
                    {/* openseaのAPIをたたく */}
                  {/* <img className='w-[20%]'
                    src={owningNFT.image_thumbnail_url}
                    alt="new"
                    /> */}
                  <div className='flex flex-row w-[60%] items-center justify-center'>
                    {/* <div className='OpenSeaのリンク'>NFTアドレス：</div> */}
                    <a className='text-blue-600' href={openseaTestNetLink} target="_blank">{ collateralizedNFT.name }</a>
                  </div>
                  {/* <div className='w-[20%] bg-green-300 flex flex-col justify-center items-center'>現在の価格を表示</div>
                  <div className='w-[20%] bg-blue-300 flex flex-col justify-center items-center'>残り時間を表示</div> */}
                  <div className='w-[20%] bg-gray-100 flex flex-col justify-center items-center'>
                    <button className='bg-orange-400 border-solid border-1 p-2 rounded-md hover:bg-gray-400 m-4 text-white shadow-md' onClick={buyNFT}>
                    Buy!</button>
                  </div>
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
