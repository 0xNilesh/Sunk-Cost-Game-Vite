import { setUri, login, logout } from "./userSlice";
import Connector from "@vite/connector";
import { ViteAPI ,accountBlock } from "@vite/vitejs";
import sunkCostGame from "../contract/sunkCostGame_abi.json";
import sunkCostGameContract from "../contract/sunkCostGame_contract.json";
const { HTTP_RPC } = require("@vite/vitejs-http");

let provider;
let contract;
let beneficiaryAddress;
let vc;

export const TryConnect = () => {
    provider = new ViteAPI(
        new HTTP_RPC(sunkCostGameContract.networkHTTP),
        () => {
            console.log("Vite provider connected");
        }
    );

  contract = {
    address: sunkCostGameContract.address,
    abi: sunkCostGame,
    provider: provider,
  };
  console.log(contract);
  beneficiaryAddress = window.location.pathname.substring(1);
  console.log("App created" , beneficiaryAddress);
}

export const Login = () => async (dispatch) => {
    vc = new Connector({ bridge: sunkCostGameContract.bridgeWS });
    await vc.createSession();
    const uri = vc.uri;
    dispatch(setUri(uri));
    vc.on("connect", (err: any, payload: any) => {
        // vcInstance can start prompting transactions on the user's Vite wallet app
        console.log("WalletConnector.connect", err, payload, vc.session);
        dispatch(login(vc.session.accounts[0]));
    });
    vc.on("disconnect", (err: any, payload: any) => {
        console.log("WalletConnector.disconnect", err, payload);
        // User's Vite wallet app is no longer connected
        Logout();
        vc.stopBizHeartBeat();
    });
};

export const Logout = () => async (dispatch) => {
    await vc.killSession();
    await vc.destroy();
    dispatch(logout());
  };


export const ContractOwner = async (user) => {
    const methodName = "owner";
    const methodAbi = contract.abi.find(
      (x: any) => x.name === methodName && x.type === "function"
    );
    if (!methodAbi) {
      throw new Error(`method not found: ${methodName}`);
    }

    const viteTokenId = "tti_5649544520544f4b454e6e40";
    const viteValue = 10n ** 18n * BigInt(10);

    const block = await accountBlock.createAccountBlock("callContract", {
      address: user.address,
      abi: methodAbi,
      toAddress: contract.address,
      params:[],
      // params: ['300000' , '200000' , '10' , '5' , '20000' , 'tti_5649544520544f4b454e6e40'],
      // tokenId: viteTokenId,
      // amount: viteValue.toString(),
    }).accountBlock;

    console.log("xxxxxxxxx", block);

    const result = await new Promise((resolve, reject) => {
      vc.on("disconnect", () => {
        reject({ code: 11020, message: "broken link" });
      });

      vc.sendCustomRequest({
          method: "vite_signAndSendTx",
          params: [{ block }],
        })
        .then((r) => {
          resolve(r);
        })
        .catch((e) => {
          reject(e);
        });

      // this.vc
      //   .sendCustomRequest({ method: "vite_signMessage", params: [{ "message": "aGVsbG8gd29ybGQ=" }] })
      //   .then((r: any) => {
      //     resolve(r);
      //   })
      //   .catch((e: any) => {
      //     reject(e);
      //   });
    });

    console.log(result);

    return;
  };
