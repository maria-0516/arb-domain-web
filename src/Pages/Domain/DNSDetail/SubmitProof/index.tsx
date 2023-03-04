import React from "react";

import './proof.scss';
import gray_polygon from '../../../../assets/arb//img/gray-polygon.svg';
// import green_polygon from '../../../../assets/arb//img/green-polygon.svg';
import arrow_img from '../../../../assets/arb//img/arrow.svg';
// import Icon from "../../../../components/Icon";

const SubmitProof = () => {
	return (
		<div>
			<div className="second-part">
				<div className='img-region'>
					<p className='num-text gray'>3</p>
					<img src={gray_polygon} alt="polygon" className='polygon-img' />
				</div>
				<div>
					<p className="step-title gray">You are the owner of this address. Add your domain to the ENS Registry now.</p>
					<p className="step-text gray">
					The address that appears in the DNS txt record is your same address.
					</p>
				</div>
			</div>
			<div className="third-part">
				<div className="d-row center middle" style={{gap: 5}}>
					<p className="owner-text">DNS Owner</p>
					<button className="owner-btn">You</button>
				</div>
				<div className="d-row center middle">
					<p className="address-text">0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</p>
				</div>
			</div>
			<div className="forth-part">
				<div className="d-row center middle" style={{gap: 10}}>
					<a href="/" className="d-row center middle" style={{gap: 5}}>
						<p className="purple-text">Learn More</p>
						<img src={arrow_img} alt="arrow" />
					</a>
					<button className="register-btn" style={{textTransform:'none'}}>Register</button>
				</div>
			</div>
		</div>
	)
}

export default SubmitProof;