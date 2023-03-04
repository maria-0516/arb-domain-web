/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

// import { useNavigate } from "react-router";
import { Contracts, abis } from '../../../lib/ENSLib';
import { ethers } from "ethers";
import { tips } from '../../../useStore';
import namehash from '../../../lib/namehash'; // '@deamtest/ens-namehash'
import './detail.scss';
import Icon from "../../../components/Icon";
// import Dialog from "../../../components/Dialog";
import ExtendComponent from "../../ExtendComponent";
import useStore from "../../../useStore";
import useWallet from "../../../useWallet";
import { bytesToHex } from "../../../lib/utils";
import InputDialog from "./InputDialog";
import { Link } from "react-router-dom";

const defaultTitles = {
	'url': 'url',
	'avatar': 'avatar',
	'email': 'email',
	'description': 'description',
	'notice': 'notice',
	'com.discord': 'com.discord',
	'com.github': 'com.github',
	'keywords': 'keywords',
	'com.reddit': 'com.reddit',
	'org.telegram': 'org.telegram',
	'arb.delegate': 'arb.delegate',
	'com.twitter': 'com.twitter',
	'snapshot': 'snapshot'
}

interface DetailDialogType {
	show: boolean
	title: string
	placeholder: string
	value: string
	action: ''|'transfer'|'resolver'|'contenthash'|'email'|'url'|'avatar'|'description'|'notice'|'keywords'|'com.discord'|'com.github'|'com.reddit'|'com.twitter'|'org.telegram'|'arb.delegate' 
	error: string
}
interface DetailStatus {
	// showInput: boolean
	// currentText: string
	// newText: string
	// inputError: string
	
	showExtend: boolean
	showEdit: boolean
	value: {[key: string]: string}
	dialog: DetailDialogType
	newTexts: [string, string]
	// deleteTexts: string[]
}

