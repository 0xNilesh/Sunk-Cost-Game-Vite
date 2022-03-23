import React , {useEffect , useState} from 'react';
import {Routes,Route,Navigate} from 'react-router-dom';
import Home from './pages/home';
import Profile from './pages/profile';
import Pots from './pages/pots';
import EachPot from './pages/eachPot';
import Header from './components/Header';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { light, dark } from './config/themization';
import QRCode from "qrcode.react";

import Connector from "@vite/connector";
import { ViteAPI} from "@vite/vitejs";
import sunkCostGame from "./contract/sunkCostGame_abi.json";
import sunkCostGameContract from "./contract/sunkCostGame_contract.json";
const { HTTP_RPC } = require("@vite/vitejs-http");

const useDarkMode = () => {
	const [theme, setTheme] = useState(dark);

    const toggleTheme = () => {
      const updatedTheme = (theme === dark) ? light : dark;
		  setTheme(updatedTheme);
	};
	return [theme, toggleTheme];
};


let provider;
let contract;
let beneficiaryAddress;
let vc;
// const user = {};

const TryConnect = ()=>{
  provider = new ViteAPI(
    new HTTP_RPC(sunkCostGameContract.networkHTTP),
    () => {
      console.log("vite provider connected");
    }
  );

  contract = {
    address: sunkCostGameContract.address,
    abi: sunkCostGame,
    provider: provider,
  };
  beneficiaryAddress = window.location.pathname.substring(1);
  console.log("app created");
}



 

const logout = async () => {
  await vc.killSession();
  await vc.destroy();
};

const App = () => {

  useEffect(async() => {
    TryConnect();
    await login();
  },[]);

  const [user , setUser] = useState({});
  const login = async () => {
    vc = new Connector({ bridge: sunkCostGameContract.bridgeWS });
    await vc.createSession();
    const uri = vc.uri;
  
    console.log("uri", uri);
  
    setUser({uri : uri});
    // user.uri = uri;
    // console.log(user);
    // this.setState({ user: this.user });
  
    vc.on("connect", (err: any, payload: any) => {
      // vcInstance can start prompting transactions on the user's Vite wallet app
      console.log("WalletConnector.connect", err, payload, vc.session);
  
      // user.login(vc.session);
      // console.log(user);
      // this.setState({ user: this.user });
      
    });
    vc.on("disconnect", (err: any, payload: any) => {
      console.log("WalletConnector.disconnect", err, payload);
      // User's Vite wallet app is no longer connected
      // this.user.logout();
      // this.setState({ user: this.user });
  
      vc.stopBizHeartBeat();
    });
  };

  const [theme, toggleTheme] = useDarkMode();
	const themeConfig = createTheme(theme);

  return(
    <ThemeProvider theme={themeConfig}>
      <Header toggleTheme={toggleTheme} />
      <h1> {user.uri && <QRCode value={user.uri} />}</h1>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/pots' element={<Pots/>}/>
            <Route path='/pots/:num' element={<EachPot/>}/>
            <Route path="*" element={<Navigate replace to="/"/>} />
        </Routes>
    </ThemeProvider>
  )
}

export default App;
