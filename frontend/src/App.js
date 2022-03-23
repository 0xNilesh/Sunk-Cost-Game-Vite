import React from 'react';
import {Routes,Route,Navigate} from 'react-router-dom';
import Home from './pages/home';
import Profile from './pages/profile';
import Pots from './pages/pots';
import EachPot from './pages/eachPot';
import Header from './components/Header';

const App = () => {
  return(
    <div>
      <Header/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/pots' element={<Pots/>}/>
            <Route path='/pots/:num' element={<EachPot/>}/>
            <Route path="*" element={<Navigate replace to="/"/>} />
        </Routes>
    </div>
  )
}
export default App;

