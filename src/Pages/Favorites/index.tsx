/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import './favorites.scss';
import useStore, {config, now} from "../../useStore";
import Icon from "../../components/Icon";
// import { useNavigate } from "react-router";
import ExtendComponent from "../ExtendComponent";
import { getExpires } from "../../lib/ENSLib";
import { Link } from "react-router-dom";
// import useWallet from "../../useWallet";

interface FavoriteProps {
	showExtend: boolean
	checks: {[label: string]: boolean}
	time: number
}

const Favorites = () => {
	// const navigator = useNavigate()
	const {connectedWallet, favorites, update} = useStore();
	const [all, setAll] = React.useState(false);
	const [status, setStatus] = React.useState<FavoriteProps>({
		showExtend: false,
		checks: {},
		time: 0,
	})
	const [domains, setDomains] = React.useState<Array<{label: string, expire: number}>>([])
	
	const onRemove = (label: string) => {
		const _favorites = {...favorites}
		if (_favorites[label]!==undefined) {
			delete _favorites[label];
			update({favorites: _favorites})
			const _domains = Object.entries(_favorites).sort((a, b)=>((a[1]===0 && b[1]===0) ? -1e12 : (b[1] - a[1]))).map(i=>({label: i[0], expire: i[1]}));
			setDomains(_domains.map((i, k)=>({label: i.label, expire: i.expire})))
		}
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

			// let _count = Object.keys(favorites).length;
			// let _true = Object.keys(_cs).length;
			setAll(false)
		} else {
			setAll(!all)
			if (all) {
				setStatus({...status, checks: {}})
			} else {
				const _cs = {} as {[label: string]: boolean}
				for (let k in favorites) {
					if (k.indexOf('.')===-1) _cs[k] = true
				}
				setStatus({...status, checks: _cs})
			}
		}
	}

	const getData = async () => {
		update({loading: true})
		try {
			const _domains = Object.entries(favorites).sort((a, b)=>((a[1]===0 && b[1]===0) ? -1e12 : (b[1] - a[1]))).map(i=>({label: i[0], expire: i[1]}));
			const expires = await getExpires(_domains.map(i=>i.label))
			if (expires) {
				setDomains(_domains.map((i, k)=>({label: i.label, expire: expires[k]})))
			}
			const _cs = {} as {[label: string]: boolean}
			for (let k in status.checks) {
				if (favorites[k]!==undefined) {
					_cs[k] = status.checks[k]
				}
			}
			setStatus({...status, checks: _cs})
			setAll(false)
			update({loading: false, favorites: Object.fromEntries(_domains.map(i=>([i.label, i.expire])))})
			return 
		} catch (error) {
			console.log(error)
		}
		update({loading: false})
	}

	React.useEffect(() => {
		getData()
	}, [status.time])

	// const setCheckDomains = async () => {
	// 	let domains = Object.keys(favorites).filter(i=>status.checks[i]);
	// 	setStatus({...status, checkDomains: domains});
	// }

	return (
	   <div className="favorites">
			<div className="top-part">
				<p className="title">Favorites</p>
			</div>
			<div className="content-part">
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
				{domains.map(({label, expire})=>(
					<div key={label} className="item border">
						<div className="one table-text">
							<Link to={`/name/${label}.${config.rootDomain}`}>{`${label}.${config.rootDomain}`}</Link> 
						</div>
						<div className="two table-title">
							{expire!==0 && new Date(expire * 1e3).toLocaleString()}
						</div>
						<div className="three">
							<i className="heart" onClick={()=>onRemove(label)}><Icon size={24} icon='HeartFill' /></i>
						</div>
						{connectedWallet.connected && (
							<div className="four">
								{(label.indexOf('.')===-1 && expire!==0) && <i className="heart" onClick={()=>onCheck(label)}><Icon size={22} icon={!status.checks[label] ? 'CheckBox' : 'CheckBoxFill'} /></i>}
							</div>
						)}
					</div>
				))}
				{connectedWallet.connected && (
					<div className="item" style={{justifyContent: 'flex-end'}}>
						<button className="btn-select" disabled={Object.keys(status.checks).length === 0} onClick={()=>setStatus({...status, showExtend: !status.showExtend})}>EXTEND SELECTED</button>
					</div>
				)}
				{Object.keys(status.checks).length!==0 && status.showExtend && (<ExtendComponent onChange={()=>setStatus({...status, time: now(), showExtend: false})} domains={Object.keys(status.checks)} onClose={()=>setStatus({...status, showExtend: false})} />)}
			</div>
	   </div>
	)
}

export default Favorites;