/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import InputField from "../../../components/InputField";
import { Contracts, abis, getCommitment, getGasPrice } from '../../../lib/ENSLib';
import './register.scss';
import Icon from "../../../components/Icon";
import polygon from '../../../assets/neon/img/polygon.svg';
import WebCrypto from "../../../lib/WebCrypto";
import useWallet from "../../../useWallet";
import useStore, { config, encodeCall, fetchJson, getExpectedDomainPrice, N, NF, now, tips } from "../../../useStore";
import { ethers } from "ethers";
import { isSubdomain } from "../../../lib/utils";
import CoinSelect from "../../../components/CoinSelect";

interface RegisterStatus {
	inited: boolean
	// gasPrice: number
	// gas: number
	loadingPrice: boolean
	price: number
	// sum: number
	// balance: number
	// balanceError: number
	coinDialog: boolean
}

// const gasLimitSubmit = 1e5;
// const gasLimitRegister = 5e5;

const Register = ({domain, prices, ownerAddress}: {domain: string, prices: PricesType, ownerAddress: string}) => {
	const {connectedWallet, reg, update, favorites} = useStore();
	const year = reg.year || 1;
	const wallet = useWallet();
	const [status, setStatus] = React.useState<RegisterStatus>({
		inited: false,
		// gasPrice: 0,
		// gas: 0,
		loadingPrice: false,
		price: 0,
		// sum: 0,
		// balance: 0,
		// balanceError: 0,
		coinDialog: false
	})

	const onChangeYear = async (year: number) => {
		try {
			// setStatus({...status, loadingPrice: true})
			// if (!status.gasPrice) {
			// 	const gasPrice = await getGasPrice()
			// 	_status.gasPrice = gasPrice
			// 	_status.gas = N(_status.gasPrice * (gasLimitSubmit + gasLimitRegister), 9)
			// }
			// const _balance = await wallet.getBalance()
			// if (_balance && _status.sum) {
			// 	_status.balance = Number(_balance)
			// 	_status.balanceError = (_status.gas + _status.sum) > _status.balance ? 1 : -1;
			// }
			const price = getExpectedDomainPrice(domain.slice(0, domain.lastIndexOf(".")), year)
			// console.log("price", price)
			setStatus({...status, price})
			update({reg: {...reg, year}})
		} catch (error: any) {
			// tips("Getting price operation was canceled.")
			console.log(error)
			// setStatus({...status, loadingPrice: false})
		}
	}

	const onFavorite = () => {
		const _label = domain.slice(0, domain.lastIndexOf('.'));
		const _favorites = {...favorites}
		if (_favorites[_label]===undefined) {
			_favorites[_label] = 0
		} else {
			delete _favorites[_label]
		}
		update({favorites: _favorites})
	}

	// const onSubmit = async () => {
	// 	update({loading: true})
	// 	try {
	// 		if (wallet.library) {
				// const provider = new ethers.providers.Web3Provider(wallet.library.provider);
				
				// const signer = wallet.library.getSigner();
				// console.log(signer.getAddress());
				
				// const acceptToken = new ethers.Contract(Contracts.acceptToken, ERC20Abi, signer);
				// const approve = await acceptToken.approve(Contracts.ethRegistrarController, ethers.utils.parseUnits(String(status.price * 1.1), 9));
				// await approve.wait();
				// const params = [
				// 	encodeCall(new ethers.utils.Interface(["function approve(address spender, uint amount) public returns (bool)"]), Contracts.acceptToken, "approve", [Contracts.ethRegistrarController, status.price], 1)
				// ]
				// console.log("approve")
				// const json = await fetchJson(config.rpc, params)
				// if (json!==null && Array.isArray(json) && json.length===params.length) {
				// 	console.log("json", json)
				// } else {
				// 	console.log("json null")
				// }
				// const secret = await WebCrypto.hash(connectedWallet.address + Date.now())
				// const label  = domain.slice(0, -5);
				// const params = [label, connectedWallet.address || '', reg.year * 86400 * 366, '0x' + secret, Contracts.publicResolver, [] as string[], false, 0, MAX_EXPIRY]
				// const commitment = await getCommitment.apply(null, params as any) as string
				// const ethRegistrarController = new ethers.Contract(Contracts.ethRegistrarController, abis.controller, signer);
				// const tx = await ethRegistrarController.commit(commitment);
				// await tx.wait();
				// update({loading: false, reg: {...reg, commitment, params, price: status.price, timestamp: now(), domain}})
	// 		}
	// 	} catch (error: any) {
	// 		if (error.code==='ACTION_REJECTED' || error.code===4001) {
	// 			tips("The registeration operation was canceled.")
	// 		} else {
	// 			tips(error.reason)
	// 		}
	// 		console.log(error)
	// 	}
	// 	update({loading: false})
	// }
	
	React.useEffect(() => {
		// if (wallet.active) {
		// 	onChangeYear(reg.year || 1)	
		// } else {
		// 	if (status.inited===false) {
		// 		wallet.connect(connectedWallet.name) // .then(result=>{result && onChangeYear(reg.year || 1)})
		// 		setStatus({...status, inited: true})
		// 	}
		// }
		onChangeYear(year)
	}, [domain])
	

	return (
		<div className="register">
			{ownerAddress ? (
				<div className="registered">
					<span>This name is already registered</span>
				</div>
			) : (
				<div>
					{isSubdomain(domain) ? (
						<div className="registered">
							<span>You can't register the subdomain. Please add this in [add subdomain] page.</span>
						</div>
					) : (
						<div className="register-page">
							<div className="main-part">
								<div className="first">
									<div className="d-row middle" style={{gap: 5}}>
										<p className="name-text">{domain}</p>
										<i className="heart" onClick={onFavorite}>
											<Icon size={24} icon={domain && favorites[domain.slice(0, domain.lastIndexOf('.'))]!==undefined ? 'HeartFill' : 'Heart'} />
										</i>
									</div>
									<div className="d-row middle" style={{gap: 20}}>
										<div className="d-column middle center">
											<InputField.Number value={year} onChange={onChangeYear} suffix='year' placeholder='Year' />
											<p className="light-text">Registration period</p>
										</div>
										<div className="line" style={{marginBottom: 18}}>
											<div className="center-circle"></div>
										</div>
										<div className="d-column middle center relative">
											<input type="text" value={`${NF(status.price, 2)} .ARB`} readOnly/>
											<p className="light-text">Expected Registration Cost</p>
										</div>
									</div>
									<div className="d-row middle" style={{gap: 20}}>
										<div className="line"></div>
										<div className="d-row center middle" style={{gap: 10}}>
											<Icon icon="Info" className="info-icon" />
											<p className="pink-text">INCREASE REGISTRATION PERIOD TO AVOID PAYING GAS EVERY YEAR</p>
										</div>
										<div className="line"></div>
									</div>
								</div>
								<div className="second">
									{/* <p className="calc-text">
										{NF(status.sum, 6)} {config.symbol} + at most {status.gas} {config.symbol} gas fee = at most {NF(status.sum + status.gas, 6)} {config.symbol} <span className="calc-text light"> ({NF(prices.etherPrice * (status.sum + status.gas), 2)}USD)</span>
									</p>
									<p className="s-calc-text">
										Estimated total (Price + Gas). The gas price is based at {status.gasPrice} Gwei.
									</p> */}
									<p className="calc-text">Buy now for <b>{NF(status.price, 2)}</b> .ARB</p>
								</div>
								<div className="chart-part">
									{/* <Line data={data} /> */}
								</div>
								<div className="third">
									{/* <div className="btn-area">
										<button className="notify-btn d-row center middle" style={{gap: 5}}>
											<img src={bell} alt="bell" />
											NOTIFY ME
										</button>
									</div> */}
									<div className="d-column center middle">
										<p className="calc-text">Registering a name requires you to complete 3 steps.</p>
										<p className="s-calc-text">*Favorite the name for easy access in case you close out of your browser.</p>
									</div>
									<div className="step-area">
										<div className="step-item">
											<div className="img-region">
												<p className="num-text">1</p>
												<img src={polygon} alt="polygon" className="polygon-img" />
											</div>
											<div>
												<p className="step-title">REQUEST TO REGISTER</p>
												<p className="step-text">
													Your wallet will open and you will be asked to confirm the first two transactions required for registration. If the second transaction is not processed within 7 days of the first, you will need to start again from step 1.
												</p>
											</div>
										</div>
										<div className="v-line"></div>
										<div className="step-item">
											<div className="img-region">
												<p className="num-text">2</p>
												<img src={polygon} alt="polygon" className="polygon-img" />
											</div>
											<div>
												<p className="step-title">WAIT A MINUTE</p>
												<p className="step-text">
													The waiting period is required to ensure another person hasn’t tried to register the same name and protect you after your request.
												</p>
											</div>
										</div>
										<div className="v-line"></div>
										<div className="step-item">
											<div className="img-region">
												<p className="num-text">3</p>
												<img src={polygon} alt="polygon" className="polygon-img" />
											</div>
											<div>
												<p className="step-title">COMPLETE REGISTRATION</p>
												<p className="step-text">
													Click “register” and your wallet will re-open. Only ater the 2nd transaction is confirmed you’ll know if you got the name.
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="sub-footer d-column center middle">
								{/* {status.balanceError===1 && (
									<div className="danger" style={{paddingBottom: '1em'}}>
										Insufficient balance on your wallet. Fill in your wallet and reload the page.
									</div>
								)} */}
								<button onClick={()=>setStatus({...status, coinDialog: true})} disabled={/* status.balanceError!==-1 ||  */reg.year===0} className="register-btn">REQUEST TO REGISTER</button>
								{
									status.coinDialog && (
										<CoinSelect data={[domain.slice(0, domain.indexOf("."))]} year={year} onClose={()=>setStatus({...status, coinDialog: false})} />
									)
								}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default Register;