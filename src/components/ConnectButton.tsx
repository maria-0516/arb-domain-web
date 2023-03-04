import React from "react";
import useStore from "../useStore";


import useWallet from "../useWallet";

import './connectbutton.scss';



const ConnectButton = ({theme} : {theme?: 'dark' }) => {
	
	const {connectedWallet, updateSession} = useStore()
	const wallet = useWallet();

	const disconnect = () => {
		wallet.disconnect();
		updateSession({connectedWallet: {...connectedWallet, connected: false}})
	}
	return (
		<div className={"connectbutton " + theme}>
			
			{
				connectedWallet.connected ? (
					<div className='d-column center middle' style={{gap: 5}}>
						<div className='d-row middle' style={{gap: 5}}>
							<div className='con-circle'></div>
							<div style={{color: '#8CD91D'}}>CONNECTED</div>
						</div>
						<p className='text-white' style={{margin: 0}}>Mainnet: <b>{!!connectedWallet.domain ? connectedWallet.domain : `${connectedWallet.address.slice(0, 6)}...${connectedWallet.address.slice(-4)}`}</b></p>
						<button className={'con-btn disconnect'} onClick={disconnect}>DISCONNECT</button>
					</div>
				) : (
					<div className='d-column center middle' style={{gap: 5}}>
						<button className='con-btn connect' onClick={() => updateSession({connectedWallet: {...connectedWallet, showDialog: true}})}>CONNECT</button>
					</div>
				)
			}
		</div>
	)
}

export default ConnectButton;