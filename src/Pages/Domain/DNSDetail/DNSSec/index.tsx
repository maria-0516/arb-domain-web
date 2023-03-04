import React from "react";

import gray_polygon from '../../../../assets/arb//img/gray-polygon.svg';
// import green_polygon from '../../../../assets/arb//img/green-polygon.svg';
import arrow_img from '../../../../assets/arb//img/arrow.svg';
import Icon from "../../../../components/Icon";

const DNSSec = () => {
	return (
		<div>
			<div className="second-part">
				<div className='img-region'>
					<p className='num-text gray'>1</p>
					<img src={gray_polygon} alt="polygon" className='polygon-img' />
				</div>
				<div>
					<p className="step-title gray">Visit your domain registrar to enable DNSSEC. Once enabled, click refresh to see if you can move to the next step.</p>
					<p className="step-text gray">
					Visit your domain registrar to enable DNSSEC. Once enabled, click refresh to see if you can move to the next step.
					</p>
				</div>
			</div>
			<div className="third-part">
				<div className="d-row center middle" style={{gap: 10}}>
					<Icon icon="Exclamation" className="exc-icon" />
					<p className="pink-text">Could not find a DNSKEY record to validate any RRSIG on TXT records for _ens.binance.com</p>
				</div>
				<div className="d-row center middle" style={{gap: 10}}>
					<a href="/" className="d-row center middle" style={{gap: 5}}>
						<p className="purple-text">Learn More</p>
						<img src={arrow_img} alt="arrow" />
					</a>
					<button className="register-btn" style={{textTransform:'none'}}>Refresh</button>
				</div>
			</div>
		</div>
	)
}

export default DNSSec;