import React from "react";

import './dnsdetail.scss';
import Icon from "../../../components/Icon";
import DNSSec from "./DNSSec";
import AddText from './AddText';
import SubmitProof from "./SubmitProof";
import ConnectButton from "../../../components/ConnectButton";

const links = [ <DNSSec/>, <AddText/>, <SubmitProof/> ];

const DNSDetail = () => {

	const [currentPage/* , setCurrentPage */] = React.useState(2);

	return (
		<div className="dns-detail">
			<div className="main">
				<div className="first-part">
					<div className="item">
						<Icon icon="CircleCheck" className={`check-icon ${currentPage === 0 ? 'black' : `${currentPage > 0 ? 'green' : 'gray'}`}`} />
						<p className={`item-text ${currentPage === 0 ? 'black' : `${currentPage > 0 ? 'green' : 'gray'}`}`}>ENABLE DNSSEC</p>
					</div>
					<div className="v-line"></div>
					<div className="item">
						<Icon icon="CircleCheck" className={`check-icon ${currentPage === 1 ? 'black' : `${currentPage > 1 ? 'green' : 'gray'}`}`} />
						<p className={`item-text ${currentPage === 1 ? 'black' : `${currentPage > 1 ? 'green' : 'gray'}`}`}>ADD TEXT</p>
					</div>
					<div className="v-line"></div>
					<div className="item">
						<Icon icon="CircleCheck" className={`check-icon ${currentPage === 2 ? 'black' : `${currentPage > 2 ? 'green' : 'gray'}`}`} />
						<p className={`item-text ${currentPage === 2 ? 'black' : `${currentPage > 2 ? 'green' : 'gray'}`}`}>SUBMIT PROOF</p>
					</div>
					<div className="v-line"></div>
					<div className="item">
						<Icon icon="CircleCheck" className={`check-icon ${currentPage === 3 ? 'black' : `${currentPage > 3 ? 'green' : 'gray'}`}`} />
						<p className={`item-text ${currentPage === 3 ? 'black' : `${currentPage > 3 ? 'green' : 'gray'}`}`}>MANAGE NAME</p>
					</div>
				</div>
				{
					links[currentPage]
				}
			</div>
			<div className="sub-footer d-column center middle">
				<ConnectButton />
			</div>
		</div>
	)
}

export default DNSDetail;