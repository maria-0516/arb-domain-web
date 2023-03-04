/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'



import './connectdialog.scss'
import useWallet, {walletIcons} from '../useWallet';
import useStore, {config} from '../useStore';
import { getPrimaryDomain } from '../lib/ENSLib';
// import { resourceUsage } from "process";
// import { ResultType } from "@remix-run/router/dist/utils";
// import { config, tips } from "../useStore";

interface DlgProps {
	show: boolean
	onClose: Function
}

const ConnectDialog = ({show, onClose}: DlgProps) => {
	const {connectedWallet, updateSession} = useStore();
	const wallet = useWallet();

	const onConnect = (name: string) => {
		setTimeout(async ()=>{
			const _connect = await wallet.connect(name);
			if (!_connect) {
				const _switched = await wallet.switchNetwork(config.chainId)
				if (_switched===false) {
					const _added = await wallet.addNetwork(config.chainId, config.chainName, config.tokenName, config.symbol, 18, config.rpc[0], config.scanUrl, config.iconUrl)
					if (_added) await wallet.connect(name);
				} else {
					await wallet.connect(name);
				}
			}
		}, 200)
	}
	


	const disconnect = () => {
		wallet.disconnect();
		updateSession({connectedWallet: {address: '', domain: '', name: '', showDialog: false, connected: false}})
	}

	React.useEffect(()=>{
		const { ethereum } = window as any

		const handleConnect = () => {
			console.log("Handling 'connect' event")
			// activate(injected)
		}
		const handleChainChanged = (chainId: string | number) => {
			const newChainId = Number(chainId)
			console.log("Handling 'chainChanged' event with payload", chainId)
			// activate(injected)
			if (newChainId!==config.chainId) disconnect();
			// if (connectedWallet.name) {
			// 	onConnect(connectedWallet.name)
			// }
		}
		const handleAccountsChanged = (accounts: string[]) => {
			console.log("Handling 'accountsChanged' event with payload", accounts)
			// if (accounts.length > 0) {
			// 	update({connectedWallet: {...connectedWallet, address: accounts[0]}})
			// 	if (connectedWallet.name) wallet.connect(connectedWallet.name)
			// }
		}
		const handleNetworkChanged = (chainId: string | number) => {
			const newChainId = Number(chainId)
			console.log("Handling 'networkChanged' event with payload", newChainId)
			if (newChainId!==config.chainId) disconnect();
			// if (connectedWallet.name) onConnect(connectedWallet.name) // wallet.connect(connectedWallet.name)
		}
		if (ethereum && ethereum.on) {
			ethereum.on('connect', handleConnect)
			ethereum.on('chainChanged', handleChainChanged)
			ethereum.on('accountsChanged', handleAccountsChanged)
			ethereum.on('networkChanged', handleNetworkChanged)
		}
		console.log('app initial walelt active', wallet.active, new Date())
		if (wallet.active) {
			const address = wallet.account || ''
			getPrimaryDomain(address).then(label=>{
				updateSession({connectedWallet: {...connectedWallet, address, domain: !!label ? `${label}.${config.rootDomain}` : '', name: wallet.name, connected: wallet.active}})
			})
		} else if (connectedWallet.connected && connectedWallet.name) {
			wallet.connect(connectedWallet.name)
		}
		return () => {
			if (ethereum && ethereum.removeListener) {
				ethereum.removeListener('connect', handleConnect)
				ethereum.removeListener('chainChanged', handleChainChanged)
				ethereum.removeListener('accountsChanged', handleAccountsChanged)
				ethereum.removeListener('networkChanged', handleNetworkChanged)
			}
		}
	}, [wallet.active, wallet.account])

	React.useEffect(()=>{
		if (wallet.error) console.log('wallet error', wallet.error)
	}, [wallet.error])

	return (
		<>
			<div className={`connect-dlg ${show ? '' : 'hidden'}`} onClick={() => onClose()}>
				<ul>
					<li className="title">Connect your wallet</li>
					<li onClick={()=>onConnect('Injected')}>
						<div className="img-region">
							<img src={walletIcons.fox} alt="fox" style={{width: '64px', height: 'auto'}} />
						</div>
						<div className="text-region">
							<p className="big">MetaMask Wallet</p>
							<p className="detail">Connect to your MetaMask account</p>
						</div>
					</li>
					<li onClick={()=>onConnect('WalletConnect')}>
						<div className="img-region">
							<img src={walletIcons.wallet} alt="wallet" />
						</div>
						<div className="text-region">
							<p className="big">WalletConnect</p>
							<p className="detail">Connect to your MetaMask account</p>
						</div>
					</li>
					<li onClick={()=>onConnect('Portis')}>
						<div className="img-region">
							<img src={walletIcons.portis} alt="portis" />
						</div>
						<div className="text-region">
							<p className="big">Portis</p>
							<p className="detail">Connect with your Portis account</p>
						</div>
					</li>
					<li onClick={()=>onConnect('Torus')}>
						<div className="img-region">
							<img src={walletIcons.torus} alt="torus" />
						</div>
						<div className="text-region">
							<p className="big">Torus</p>
							<p className="detail">Connect with your Torus account</p>
						</div>
					</li>
					<li onClick={()=>onConnect('Mew')}>
						<div className="img-region">
							<img src={walletIcons.mew} alt="mew" />
						</div>
						<div className="text-region">
							<p className="big">MEW wallet</p>
							<p className="detail">Scan with MEW wallet to connect</p>
						</div>
					</li>
					<li onClick={()=>onConnect('WalletLink')}>
						<div className="img-region">
							<img src={walletIcons.coinbase} alt="coinbase" />
						</div>
						<div className="text-region">
							<p className="big">Coinbase Wallet</p>
							<p className="detail">Scan with Coinbase Wallet to connect</p>
						</div>
					</li>
				</ul>
			</div>
		</>
		
	)
}

export default ConnectDialog