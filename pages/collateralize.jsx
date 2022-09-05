import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

// import styles from '../fstyles/Home.module.css'
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import nftFi from "/src/nft-fi.json";
import nftMint from "/src/nft-mint.json";


export default function Collateralize() {
  //デプロイされたコントラクトのアドレス
  const CONTRACT_ADDRESS_NFT_FI = "0x26B9CFbAAd4d1B98b29eA003393eE79F01854D91";
  const CONTRACT_ADDRESS_NFT_MINT = "0x842BDfd7da2d603b176f0E41B58a6f2D785aFBcA";
  //ABI
  // const contractABI = "hoge"
  //現在のアカウント
  const [currentAccount, setCurrentAccount] = useState("");
  // console.log("currentAccount: ", currentAccount);
  // 持っているNFT一覧
  const [owningNFTs, setOwningNFTs] = useState([]);

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

  //残り時刻変換関数
  //カウントダウンするように何かimportする必要がある
  // const lmitedTimeCaliculate = (exhibitedTime) => {

  //   }
    
  //持っているNFTを表示
  const getOwningNFTs = async() => {
      if (!window.ethereum) {
        console.error('!window.ethereum')
      return
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])

      const signer = await provider.getSigner()
      const message = 'message'
      const address = await signer.getAddress()
      const signature = await signer.signMessage(message)
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ message, address, signature }),
      })

    const body = await response.json()
    console.log("kaettekitamono",body)
      setOwningNFTs(body.assets)
  }

  //担保にいれる関数
  const collateralizeNFT = async(nftContractAddress,tokenId) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //providerを作成
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        //コントラクトに悪世するするためのオブジェクトを作成
        const nftFiContract = new ethers.Contract(
          CONTRACT_ADDRESS_NFT_FI,
          nftFi.abi,
          signer
        );
        const nftMintContract = new ethers.Contract(
          CONTRACT_ADDRESS_NFT_MINT,
          nftMint.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        //approveを呼ばせる
        let collateralizeApproveTxn = await nftMintContract.approve(nftFiContract.address, tokenId);
        await collateralizeApproveTxn.wait();
        console.log("approve finish!");
        //関数を呼ぶ
        let collateralizeTxn = await nftFiContract.collateralize(
          nftContractAddress,
          tokenId
        );
        console.log("Mining...please wait.");
        //トランザクションの終了を待つ
        await collateralizeTxn.wait();
        
        // nftMintContract.approve(nftFiContract.address, tokenId);
        // console.log("approveしたぞい");
        // nftMintContract["safeTransferFrom(address,address,uint256)"](currentAccount,nftMintContract.address,tokenId);
        // nftMintContract.transferFrom(currentAccount,nftMintContract.address,tokenId);

        console.log("コントラクトにロックしたぞい！")
        alert("コントラクトにロックしたぞい！");

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${collateralizeTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  //NFTをミントするボタン
  // const mintNFT = async () => {
  //   try {
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       //providerを作成
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       //コントラクトに悪世するするためのオブジェクトを作成
  //       const connectedContract = new ethers.Contract(
  //         CONTRACT_ADDRESS_NFT_MINT,
  //         myNFT.abi,
  //         signer
  //       );
  //       console.log("Going to pop wallet now to pay gas...");
  //       //関数を呼ぶ
  //       let nftTxn = await connectedContract.makeMyNFT(
  //         firstText,
  //         secondText,
  //         thirdText
  //       );
  //       console.log("Mining...please wait.");
  //       //トランザクションの終了を待つ
  //       await nftTxn.wait();

  //       console.log(
  //         `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
  //       );
  //     } else {
  //       console.log("Ethereum object doesn't exist!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //読み込まれたときにwalletがつながっているかチェック
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  //読み込まれたときにwalletがつながっているかチェック
  useEffect(() => {
    
  }, []);


  //ただいま出品中のアカウント一覧
  return (
    <>
      <Head>
        <title>NFT-Fi</title>
      </Head>
      <div className='bg-gray-800 h-screen w-screen'>
        <header className='bg-black h-[10%] flex flex-row justify-center items-center'>
        <Link href="/">
            <a className="text-white absolute left-0 p-2 m-4">invest</a>
          </Link>
          <div className='flex flex-row items-end space-x-2 '>
            <div className='text-white text-4xl'>Eve</div>
            <div className='text-blue-700 text-sm'>by</div>
            <div className=" text-blue-700 font-bold align-bottom"></div>
          </div>
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
        <div className='h-[150%] bg-white flex flex-col justify-center items-center'>
          <div className='bg-gray-400 m-4 p-2 boreder-2 border-solid rounded-md' onClick={getOwningNFTs}>☛　持っているAdamのNFTを表示する　</div>
          {/* <div className='bg-yellow-300 w-[70%] flex flex-row'>
            <div className='flex flex-col w-[40%]'>
              <div className=''></div>
              <div className=''></div>
            </div>
            <div className='w-[20%] bg-green-300 flex flex-col justify-center items-center'>Now Price</div>
            <div className='w-[20%] bg-blue-300 flex flex-col justify-center items-center'>Time Limit</div>
            <div className='w-[20%] bg-gray-100 flex flex-row justify-center items-center'>
              <div ></div>
            </div>
          </div> */}
          {/* ループ処理をいれる */}
          {/* デザインについては要調整　画像をうつすとか */}
          {currentAccount &&
          owningNFTs
            .slice(0)
            .reverse()
            .map((owningNFT, index) => {
              const openseaTestNetLink = "https://testnets.opensea.io/assets/rinkeby/" + owningNFT.asset_contract.address + "/" + owningNFT.token_id;
              return (
                <div key = {index} className='bg-gray-100 w-[70%] flex flex-col'>
                  <div  className='bg-gray-100  w-[100%] flex flex-row'>
                    <img className='w-[20%]'
                      src={owningNFT.image_thumbnail_url}
                      alt="new"
                      />
                    <div className='flex flex-row w-[60%] items-center justify-center'>
                      {/* <div className='OpenSeaのリンク'>NFTアドレス：</div> */}
                      <a className='text-blue-600' href={openseaTestNetLink} target="_blank" rel="noopener noreferrer">{ owningNFT.name }</a>
                    </div>
                    {/* <div className='w-[20%] bg-green-300 flex flex-col justify-center items-center'>現在の価格を表示</div>
                    <div className='w-[20%] bg-blue-300 flex flex-col justify-center items-center'>残り時間を表示</div> */}
                    <div className='w-[20%] bg-gray-100 flex flex-col justify-center items-center'>
                      <button  className='bg-orange-400 border-solid border-1 p-2 rounded-md hover:bg-gray-400 m-4 text-white shadow-md' onClick={()=>{collateralizeNFT(owningNFT.asset_contract.address, owningNFT.token_id)} } >
                      Collateralize!</button>
                    </div>
                  </div>
                  <div className='h-4 bg-white'></div>
                </div>
                  
                  
              );
            })}
        </div>
      </div>
    </>
  )
}
