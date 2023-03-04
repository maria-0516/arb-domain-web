import React from "react";
// import { useParams } from "react-router-dom";

import './newRegister.scss';
import main_img from '../../../assets/arb/img/new-register.png';
import logo from '../../../assets/arb/img/logo.svg';
import ConnectButton from "../../../components/ConnectButton";
import Icon from "../../../components/Icon";
import useStore from "../../../useStore";

const ConnectRegister = ({domain}: {domain?: string}) => {
	const {loading, favorites} = useStore()
	return (
		<div className="new-register">
			<img src={logo} alt="logo" className="logo-img" />
			<div className="main-part d-column center middle" style={{gap: 10}}>
				{!!domain && (
					<div className="d-row middle" style={{gap: 5}}>
						<p className="name-text">{domain}</p>
						<i className="heart">
							<Icon size={24} icon={domain && favorites[domain.slice(0, domain.lastIndexOf('.'))] ? 'HeartFill' : 'Heart'} />
						</i>
					</div>
				)}
				
				<img src={main_img} alt="main" />
				{!!domain && <p className="domain-text">{loading ? `Getting [${domain}] information...` : `Domain available`}</p>}
				<div className="d-column middle center" style={{gap: 10}}>
					<p className="small-text">*No wallet connected. Please connect a wallet to continue.</p>
					<ConnectButton />
				</div>
			</div>
		</div>
	)
}

export default ConnectRegister;