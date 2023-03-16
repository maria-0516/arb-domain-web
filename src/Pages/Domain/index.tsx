/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
// import { ethers } from 'ethers'

import './domain.scss';

import Detail from './Detail';
import Subdomain from './Subdomain';
import Register from './Register';
import ConnectRegister from './ConnectRegister';
import RegisterStep from './RegisterStep';
import DNSDetail from './DNSDetail';
import Registrant from './Registrant';
import Controller from './Controller';

import { isNeonDomain, isSubdomain, validAddress, validDomainName } from '../../lib/utils';
import useStore, {config, dnsProver, now, zeroAddress} from '../../useStore';
import { getDomainByAddress, getDomainInfo, getLimitTime } from '../../lib/ENSLib';
import arrow from '../../assets/neon/img/arrow.svg';

import img_register from '../../assets/neon/img/register.svg';
import img_detail from '../../assets/neon/img/detail.svg';
import img_subdomain from '../../assets/neon/img/subdomain.svg';
import img_registrant from '../../assets/neon/img/registrant.svg';
import img_controller from '../../assets/neon/img/controller.svg';

const images = {
	'detail': img_detail,
	'dns-detail': img_detail,
	'subdomain': img_subdomain,
	'register': img_register,
	'connect-register': img_register,
	'register-step': img_register,

    'registrant': img_registrant,
    'controller': img_controller,
}

