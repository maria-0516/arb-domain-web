import React from "react";

import './extendconfirm.scss';
import Dialog from "../../../components/Dialog";
// import useWallet from "../../../useWallet";
// import { ethers } from "ethers";
// import { Contracts, abis } from '../../../lib/ENSLib';
import { config } from "../../../useStore";

interface ExtendConfirmProps {
	onClose():void
	data: string[]
	year: number
	priceSum: number
	onConfirm():void
}

const ExtendConfirm = ({onClose, data, year, priceSum, onConfirm}:ExtendConfirmProps) => {
	return (
		<Dialog onClose={onClose}>
			<div className="extend-confirm">
				<div className="main-part">
					<span className="title">Are you sure you want to do this?</span>
					<span className="small-text">This action will modify the state of the blockchain.</span>
					<span className="default">The following names:</span>
					<div className="ul-back">
						<ul>
							{
								data.map((i, k) => (
									<li key={k}>{i}.{config.rootDomain}</li>
								))
							}
						</ul>
					</div>
					<span className="default">will be extended for {year} years</span>
					<div className="d-row" style={{gap: '0.5em'}}>
						<button className="cancel-btn" onClick={onClose}>CANCEL</button>
						<button className="save-btn" onClick={onConfirm}>CONFIRM</button>
					</div>
				</div>
			</div>
		</Dialog>
	)
}

export default ExtendConfirm;