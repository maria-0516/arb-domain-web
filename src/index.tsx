import React from 'react';
// import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import { Web3ReactProvider } from "@web3-react/core";
import {configureStore} from '@reduxjs/toolkit';
import { ethers} from "ethers";
import './index.scss';
import './custom.scss';
import App from './App';

import {slice} from './useStore'

const store = configureStore({reducer: slice.reducer});

const getLibrary = (provider) => {
	const library = new ethers.providers.Web3Provider(provider);
	library.pollingInterval = 8000; // frequency provider is polling
	return library;
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<Provider store={store}>
		<Web3ReactProvider getLibrary={getLibrary}>
			<App />
		</Web3ReactProvider>
	</Provider>
)