interface DomainStatus {
	error: string
	registered: boolean
	domainData?: DomainDataType
	accountData?: {page: number, total: number, pageCount: number, data: AddressDataType[]}
	currentPage: string
	// pageNumber: number
	pageCount: number
	stepTime: number
}
const Domain = () => {
	const [searchParams] = useSearchParams();
	const { param, action } = useParams<{param: string, action: string}>();
	const {connectedWallet, reg, update} = useStore();
	const [status, setStatus] = React.useState<DomainStatus>({
		error: '',
		currentPage: action || 'connect-register',
		// pageNumber: 0,
		pageCount: 10,
		registered: false,
		stepTime: 0
	})
	const [domain, setDomain] = React.useState('');
	const [address, setAddress] = React.useState('');
	const [registerPrices, setRegisterPrices] = React.useState<PricesType>({
		basePrice: 0,
		premiumPrice: 0,
		etherPrice: 0,
	})

	const checkDomain = async (name: string) => {
		update({loading: true});
		try {
			if (!isNeonDomain(name)) {
				const result = await dnsProver.queryWithProof('TXT', name)
				console.log(result);
				return;
			}
			const response = await getDomainInfo(name);
			// console.log(name)
			if (response) {
				const {data, prices, } = response
				setRegisterPrices(prices);
				if (data.owner === zeroAddress) {
					if (!connectedWallet.connected) {
						setStatus({...status, error: '',currentPage: 'connect-register', registered: false, domainData: undefined})
					} else {
						if (!!reg.commitment && reg.domain === name) {
							const {_timestamp, _min, _max} = await getLimitTime(reg.commitment);
							if (!_timestamp) {
								update({reg: {...reg, commitment: '', domain: ''}});
								setStatus({...status, error: '',currentPage: 'register', registered: false, domainData: undefined})
							} else {
								const _restTime = now() - reg.timestamp;
								setStatus({...status, error: '',currentPage: (_restTime < _max) ? 'register-step' : 'register', registered: false, domainData: undefined, stepTime: _min > _restTime ? (_min - _restTime) : 1})
							}
						} else {
							update({reg: {...reg, commitment: '', domain: ''}});
							setStatus({...status, error: '',currentPage: 'register', registered: false, domainData: undefined})
						}                
					}
				} else {
					if (action === 'subdomain' || action === 'detail' || action === 'register' || action === undefined) {
						setStatus({...status, error: '', domainData: data, currentPage: `${action ? action : 'detail'}`, registered: true})
					}
				}
			}
		} catch (error: any) {
			setStatus({...status, currentPage: '', registered: false, error: error.message})
			console.log(error)
		}
		update({loading: false});
	}
	
	const checkAddress = async (account: string) => {
		update({loading: true});
		// 
		try {
			let page = Number(searchParams.get('page') || 0); // 'name'
			if (isNaN(page)) page = 1;
			const response = await getDomainByAddress(account, action==='registrant', page, status.pageCount);
			if (response!==null) {
				setStatus({...status, currentPage: action==='controller' ? 'controller' : 'registrant', accountData: {...response, pageCount: status.pageCount}})
			}
			// console.log(response);
		} catch (error) {
			console.log(error)
		}

		update({loading: false});
	}

	const onDomainChange = () => {
		if (param) {
			if (validAddress(param)) {
				checkAddress(param);
			} else if (validDomainName(param)) {
				checkDomain(param)
			}
		}
	}
	
	React.useEffect(()=>{
		if (!!param) {
			if (validAddress(param)) {
				setAddress(param)
				setDomain('')
			} else if (validDomainName(param)) {
				// if (!isNeonDomain(param || '')) return;
				setDomain(param)
				setAddress('')
			}
		}
		if (!!param) {
			if (validAddress(param)) {
				checkAddress(param);
			} else if (validDomainName(param)) {
				checkDomain(param)
			}
		} else {
			setAddress(connectedWallet.address)
			setDomain('')
			checkAddress(connectedWallet.address);
		}
		
	}, [param, action, connectedWallet.connected, reg.commitment])

	return (
		<div className='name'>
			{!!domain && (
				<div className="top-part" style={{backgroundImage: `url(${images[status.currentPage]})`}}>
					<Link to={`/name/${domain}/register`} className={`top-btn ${status.currentPage==='register' ? 'active' : ''}`}>
						REGISTER
					</Link>
					{status.registered && (
						<>
							<Link to={`/name/${domain}/detail`} className={`top-btn ${status.currentPage==='detail' ? 'active' : ''}`}>
								DETAILS
							</Link>
							<Link to={`/name/${domain}/subdomain`} className={`top-btn ${status.currentPage==='subdomain' ? 'active' : ''}`}>
								SUBDOMAINS
							</Link>
						</>
					)}
				</div>
			)}
			{!!address && (
				<div className="top-part left" style={{backgroundImage: `url(${images[status.currentPage]})`,backgroundPosition: 'right center'}}>
					<div className="btn-area">
						<Link to={`/address/${address}/registrant`} className={`top-btn ${status.currentPage === 'registrant' ? 'active' : ''}`}>
							REGISTRANT
						</Link>
						<Link to={`/address/${address}/controller`} className={`top-btn ${status.currentPage === 'controller' ? 'active' : ''}`}>
							CONTROLLER
						</Link>
					</div>
					<div className="d-row center middle" style={{lineBreak: 'anywhere'}}>{address}</div>
					<div className="d-row middle" style={{gap: 5}}>
						<Link to={`${config.scanUrl}/address/${address}`} target="_blank" rel="noreferrer" className="purple-text">View on Neonscan</Link>
						<img src={arrow} alt="arrow" style={{marginRight: 15}} />
					</div>
				</div>
			)}
			
			{status.error!=='' ? (
				<div className='d-row middle center warning' style={{minHeight: '68vh'}}>
					<b>{status.error}</b>
				</div>
			) : (
				<>
					{status.currentPage==='detail' 			&& !!status.domainData && <Detail onChange={onDomainChange} data={status.domainData} prices={registerPrices} isSubdomain={isSubdomain(domain)} />}
					{status.currentPage==='dns-detail' 		&& <DNSDetail />}
					{status.currentPage==='subdomain' 		&& <Subdomain domain={param || ''} />}
					{status.currentPage==='register' 		&& <Register domain={param || ''} prices={registerPrices} ownerAddress={status.domainData ? status.domainData.owner : ''} />}
					{status.currentPage==='connect-register'&& <ConnectRegister domain={domain}/>}
					{status.currentPage==='register-step' 	&& <RegisterStep domain={domain} stepTime={status.stepTime} />}
					{status.currentPage==='registrant' 		&& !!status.accountData && <Registrant onChange={onDomainChange} {...status.accountData} isMyPage={address===connectedWallet.address} />}
					{status.currentPage==='controller' 		&& !!status.accountData && <Controller {...status.accountData} address={address} isMyPage={address===connectedWallet.address} />}
					{status.currentPage==='account' 		&& !!status.accountData && <Controller {...status.accountData} address={address} isMyPage={address===connectedWallet.address} />}
				</>
			)}
		</div>
	)
}

export default Domain;