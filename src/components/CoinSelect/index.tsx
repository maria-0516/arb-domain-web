/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import './coinSelect.scss';
import Dialog from "../../components/Dialog";
import useStore, { config, decodeCallData, encodeCall, fetchJson, N, NF } from "../../useStore";
import logo from '../../assets/neon/img/logo.svg';
import Spinner from "../../components/Spinner";
import contracts from '../../lib/ENSLib/contracts.json'
import { iNameWrapper, iRegistrar } from "../../lib/ENSLib";
// import { getEtherExtendDomainsPrice, getExtendedPrices } from "../../lib/ENSLib";



interface CoinSelectProps {
	onClose():void
	data: string[]
	year: number
	priceSum: number
	onNext():void
	isExtend?: boolean
}

const coins = {
	arb: {name: 'ARB', img: logo},
}

const CoinSelect = ({onClose, data, year, priceSum, onNext, isExtend}: CoinSelectProps) => {

	const {connectedWallet} = useStore()
	const [status, setStatus] = React.useState({
		checking: false,

		gasPrice: {
			eth: -1,
		},
		balance: {
			eth: 0,
			arb: 0
		},
		price: {
			arb: 0,
		}
	})

	const [coin, setCoin] = React.useState('arb')

	const getNeonPrice = async () => {
		setStatus({...status, checking: true})
		try {
			const params = [
				{jsonrpc: "2.0", method: "eth_gasPrice", params: [], id: 1},
				{jsonrpc: "2.0", method: "eth_getBalance", params: [connectedWallet.address, "latest"], id: 2},
				{jsonrpc: "2.0", method: "eth_call", params: [{to: contracts.acceptToken, "data": "0x70a08231000000000000000000000000" + connectedWallet.address.slice(2)}, "latest"], id: 3}
				
			] as RpcRequestType[]
			const duration = 86400 * 366 * year
			if (isExtend) {
				params.push(encodeCall(iNameWrapper, contracts.deamNameWrapper, "getExtendedPrices", [data, duration], 4))
			} else {
				params.push(encodeCall(iRegistrar, contracts.ethRegistrarController, "getPrice", [data[0], duration], 4))
			}
			const json = await fetchJson(config.rpc, params)
			if (json!==null && Array.isArray(json) && json.length===params.length) {
				const gasPrice = N(json[0].result, 9)
				const balance = N(json[1].result)
				const tokenBalance = N(json[2].result, 9)
				let arb = 0
				if (isExtend) {
					const prices = decodeCallData(iNameWrapper, "getExtendedPrices", json[3].result)
					if (prices!==null) {
						arb = N(prices[0], 9) + N(prices[1], 9) 
					}
				} else {
					arb = N(json[3].result, 9)
				}
				return setStatus({
					...status, 
					checking: false, 
					gasPrice: {...status.gasPrice, eth: gasPrice}, 
					balance: {...status.balance, eth: balance, arb: tokenBalance}, 
					price: {...status.price, arb}
				})
			}
		} catch (error) {
			console.log("getNeonPrice", error)
		}
		setStatus({...status, checking: false})
	}
	
	React.useEffect(() => {
		if (coin==='arb') {
			if (status.gasPrice.eth===-1) getNeonPrice()
		}
	}, [coin, connectedWallet.address])

	const onCoinChange = (coin: string) => {
		// if (status.ethBalance===-1 || status.usdtBalance===-1) {
		// 	if (coin!=='arb') {
		// 		getETHBalance()
		// 	}
		// }
		// if (coin==='eth' && price.eth===0) {
		//     getEtherDomainPrices(false)
		// } else if (coin==='usdt' && price.usdt===0) {
		//     getEtherDomainPrices(true)
		// }
		setCoin(coin)
	}

	return (
		<Dialog onClose={onClose}>
			<div className="select-coin">
				<div className="main-part">
					<span className="title">Are you sure you want to do this?</span>
					<span className="small-text">This action will modify the state of the blockchain.</span>
					<span className="default">The following name{isExtend ? 's' : ''}:</span>
					<div className="ul-back">
						<ul>
							{data.map((i, k) => (<li key={k}>{i}.{config.rootDomain}</li>))}
						</ul>
					</div>
					<span className="default">will be {isExtend ? 'extended' : 'registered'} for <b>{year}</b> {year===1 ? 'year' : 'years'}</span>
					<div className="coin-select mt d-row around">
					{Object.entries(coins).map(([k, v]) => (
						<div key={k} className={`items ${coin===k ? 'active' : ''}`} onClick={()=>onCoinChange(k)}>
							<div style={{position: 'relative', height: 50}}>
								<img src={v.img} alt={k} width={48} height={48} />
							</div>
							<div>{v.name}</div>
						</div>   
					))}
					</div>
					<div className="default">
						Cost: {status.checking ? 'checking...' : <span>{NF(status.price[coin])} {coins[coin].name}</span>}
					</div>
					<div className="default">
						Your balance: {status.checking ? 'checking...' : <span style={{color: (status.balance[coin] < status.price[coin] ? 'var(--danger)' : '')}}>{status.balance[coin]} {coins[coin]?.name}</span>}
					</div>
					<div className="d-row mt-1" style={{gap: '0.5em'}}>
						<button className="cancel-btn" onClick={onClose} disabled={status.checking}>CANCEL</button>
						<button className="save-btn d-row middle center gap" onClick={onNext} disabled={status.checking || status.balance[coin] < status.price[coin]} >
							<div>{status.checking ? 'Checking...' : 'SUBMMIT'}</div>
							{status.checking && <Spinner styles={{position: 'inherit', top: 'auto', right: 'auto', padding: '0'}} />}
						</button>
					</div>
				</div>
			</div>
		</Dialog>
	)
}

export default CoinSelect;