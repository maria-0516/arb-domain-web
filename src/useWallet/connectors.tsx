import { useState, useEffect } from 'react'

import { useWeb3React } from '@web3-react/core'

// import { AuthereumConnector } from '@web3-react/authereum-connector'
// import { FortmaticConnector } from '@web3-react/fortmatic-connector'
// import { FrameConnector } from '@web3-react/frame-connector'
// import { InjectedConnector } from '@web3-react/injected-connector'
// import { LatticeConnector } from '@web3-react/lattice-connector'
// import { LedgerConnector } from '@web3-react/ledger-connector'
// import { MagicConnector } from '@web3-react/magic-connector'
// import { NetworkConnector } from '@web3-react/network-connector'
// import { PortisConnector } from '@web3-react/portis-connector'
// import { TorusConnector } from '@web3-react/torus-connector'
// import { TrezorConnector } from '@web3-react/trezor-connector'
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
// import { WalletLinkConnector } from '@web3-react/walletlink-connector'
// import {MewConnectConnector} from './mewconnect-connector';

import config from '../config/current.json'

// const POLLING_INTERVAL = 12000
// const RPC_URLS: { [chainId: number]: string } = {[config.chainId]: config.rpc};

export const injected = async () => {
	try {
		const mod = await import('@web3-react/injected-connector')
		return new mod.InjectedConnector({ supportedChainIds: [config.chainId] })	
	} catch (error) {
		console.log("import @web3-react/injected-connector", error)
	}
	return null;
	// import(modulePath)
	// .then(obj => <module object>)
	// .catch(err => <loading error, e.g. if no such module>)

	
}

// export const network = new NetworkConnector({
//   urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
//   defaultChainId: 1
// })

export const walletconnect = async () => {
	try {
		const mod = await import('@web3-react/walletconnect-connector')
		return new mod.WalletConnectConnector({
			rpc: {[config.chainId]: config.rpc[0]},
			chainId: 1,
			bridge: 'https://bridge.walletconnect.org',
			qrcode: true
		})
	} catch (error) {
		console.log("import @web3-react/walletconnect-connector", error)
	}
	return null;
}

export const walletlink = async () => {
	try {
		const mod = await import('@web3-react/walletlink-connector')
		return new mod.WalletLinkConnector({
			url: config.rpc[0],
			appName: config.appTitle,
			supportedChainIds: [config.chainId]
		})
	} catch (error) {
		console.log("import @web3-react/walletlink-connector", error)
	}
	return null;
}

// export const walletlink = new WalletLinkConnector({
// 	url: config.rpc,
// 	appName: config.appTitle,
// 	supportedChainIds: [config.chainId]
// })

// export const ledger = new LedgerConnector({ chainId: config.chainId, url: config.rpc, pollingInterval: POLLING_INTERVAL })

// export const trezor = new TrezorConnector({
//   chainId: 1,
//   url: RPC_URLS[1],
//   pollingInterval: POLLING_INTERVAL,
//   manifestEmail: 'dummy@abc.xyz',
//   manifestAppUrl: 'http://localhost:1234'
// })

// export const lattice = new LatticeConnector({
//   chainId: 4,
//   appName: 'web3-react',
//   url: RPC_URLS[4]
// })

// export const frame = new FrameConnector({ supportedChainIds: [config.chainId] })

// export const authereum = new AuthereumConnector({ chainId: 42 })

// export const fortmatic = new FortmaticConnector({ apiKey: config.web3.fortmaticApiKey, chainId: config.chainId })

// export const magic = new MagicConnector({
//   apiKey: process.env.MAGIC_API_KEY as string,
//   chainId: 4,
//   email: 'hello@example.org'
// })

export const portis = async () => {
	try {
		const mod = await import('@web3-react/portis-connector')
		return new mod.PortisConnector({ dAppId: config.web3.portisDappId, networks: [config.chainId] })
	} catch (error) {
		console.log("import @web3-react/portis-connector", error)
	}
	return null;
}
// export const portis = new PortisConnector({ dAppId: config.web3.portisDappId, networks: [config.chainId] })

