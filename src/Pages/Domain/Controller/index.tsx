import React from "react";
// import Select from 'react-select'

import './controller.scss';
import useStore, { config } from "../../../useStore";
import PrimaryDomain from "../PrimaryDomain";
import Icon from "../../../components/Icon";
// import { useNavigate } from "react-router";
import Paginator from "../../../components/Paginator";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";

interface AccountProps {
	address: string
	page: number
	total: number
	pageCount: number
	data: AddressDataType[]
	isMyPage: boolean
}

const Controller = ({address, page, total, pageCount, data, isMyPage}: AccountProps) => {
	
	// const navigator = useNavigate()
	const {connectedWallet, favorites, update} = useStore()
 
	const onFavorite = (label: string, expire: number) => {
		const _favorites = {...favorites}
		if (_favorites[label]===undefined) {
			_favorites[label] = expire;
		} else {
			delete _favorites[label];
		}
		update({favorites: _favorites})
	}

	return (
		<div className="controller">
			<div>
				{isMyPage && connectedWallet.connected && <PrimaryDomain data={data} />}
			</div>
			<div className="item border">
				<div className="one">
					<p className="table-title">Name</p>
				</div>
				<div className="two">
					<p className="table-title">Favorite</p>
				</div>
			</div>
			{data.map((i, k)=>(
				<div key={k} className="item border pointer">
					<div className="one">
						<Link to={`/name/${i.label}.${config.rootDomain}`} className="table-text">{`${i.label}.${config.rootDomain}`}</Link>
					</div>
					<div className="two">
						<div className="three">
							<i className="heart" onClick={()=>onFavorite(i.label, i.expire)}><Icon size={24} icon={favorites[i.label]===undefined ? 'Heart' : 'HeartFill'} /></i>
						</div>
					</div>
				</div>
			))}
			<div>
				<Paginator page={page} total={total} getLink={n=>`/address/${address}/controller?page=${n}`} />
			</div>
		</div>
	)
}

export default Controller;