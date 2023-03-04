/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import useStore, {config} from '../../../useStore'
import './registrant.scss';
// import PrimaryDomain from "../PrimaryDomain";
import Icon from "../../../components/Icon";
// import InputField from "../../../components/InputField";
// import Spinner from "../../../components/Spinner";
// import { useNavigate } from "react-router";
import ExtendComponent from "../../ExtendComponent";
import { Link } from "react-router-dom";
import Paginator from "../../../components/Paginator";
import { useParams } from "react-router";

interface AccountProps {
	page: number
	total: number
	pageCount: number
	data: AddressDataType[]
	ownDomains?: AddressDataType[]
	isMyPage: boolean
	onChange():void
}

interface RegistrantStatus {
	showExtend: boolean
	checks: {[label: string]: boolean}
	checkDomains: string[]
}

const Registrant = ({page, total, pageCount, data, ownDomains, isMyPage, onChange}: AccountProps) => {
	// const navigator = useNavigate()
	const {param} = useParams();
	const {connectedWallet, favorites, update} = useStore()
	const [all, setAll] = React.useState(false)
	const [status, setStatus] = React.useState<RegistrantStatus>({
		showExtend: false,
		checks: {},
		checkDomains: []
	})
	
	const onFavorite = (label: string, expire: number) => {
		const _favorites = {...favorites}
		if (_favorites[label]===undefined) {
			_favorites[label] = expire
		} else {
			delete _favorites[label]
		}
		update({favorites: _favorites})
	}

	const onCheck = (label?: string) => {
		if (label) {
			const _cs = {...status.checks};
			if (status.checks[label]) {
				delete _cs[label];
			} else {
				_cs[label] = true;
			}
			setStatus({...status, checks: _cs});

			let _count = Object.keys(data).length;
			let _true = Object.keys(_cs).length;
			if (_count===_true) {
				setAll(true)
			} else {
				setAll(false)
			}
		} else {
			setAll(!all)
			if (all) {
				setStatus({...status, checks: {}})
			} else {
				const _cs = {} as {[label: string]: boolean}
				for (let i of data) {
					if (i.expire!==0) {
						_cs[i.label] = true
					}
				}
				setStatus({...status, checks: _cs})
			}
		}
	}

	React.useEffect(() => {
		setCheckDomains();
	}, [status.checks])

	const setCheckDomains = async () => {
		let domains = [] as string [];
		for (let i of data) {
			if (status.checks[i.label]) domains.push(i.label);
		}
		setStatus({...status, checkDomains: domains});
	}

	return (
		<div className="registrant">
			<div className="item border">
				<div className="one">
					<p className="table-title">Name</p>
				</div>
				<div className="two">
					<p className="table-title">Expiration date</p>
				</div>
				<div className="three">
					<p className="table-title">Favorite</p>
				</div>
				{connectedWallet.connected && (
					<div className="four">
						<i className="heart" onClick={()=>onCheck()}><Icon size={22} icon={!all ? 'CheckBox' : 'CheckBoxFill'} /></i>
					</div>
				)}
				
			</div>
			{data.map((i, k)=>(
				<div key={k} className="item border pointer">
					<div className="one h4">
						<Link to={`/name/${i.label}.${config.rootDomain}`}>{`${i.label}.${config.rootDomain}`}</Link>
					</div>
					<div className="two table-title">
						{i.expire!==0 && new Date(i.expire * 1e3).toLocaleString()}
					</div>
					<div className="three">
						<i className="heart" onClick={()=>onFavorite(i.label, i.expire)}><Icon size={24} icon={favorites[i.label]===undefined ? 'Heart' : 'HeartFill'} /></i>
					</div>
					{connectedWallet.connected && (
						<div className="four">
							{i.expire!==0 && <i className="heart" onClick={()=>onCheck(i.label)}><Icon size={22} icon={!status.checks[i.label] ? 'CheckBox' : 'CheckBoxFill'} /></i>}
						</div>
					)}
				</div>
			))}
			{connectedWallet.connected && (
				<div className="item" style={{justifyContent: 'flex-end'}}>
					<button className="btn-select" disabled={Object.keys(status.checks).length === 0} onClick={()=>setStatus({...status, showExtend: !status.showExtend})}>EXTEND SELECTED</button>
				</div>
			)}
			
			{status.showExtend && Object.keys(status.checks).length !== 0 && (<ExtendComponent onChange={()=>{onChange()}} domains={status.checkDomains} onClose={()=>setStatus({...status, showExtend: false})} />)}
			<div>
				<Paginator page={page} total={total} getLink={n=>`/address/${param}/registrant?page=${n}`} />
			</div>
		</div>
	)
}

export default Registrant;