export const torus = async () => {
	try {
		const mod = await import('@web3-react/torus-connector')
		return new mod.TorusConnector({ chainId: config.chainId })
	} catch (error) {
		console.log("import @web3-react/torus-connector", error)
	}
	return null;
}
// export const torus = new TorusConnector({ chainId: config.chainId })

export const mewConnect = async () => {
	try {
		const mod = await import('./mewconnect-connector')
		return new mod.MewConnectConnector({  url: config.rpc[0], chainId: config.chainId })
	} catch (error) {
		console.log("import mewconnect-connector", error)
	}
	return null;
}
// export const mewConnect = new MewConnectConnector({  url: config.rpc, chainId: config.chainId })

export function useEagerConnect() {
	const { active } = useWeb3React()

	const [tried, setTried] = useState(false)

	// useEffect(() => {
	//   injected.isAuthorized().then((isAuthorized: boolean) => {
	//     if (isAuthorized) {
	//       activate(injected, undefined, true).catch(() => {
	//         setTried(true)
	//       })
	//     } else {
	//       setTried(true)
	//     }
	//   })
	// }, []) // intentionally only running on mount (make sure it's only mounted once :))

	// if the connection worked, wait until we get confirmation of that to flip the flag
	useEffect(() => {
		if (!tried && active) {
			setTried(true)
		}
	}, [tried, active])

	return tried
}

export function useInactiveListener(suppress: boolean = false) {
	// const { active, error, activate } = useWeb3React()

	// useEffect((): any => {
	// 	const { ethereum } = window as any
	// 	if (ethereum && ethereum.on && !active && !error && !suppress) {
	// 		const handleConnect = () => {
	// 			console.log("Handling 'connect' event")
	// 			activate(injected)
	// 		}
	// 		const handleChainChanged = (chainId: string | number) => {
	// 			console.log("Handling 'chainChanged' event with payload", chainId)
	// 			activate(injected)
	// 		}
	// 		const handleAccountsChanged = (accounts: string[]) => {
	// 			console.log("Handling 'accountsChanged' event with payload", accounts)
	// 			if (accounts.length > 0) {
	// 				activate(injected)
	// 			}
	// 		}
	// 		const handleNetworkChanged = (networkId: string | number) => {
	// 			console.log("Handling 'networkChanged' event with payload", networkId)
	// 			activate(injected)
	// 		}

	// 		ethereum.on('connect', handleConnect)
	// 		ethereum.on('chainChanged', handleChainChanged)
	// 		ethereum.on('accountsChanged', handleAccountsChanged)
	// 		ethereum.on('networkChanged', handleNetworkChanged)

	// 		return () => {
	// 			if (ethereum.removeListener) {
	// 				ethereum.removeListener('connect', handleConnect)
	// 				ethereum.removeListener('chainChanged', handleChainChanged)
	// 				ethereum.removeListener('accountsChanged', handleAccountsChanged)
	// 				ethereum.removeListener('networkChanged', handleNetworkChanged)
	// 			}
	// 		}
	// 	}
	// }, [active, error, suppress, activate])
}

// import {
// 	injected,
// 	walletconnect,
// 	walletlink,
// 	// ledger,
// 	// frame,
// 	// fortmatic,
// 	portis,
// 	torus,
// 	mewConnect,
// 	// useEagerConnect, useInactiveListener
// } from './connectors'
const connectors = {
	'Injected': injected,
	'WalletConnect': walletconnect,
	'WalletLink': walletlink,
	// 'Ledger': ledger,
	// 'Frame': frame,
	// 'Fortmatic': fortmatic,
	'Portis': portis,
	'Torus': torus,
	'Mew': mewConnect
} as { [name: string]: any }

export default connectors;