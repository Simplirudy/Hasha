import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// React Redux
import { Provider } from 'react-redux';
import store from './state/store';

// React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';

import { Helmet, HelmetProvider } from 'react-helmet-async';

// Pages
import Home from './pages/Home';
import Signup from './pages/Signup';
import Play from './pages/Play';
import Players from './pages/Players';
import Connect from './pages/Connect';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <HelmetProvider>
          <ChakraProvider>
            <Routes>
              <Route path="/" element={<App />}>
                <Route path="home" element={<Home />} />
                <Route path="signup" element={<Signup />} />
                <Route path="play" element={<Play />} />
                <Route path="players" element={<Players />} />
                <Route path="connect" element={<Connect />} />
              </Route>
            </Routes>
          </ChakraProvider>
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
