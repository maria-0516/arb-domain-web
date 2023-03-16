/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";
import './subdomain.scss';
import logo from '../../../assets/neon/img/logo.svg';
import ConnectButton from "../../../components/ConnectButton";
import Dialog from "../../../components/Dialog";
import useStore, { tips } from "../../../useStore";
import { Contracts, abis, getSubdomains } from '../../../lib/ENSLib';
import useWallet from "../../../useWallet";
import { ethers } from "ethers";
import Icon from "../../../components/Icon";
import namehash from "../../../lib/namehash";

interface SubdomainProps {
	domain: string
}

interface SubdomainStatus {
	showInput: boolean
	label: string
	subdomains: string[]
}

const Subdomain = ({domain}: SubdomainProps) => {
	// const navigator = useNavigate();
	const {loading, favorites, update, connectedWallet} = useStore()
	const wallet = useWallet();
	const [status, setStatus] = React.useState<SubdomainStatus>({
		showInput: false,
		label: '',
		subdomains: []
	})

	const refInput = React.useRef<HTMLInputElement>(null)

	const onAddSubdomain = async () => {
		
		try {
			const label = status.label.trim();
			if (label==='') {
				refInput.current?.focus();
				return
			}
			if (label.indexOf('.')!==-1) {
				refInput.current?.select();
				refInput.current?.focus();
				return
			}
			
			if (domain && wallet.library) {
				update({loading: true});
				const parentNode = namehash.hash(domain);
				const signer = wallet.library.getSigner();
				const nameWrapper = new ethers.Contract(Contracts.nameWrapper, abis.nameWrapper, signer)
				const tx = await nameWrapper.setSubnodeRecord(parentNode, label, connectedWallet.address, Contracts.publicResolver, 0, 0, 1e10);
				await tx.wait();
				getData();
			}
		} catch (error: any) {
			if (error.code==='ACTION_REJECTED' || error.code===4001) {
				tips("Adding subdomain operation was canceled.")
			} else {
				tips(error.reason);
			}
			console.log(error)
			//tips("Only domain owner can add subdomains.")
			
		}
		update({loading: false})
	}

	const onFavorite = () => {
		const _label = domain?.slice(0, domain.lastIndexOf('.')) || '';
		const _favorites = {...favorites}
		if (_favorites[_label]===undefined) {
			_favorites[_label] = 1
		} else {
			delete _favorites[_label]
		}
		update({favorites: _favorites})
	}

	const getData = async () => {
		update({loading: true})
		try {
			const _subdomains = await getSubdomains(domain);
			setStatus({...status, subdomains: _subdomains, showInput: false, label: ''})
		} catch (error) {
			console.log(error);
		}
		update({loading: false})
	}

	React.useLayoutEffect(() => {
		getData()
	}, [])

	const onDelete = async (label: string) => {
		try {
			if (wallet.library) {
				update({loading: true});
				const signer = wallet.library.getSigner()
				const parenthash = namehash.hash(domain)
				const nameWrapper = new ethers.Contract(Contracts.nameWrapper, abis.nameWrapper, signer);
				const tx = await nameWrapper.deleteSubnodeRecord(parenthash, label);
				await tx.wait();
				getData();
			}
		} catch (error: any) {
			if (error.code==='ACTION_REJECTED' || error.code===4001) {
				tips("Removing subdomain operation was canceled.")
			} else {
				tips(error.reason);
			}
			console.log(error)
		}
		update({loading: false});
	}

	return (
		<div className="subdomain-page">
			{
				status.showInput && (
					<Dialog onClose={()=>setStatus({...status, showInput: false, label: ''/* , newAddress: '' */})}>
						<div className="input-dialog">
							<span>Add a subdomain to [{domain}]</span>
							<input ref={refInput} type="text" value={status.label} placeholder="Subdomain Name" onChange={e=>{setStatus({...status, label: e.target.value})}} />
							<div className="d-row" style={{gap: '1em'}}>
								<button className="cancel-btn" onClick={()=>setStatus({...status, showInput: false, /* newAddress: '',  */label: ''})}>CANCEL</button>
								<button className="save-btn" onClick={onAddSubdomain}>OK</button>
							</div>
						</div>
					</Dialog>
				)
			}
			{
				status.subdomains.length === 0 ? (
					<div className="none-subdomains">
						<div className="sub-main d-column center middle" style={{gap: 20}}>
							<div className="d-row middle" style={{gap: 10}}>
								<p className="name-text">{domain}</p>
								<i className="heart" onClick={onFavorite}><Icon size={24} icon={domain && favorites[domain.slice(0, domain.lastIndexOf('.'))] ? 'HeartFill' : 'Heart'} /></i>
							</div>
							{connectedWallet.connected && <button className="add" onClick={()=>setStatus({...status, showInput: true})}> + ADD SUBDOMAIN</button>}
							<div className="disc-text">{loading ? `Getting subdomains from [${domain}]` : 'No subdomains have been added'}</div>
						</div>  
						<div className="sub-footer d-column center middle">
							<ConnectButton />
						</div>
					</div>
				) : (
					<div className="registered">
						<div className="d-row middle" style={{gap: 10}}>
							<p className="name-text">{domain}</p>
							<i className="heart" onClick={onFavorite}>
								<Icon size={24} icon={domain && favorites[domain.slice(0, domain.lastIndexOf('.'))] ? 'HeartFill' : 'Heart'} />
							</i>
							{connectedWallet.connected && <button className="add" onClick={()=>setStatus({...status, showInput: true})}> + ADD SUBDOMAIN</button>}
						</div>
						<div className="subdomain-region">
							{status.subdomains.map((i, k) => (
								<div key={k} className="d-row middle between">
									<Link to={`/name/${i}.${domain}`} className="disc-text pointer">{i}.{domain}</Link>
									{connectedWallet.connected && <i onClick={()=>onDelete(i)} className="btn-icon"><Icon icon="DeleteIcon" size={24} /></i>}
								</div>
							))}
						</div>
					</div>
				)
			}
		</div>
	 )
}

export default Subdomain;