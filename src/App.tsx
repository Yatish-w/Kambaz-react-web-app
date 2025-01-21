
//import logo from './logo.svg';
//import './App.css';
import Labs from './Labs';

import LandingPage from './LandingPage';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="LandingPage"/>}/>
          <Route path='/Labs/*' element={<Labs/>} />
          
          <Route path='/LandingPage' element={<LandingPage/>} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;