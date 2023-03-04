import React from 'react'
import { /* Web3ReactProvider,  */useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
	NoEthereumProviderError,
	UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector'
import { Web3Provider } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'

import icFox from './images/fox.svg';
import icWallet from './images/wallet.svg';
import icPortis from './images/portis.svg';
import icTorus from './images/torus.svg';
import icMew from './images/mew.png';
import icCoinbase from './images/coinbase.svg';



import { config, tips } from '../useStore'

import connectors from './connectors'

const connectorsByName = {} as { [name: string]:  any}

export const walletIcons = {
	fox: icFox,
	wallet: icWallet,
	portis: icPortis,
	torus: icTorus,
	mew: icMew,
	coinbase: icCoinbase,
}

export type ConnectorType = 'Injected'|'WalletConnect'|'WalletLink'|'Portis'|'Torus'|'Mew'
// enum ConnectorNames {
// 	Injected = 'Injected',
// 	WalletConnect = 'WalletConnect',
// 	WalletLink = 'WalletLink',
// 	Ledger = 'Ledger',
// 	Frame = 'Frame',
// 	// Fortmatic = 'Fortmatic',
// 	Portis = 'Portis',
// 	Torus = 'Torus'
// }



function getErrorMessage(error: Error) {
	if (error instanceof NoEthereumProviderError) {
		return `No ${config.chainName} browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.`
	} else if (error instanceof UnsupportedChainIdError) {
		return "You're connected to an unsupported network."
	} else if (
		error instanceof UserRejectedRequestErrorInjected ||
		error instanceof UserRejectedRequestErrorWalletConnect ||
		error instanceof UserRejectedRequestErrorFrame
	) {
		return `Please authorize this website to access your ${config.chainName} account.`
	} else {
		console.error(error)
		return 'An unknown error occurred. Check the console for more details.'
	}
}

const useWallet = () => {
	const context = useWeb3React<Web3Provider>()
	const { connector, library, chainId, account, activate, deactivate, active, error } = context
	// 
	const [blockNumber, setBlockNumber] = React.useState(0);
	const [errorText, setErrorText] = React.useState('');
	const [name, setName] = React.useState('');
	

	const getBalance = async () => {
		try {
			if (!!library && !!account) {
				const balance = await library.getBalance(account);
				return formatEther(balance)
			}
		} catch (error) {
			console.log(error);
		}
		return null
	}

	const updateBlockNumber = (blockNumber: number) => setBlockNumber(blockNumber)

	React.useEffect(()=>{
		let stale = false
		if (!!library) {
			library.getBlockNumber().then((blockNumber: number) => {
				if (!stale) {
					setBlockNumber(blockNumber)
				}
			}).catch(() => {
				if (!stale) {
					setBlockNumber(0)
				}
			});
			library.on('block', updateBlockNumber)
		}
		return () => {
			if (!!library) {
				stale = true;
				library.removeListener('block', updateBlockNumber);
				setBlockNumber(0);
			}
		}
	}, [library, chainId])

	const [activatingConnector, setActivatingConnector] = React.useState<any>()
	React.useEffect(() => {
		if (activatingConnector && activatingConnector === connector) {
			setActivatingConnector(undefined)
		}
	}, [activatingConnector, connector])
	
	React.useEffect(() => {
		if (error) {
			const message = getErrorMessage(error)
			setErrorText(message)
		} else {
			setErrorText('')
		}
	}, [error])
	// const triedEager = useEagerConnect()
	// // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
	// useInactiveListener(!triedEager || !!activatingConnector)

	const connect = (name: string):Promise<boolean> => {
		return new Promise(async resolve=>{
			setName(name);
			let currentConnector = connectorsByName[name];
			if (!currentConnector) {
				currentConnector = await connectors[name]()
				connectorsByName[name] = currentConnector;
			}
			
			// const activating = currentConnector === activatingConnector
			// const connected = currentConnector === connector
			// const disabled = !triedEager || !!activatingConnector || connected || !!error
	
			setActivatingConnector(currentConnector)
			console.log('Trying to connect wallet ', new Date())
			activate(currentConnector, (error) => {
				if (error) {
					tips(getErrorMessage(error))
					
					setActivatingConnector(undefined)
					// setTimeout(()=>{
					// 	setErrorText(getErrorMessage(error))
					// }, 100)
				}
				resolve(false)
				console.log('Failed wallet connection ', new Date())
			}).then(()=>{
				resolve(true)
				console.log('Success wallet connection ', new Date())
			})
		})
	}
	const disconnect = () => {
		if (active) {
			deactivate();
			// (connector as any).close();
		}
	}
	const switchNetwork = async (chainId: number): Promise<boolean> => {
		const { ethereum } = window
		if (ethereum) {
			try {
				await ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x' + chainId.toString(16)}],
				});
				return true;
			} catch (error) {
				console.log(error)
			}
		}
		return false;
	}
	const addNetwork = async (chainId: number, chainName: string, name: string, symbol: string, decimals: number, rpcUrl: string, scanUrl: string, iconUrl: string): Promise<boolean> => {
		const { ethereum } = window
		if (ethereum) {
			try {
				await ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [{
						chainId: '0x' + chainId.toString(16),
						chainName,
						nativeCurrency: {
							name,
							symbol,
							decimals
						},
						rpcUrls: [rpcUrl],
						blockExplorerUrls: [scanUrl],
						iconUrls: [iconUrl]
					}]
				});
				return true;
			} catch (error) {
				console.log(error)
			}
		}
		return false;
	}

	const addToken = async (type: 'ERC20', address: string, symbol: string, decimals: number, iconUrl: string): Promise<boolean> => {
		const { ethereum } = window
		if (ethereum) {
			try {
				const wasAdded = await ethereum.request({
					method: 'wallet_watchAsset',
					params: {
						type,
						options: {
							address,
							symbol,
							decimals,
							image: iconUrl
						},
					},
				});
				if (wasAdded) {
					console.log(`token ${symbol} added!`);
				} else {
					console.log(`token ${symbol} failed!`);
				}
				return wasAdded;
			} catch (error) {
				console.log(error);
			}
		}
		return false;
	}
	// console.log("wallet - ", name || '(none)', active ? 'active' : 'deactive', errorText)
	return {
		name,
		active,
		account, 
		library, 
		chainId, 
		blockNumber, 
		error: errorText,
		switchNetwork,
		addNetwork,
		addToken,
		getBalance,
		connect,
		disconnect,
	};
}

export default useWallet;
