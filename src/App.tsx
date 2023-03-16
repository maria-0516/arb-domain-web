import React from 'react';

import { Route, BrowserRouter , Routes } from 'react-router-dom';
// import { Web3ReactProvider } from '@web3-react/core'
// import { Web3Provider } from '@ethersproject/providers'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './Pages/Home'
import AppPage from './Pages/AppPage'
import Faq from './Pages/Faq'
import Favorites from './Pages/Favorites';
import LayoutPage from './Pages/LayoutPage' 
import Domain from './Pages/Domain'
// import Address from './Pages/Address'
import NoPage from './Pages/404' 
import About from './Pages/About'
import Governance from './Pages/Governance'
import Community from './Pages/Community'
import Team from './Pages/Team'
import Jobs from './Pages/Jobs'
import Docs from './Pages/Docs'
// import useWallet, { ConnectorType } from './useWallet';
import useStore from './useStore';
import ConnectDialog from './components/ConnectDialog';
import { IconViewer } from './components/Icon';

// import useWallet from './useWallet'
// import { tips } from './useStore'


function App() {
	const {connectedWallet, updateSession} = useStore();
	
	return (
		<BrowserRouter>
			<Routes>
				{/* <Route path='/' element={<Home />} /> */}
				<Route path='/icons' element={<IconViewer />} />
				<Route path='/' element={<AppPage />} />
				<Route path='/governance' element={<Governance />} />
				<Route path='/community' element={<Community />} />
				<Route path='/team' element={<Team />} />
				<Route path='/jobs' element={<Jobs />} />
				<Route path='/docs' element={<Docs />} />
				<Route path="" element={<LayoutPage />}>
					<Route path="faq" element={<Faq />} />
					<Route path="about" element={<About />} />
					<Route path="favorites" element={<Favorites />} />
					<Route path="name/:param" element={<Domain />} />
					<Route path="name/:param/:action" element={<Domain />} />
					<Route path="address/:param" element={<Domain />} />
					<Route path="address/:param/:action" element={<Domain />} />
				</Route>
				<Route path="/*" element={<NoPage />} />
			</Routes>
			<ToastContainer />
			<ConnectDialog show={connectedWallet.showDialog} onClose={()=>updateSession({connectedWallet: {...connectedWallet, showDialog: false}})} />
		</BrowserRouter>
	);
}

export default App;