const Detail = ( {data, prices, onChange, isSubdomain}: {data: DomainDataType, prices: PricesType, onChange(): void, isSubdomain: boolean}) => {  
	const wallet = useWallet();
	const {connectedWallet, update, favorites} = useStore();
	const [status, setStatus] = React.useState<DetailStatus>({
		showExtend: false,
		showEdit: false,
		value: {},
		newTexts: ['', ''],
		// deleteTexts: [],
		dialog: {
			show: false,
			action: '',
			title: '',
			placeholder: '',
			value: '',
			error: '',
		}
	})

	const setDialog = (attrs: Partial<DetailDialogType>) => setStatus({...status, dialog: {...status.dialog, ...attrs}})

	React.useEffect(() => {
		// const _values = {} as {[key: string]: string}
		// Object.keys(data.texts).map(k => (_values[k] = data.texts[k] || ''))
		setStatus({...status, value: {...data.texts, ...status.value}})
		console.log(status.value)
	}, [data.texts])

	const onTransfer = async (to: string) => {
		update({loading: true})
		try {
			if (wallet.library) {
				const nodeId = namehash.hash(data.name)
				const from = connectedWallet.address
				const signer = wallet.library.getSigner()
				const nameWrapper = new ethers.Contract(Contracts.nameWrapper, abis.nameWrapper, signer)
				const tx = await nameWrapper.safeTransferFrom(from, to, nodeId, 1, '0x')
				await tx.wait()
				setDialog({show: false})
				onChange()
			} else {
				console.log("please connect.");	
			}
		} catch (error: any) {
			if (error.code==='ACTION_REJECTED' || error.code===4001) {
				tips("Transfering ownership operation was canceled.")
			} else {
				tips(error.reason)
			}
			console.log(error)
		}
		update({loading: false})
		
	}

	const onSaveText = async () => {
		update({loading: true})
		try {
			if (wallet.library) {
				// const index = data.name.indexOf('.');
				// const label = data.name.slice(0, index);
				const domainhash = namehash.hash(data.name)
				// const labelhash = namehash.keccak256(label)
				const signer = wallet.library.getSigner()
				// const controller = new ethers.Contract(Contracts.ethRegistrarController, abis.controller, signer)
				const publicResolver = new ethers.Contract(Contracts.publicResolver, abis.publicResolver, signer)
	
				let v =  Object.keys(status.value).map((k) => {
					if (k === 'contenthash') {
						return publicResolver.interface.encodeFunctionData('setContenthash(bytes32,bytes)', [domainhash, bytesToHex(status.value[k])]);
					} else {
						return publicResolver.interface.encodeFunctionData('setText(bytes32,string,string)', [domainhash, k, status.value[k]]);
					}
				})
				const tx = await publicResolver.multicallWithNodeCheck(domainhash, v)
				
				// const tx = await controller.setRecords(Contracts.publicResolver, labelhash, v)
				await tx.wait()
				setStatus({...status, showEdit: false, newTexts: ['', '']/* , deleteTexts: [] */});
				onChange()
			}
		} catch (error: any) {
			if (error.code==='ACTION_REJECTED' || error.code===4001) {
				tips("Adding domain data operation was canceled.")
			} else {
				tips(error.reason)
			}
			console.log(error)
		}
		update({loading: false})
	}
	
	// const submitResolver = async (library: ethers.providers.Web3Provider, domainhash: string, value: string) => {

	// }

	const onFavorite = () => {
		const _label = data.name.slice(0, data.name.lastIndexOf('.'));
		const _favorites = {...favorites}
		if (_favorites[_label]===undefined) {
			_favorites[_label] = data.expire
		} else {
			delete _favorites[_label]
		}
		update({favorites: _favorites})
		onChange()
	}

	const onAddText = () => {
		const [key, value] = status.newTexts;
		if (key!=='' && value!=='') {
			setStatus({...status, value: {...status.value, [key]: value}, newTexts: ['', '']})
		}
	}
	
	return (
		<div className="detail-page">
			<div className="section center middle" style={{gap: 10}}>
				<div className="d-row middle" style={{gap: 10}}>
					<h3>{data.name}</h3>
					<i className="heart" onClick={onFavorite}>
                        <Icon size={24} icon={data.name && favorites[data.name.slice(0, data.name.lastIndexOf('.'))] ? 'HeartFill' : 'Heart'} />
                    </i>
				</div>
				<Link to="/faq">Learn how to manage your name</Link>
			</div>
			<div className="section">
				<div className="item">
					<label>PARENT DOMAIN</label>
					<div className="x-right">
						{data.parent.indexOf('.')===-1 ? <b style={{color: '#4F24C5'}}>{data.parent}</b> : <Link className="line-break" to={`/name/${data.parent}`}>{data.parent}</Link>}
						<div className="empty-div"></div>
					</div>
				</div>
				{!isSubdomain && (
					<div className="item">
						<label>REGISTRANT</label>
						<div className="x-right md-column">
							<Link className="line-break" to={`/address/${data.registrant}/registrant`}>{data.registrant}</Link>
							<button className="btn" disabled={true}>TRANSFER</button>
						</div>
					</div>
				)}
				
				<div className="item">
					 <label>CONTROLLER</label>
					 <div className="x-right md-column">
						<Link className="line-break" to={`/address/${data.owner}/controller`}>{data.owner}</Link>
						<button className="btn" disabled={!connectedWallet.connected || connectedWallet.address !== data.owner} onClick={()=>setDialog({show: true, action: 'transfer', title: `Transfer [${data.name}] Domain To:`, placeholder: 'Please input a new owner address'})}>TRANSFER</button>
					 </div>
				</div>
				{!isSubdomain && (
					<div className="item">
						<label>EXPIRATION DATE</label>
						<div className="x-right md-column">
							<span>{new Date(data.expire * 1e3).toString()}</span>
							<button className="btn" disabled={!connectedWallet.connected || connectedWallet.address !== data.owner} onClick={()=>setStatus({...status, showExtend: !status.showExtend})}>EXTEND</button>
						</div>
					</div>
				)}
				{status.showExtend && (<ExtendComponent onChange={onChange} domains={[data.name.slice(0, data.name.lastIndexOf('.'))]} onClose={()=>setStatus({...status, showExtend: false})}  />)}
			</div>
			<hr />
			<div className="section background">
				
				<div className="x-item border">
					<label>ADDRESS</label>
					<span>{data.owner}</span>
				</div>
				<div className="x-item border">
					<label>CONTENT HASH</label>
					{
						status.showEdit ? (
							<div className="field">
								<input type="text" onChange={e=>setStatus({...status, value: {...status.value, contenthash: e.target.value}})} /* value={!!status.value['contenthash'] ? String(status.value['contenthash']) : ''} */ defaultValue={data.contentHash} />
								<i className="btn-icon" onClick={e=>setStatus({...status, value: {...status.value, contenthash: ''}})}><Icon icon="DeleteIcon" size={24} /></i>
							</div>
						) : (
							<span>
								{data.contentHash || 'NO SET'}
							</span>
						)
					}
				</div>
				<div className="x-item">
					<div>
						<label>TEXT RECORD</label>
						<div className="btn-group">
							{
								status.showEdit ? (
									<div>
										<div><button className="btn" onClick={onSaveText}>SAVE</button></div>
										<div><button className="btn outline" onClick={()=>setStatus({...status, showEdit: false})}>CANCEL</button></div>
									</div>
								) : (
									<div>
										<div><button className="btn outline" disabled={!connectedWallet.connected || connectedWallet.address !== data.owner} onClick={()=>setStatus({...status, showEdit: true})} >EDIT</button></div>
									</div>
								)
							}
						</div>
					</div>
					<div>
						{status.showEdit && (
							<div>
								<div className="x-item">
									<div className="field">
										<input type="text" className="add-item" value={status.newTexts[0]} onChange={(e)=>setStatus({...status, newTexts: [e.target.value, status.newTexts[1]]})} />
									</div>
									<div className="field">
										<input type="text" value={status.newTexts[1]} onChange={(e)=>setStatus({...status, newTexts: [status.newTexts[0], e.target.value]})} />
										<div onClick={onAddText}><i className="btn-icon"><Icon icon="FillPlus" size={24} /></i></div>
									</div>
								</div>
								<hr />
							</div>
						)}

						{Object.keys(defaultTitles).map(k=>((!!data.texts[k] || status.showEdit) && 
							<div key={k} className="x-item">
								<label>{k}</label>
								{
									status.showEdit ? (
										<div className="field">
											<input type="text" onChange={e=>setStatus({...status, value: {...status.value, [k]: e.target.value}})} value={!!status.value[k] ? String(status.value[k]) : ''} />
											<i className="btn-icon" onClick={e=>setStatus({...status, value: {...status.value, [k]: ''}})}><Icon icon="DeleteIcon" size={24} /></i>
										</div>
									) : (
										!!data.texts[k] && <span>{data.texts[k] || 'NOT SET'}</span>
									)
								}
							</div>
						))}
						{Object.keys(status.value).map(k=>((!defaultTitles[k]) && k!== 'contenthash' &&
							<div key={k} className="x-item">
								<label>{k}</label>
								{status.showEdit ? (
									<div className="field">
										<input type="text" onChange={(e)=>setStatus({...status, value: {...status.value, [k]: e.target.value}})} value={!!status.value[k] ? String(status.value[k]) : ''} />
										{status.value[k]!=='' ? <i className="btn-icon" onClick={e=>setStatus({...status, value: {...status.value, [k]: ''}})}><Icon icon="DeleteIcon" size={24} /></i> : <div style={{width: 24}}></div>}
									</div>
								) : (
									<span>{status.value[k]}</span>
								)}
							</div>
						))}
						
					</div>
				</div>
			</div>
			<div className="section">
				{/* <div className="d-row center middle" style={{gap: 10}}>
					<Icon icon="Info" className="info-icon" />
					<p className="title">You can’t edit or add records until you migrate to the new resolver.</p>
				</div> */}
				<h3>Advanced settings</h3>
				<div className="item">
					<label>RESOLVER</label>
					<div className="x-right md-column">
						<Link className="line-break" to={`/address/${data.resolver}`}>{data.resolver}</Link>
						<button className="btn outline" disabled={true} onClick={() => setDialog({show: true, action: 'resolver', title: `[RESOLVER] address of [${data.name}] domain`})}>SET</button>
					 </div>
				</div>
			</div>
			<div className="sub-footer d-column center middle"></div>
			{status.dialog.show && (
				<InputDialog title={status.dialog.title} placeholder={status.dialog.placeholder} format="address" onClose={()=>setDialog({show: false})} onSubmit={onTransfer} />
			)}
		</div>
	)
}

export default Detail;

