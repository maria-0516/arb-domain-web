/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Icon from '../../components/Icon';
import InputField from '../../components/InputField';
import Spinner from '../../components/Spinner';
import { getExtendedPrices } from '../../lib/ENSLib';
import useStore, { config, tips, NF } from '../../useStore';
import ExtendConfirm from './ExtendConfirm';
import { Contracts, abis } from '../../lib/ENSLib';

import './extendcomponent.scss';
import useWallet from '../../useWallet';
import { ethers } from 'ethers';

interface ExtendProps {
	onClose():void
	domains: string []
	onChange():void
}

interface ExtendStatus {
	priceSum: number
	loadingPrice: boolean
	basePrice: number
	premiumPrice: number
	etherPrice: number
	year: number
	showConfirm: boolean
}

const ExtendComponent = ({onClose, domains, onChange}: ExtendProps) => {
	const {update} = useStore()
	const wallet = useWallet();
	const [status, setStatus] = React.useState<ExtendStatus>({
		priceSum: 0,
		loadingPrice: false,
		basePrice: 0,
		premiumPrice: 0,
		etherPrice: 0,
		year: 1,
		showConfirm: false
	});

	const getPrices = async (_year: number) => {
		try {
			setStatus({...status, loadingPrice: true})
			const {_basePrice, _premiumPrice, _etherPrice} = await getExtendedPrices(domains);
			console.log("_basePrice: ",_basePrice)
			setStatus({...status, basePrice: _basePrice, premiumPrice: _premiumPrice, etherPrice: _etherPrice, priceSum: (_basePrice * _year + _premiumPrice), loadingPrice: false});
		} catch (error) {
			console.log(error);
		}
	}

	const onYear = (_year: number) => {
		setStatus({...status, loadingPrice: true})
		console.log(_year)
		setStatus({...status, priceSum: (status.basePrice + status.premiumPrice) * _year, loadingPrice: false, year: _year})
		console.log(status.priceSum)
	}

	const onComfirm = async () => {
		update({loading: true})
		try {
			if (wallet.library) {
				const signer = wallet.library.getSigner();
				const deamNameWrapper = new ethers.Contract(Contracts.deamNameWrapper, abis.deamNameWrapper, signer);
				const value = ethers.utils.parseEther(String(status.priceSum * 1.01));
				const tx = await deamNameWrapper.renew(domains, status.year * 86400 * 366, {value});
				await tx.wait();
				setStatus({...status, showConfirm: false})
				onChange();
			}
		} catch (error: any) {
			if (error.code==='ACTION_REJECTED' || error.code===4001) {
				tips("The save operation was canceled.")
			} else {
				tips(error.reason)
			}
			console.log(error)
		}
		update({loading: false})
	}

	React.useEffect(() => {
		getPrices(status.year);
	}, [domains])

	return (
		<div>
			<div className="extend">
				<div className="d-row middle" style={{gap: 20}}>
					<div className="d-column middle center">
						<InputField.Number value={status.year} onChange={(_year)=> onYear(_year)} suffix='year' placeholder='Year' />
						<p className="light-text">Registration period</p>
					</div>
					<div className="line" style={{marginBottom: 18}}>
						<div className="center-circle"></div>
					</div>
					<div className="d-column middle center relative">
						<input type="text" value={`${NF(status.priceSum, 2)} ${config.symbol}`} readOnly/>
						{status.loadingPrice && <Spinner />}
						<p className="light-text">Registration price to pay</p>
					</div>
				</div>
				<div className="d-row middle" style={{gap: 20}}>
					<div className="line"></div>
					<div className="d-row center middle" style={{gap: 10}}>
						<Icon icon="Info" className="info-icon" />
						<p className="pink-text">Increase registration period to avoid paying gas every year</p>
					</div>
					<div className="line"></div>
				</div>
				<div className="d-row middle" style={{gap: 10,marginBottom: 20}}>
					<button className="btn outline" onClick={onClose}>CANCEL</button>
					<button className="btn" disabled={status.year===0} onClick={()=>setStatus({...status, showConfirm: true})}>EXTEND</button>
				</div>
			</div>
			{
				status.showConfirm && (
					<ExtendConfirm onConfirm={onComfirm} onClose={()=>setStatus({...status, showConfirm: false})} priceSum={status.priceSum} data={domains} year={status.year} />
				)
			}
		</div>
		
	)
}

export default ExtendComponent;