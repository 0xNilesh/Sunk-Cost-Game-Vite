import { setUri, login, logout } from "../slice/userSlice";
import Connector from "@vite/connector";
import { ViteAPI, accountBlock , abi , utils } from "@vite/vitejs";
import {HTTP_RPC , WS_RPC } from "@vite/vitejs-http";
import sunkCostGame from "../../contract/sunkCostGame_abi.json";
import sunkCostGameContract from "../../contract/sunkCostGame_contract.json";
import * as Utils from './utils';
import Provider from '@vite/vitejs-ws';

let provider;
let contract;
let vc;
const providerTimeout = 60000;
const providerOptions = { retryTimes: 10, retryInterval: 5000 };

export const TryConnect = () => {
    const WS_RPC = new Provider(sunkCostGameContract.networkWS, providerTimeout, providerOptions);
    provider = new ViteAPI(WS_RPC, () => {
    console.log('client connected');
    });
    // provider = new ViteAPI(
    //     new HTTP_RPC(sunkCostGameContract.networkHTTP),
    //     () => {
    //         console.log("Vite provider connected");
    //     }
    // );

    contract = {
        address: sunkCostGameContract.address,
        abi: sunkCostGame,
        provider: provider
    };
};

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

export const CreatePot = async (user , amount) => {
    const methodName = "createPot";
    const methodAbi = contract.abi.find(
        (x: any) => x.name === methodName && x.type === "function"
    );
    if (!methodAbi) {
        console.log("Medthod Not Found");
        return;
    }

    const viteTokenId = "tti_5649544520544f4b454e6e40";
    const viteValue = 10n ** 18n * BigInt(amount);

    const block = await accountBlock.createAccountBlock("callContract", {
        address: user.address,
        abi: methodAbi,
        toAddress: contract.address,
        params: ['300000' , '200000' , '10' , '5' , '20000' , 'tti_5649544520544f4b454e6e40'],
        tokenId: viteTokenId,
        amount: viteValue.toString(),
    }).accountBlock;

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
    });

    console.log(result);
};

export const getOwner = async () => {
    callOffChain("owner")
}

export const callOffChain = (methodName: string, params?: any[]) => {
    const fnSig = abi.encodeFunctionCall(contract.abi, params, methodName);
    const ebase64 = utils._Buffer.from(fnSig, 'hex').toString('base64');
    const code = utils._Buffer.from(contract.offChain, 'hex').toString('base64');

    return provider
        .request('contract_callOffChainMethod', {
            address: contract.address,
            code,
            data: ebase64,
        })
        .then((res: string) => {
            const hexbuf = utils._Buffer.from(res, 'base64').toString('hex');
            const { outputs = [] } = contract.abi.find((x) => x.name === methodName) || {};
            return abi.decodeParameters(outputs, hexbuf);
        });
};

export const ContractInfo = async () => {
    provider.request("contract_getContractInfo", contract.address).then((result) => {
        console.log(result)
    }).catch((err) => {
        console.warn(err);
    });
}

export const ContractQuery = async (methodName: string, params:any[]) => {
   
    const methodAbi = contract.abi.find((x: { name: string; }) => {
      return x.name === methodName;
    });
    if (!methodAbi) {
      throw new Error("method not found:" + methodName);
    }

    let data = abi.encodeFunctionCall(methodAbi, params);
    let dataBase64 = Buffer.from(data, 'hex').toString('base64');

    while(true) {
      let result = await provider.request("contract_query", {
          address: contract.address,
          data: dataBase64
        });
        
      // parse result
      if (result) {
        let resultBytes = Buffer.from(result, 'base64').toString('hex');
        let outputs = [];
        for (let i = 0; i < methodAbi.outputs.length; i++) {
            outputs.push(methodAbi.outputs[i].type);
        }
        console.log(abi.decodeParameters(
            outputs,
            resultBytes
        ));
        return abi.decodeParameters(
            outputs,
            resultBytes
        );
      }
      console.log('Query failed, try again.');
      await Utils.sleep(500);
    }    

  }
