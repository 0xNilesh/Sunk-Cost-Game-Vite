import { setUri, login, logout } from "./userSlice";
import Connector from "@vite/connector";
import { ViteAPI } from "@vite/vitejs";
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
    beneficiaryAddress = window.location.pathname.substring(1);
    console.log("App created", beneficiaryAddress);
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
