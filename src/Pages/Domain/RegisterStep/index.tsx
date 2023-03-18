/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
// import { Link } from 'react-router-dom';
import Progress from 'react-progressbar';

import './progress.scss';
// import bell from '../../../assets/neon/img/bell.svg';
import gray_polygon from '../../../assets/neon/img/gray-polygon.svg';
import green_polygon from '../../../assets/neon/img/green-polygon.svg';
import bag from '../../../assets/neon/img/bag.svg';
import logo from '../../../assets/neon/img/logo.svg';
import useStore, { now, tips } from '../../../useStore';
import useWallet from '../../../useWallet';
import { abis, Contracts, getLimitTime } from '../../../lib/ENSLib';
import { useNavigate } from 'react-router';
import { ethers } from 'ethers';
import Icon from '../../../components/Icon';

interface RegisterStepProps {
	domain: string
	stepTime: number
}

const RegisterStep = ({domain, stepTime}: RegisterStepProps) => {
	const navigator = useNavigate()
	const {favorites, reg, update} = useStore();
	const wallet = useWallet();
	const [progressValue, setProgressValue] = React.useState(33);

	const onSubmit = async () => {
		update({loading: true})
		try {
			if (wallet.library && reg.commitment && reg.params) {
				const {_min, _max} = await getLimitTime(reg.commitment);
				if ((now() - reg.timestamp) > _max) {
					update({loading: false, reg: {...reg, commitment: '', params: []}})
				} else if ((now() - reg.timestamp) > _min) {
					const signer = wallet.library.getSigner();
					// const value = ethers.utils.parseEther(String(reg.price * 1.1));
					const ethRegistrarController = new ethers.Contract(Contracts.ethRegistrarController, abis.controller, signer);
					console.log("reg.params", reg.params)
					const tx = await ethRegistrarController.register(...reg.params);
					await tx.wait();
					update({loading: false, reg: {...reg, commitment: '', params: [], timestamp: 0}})
					navigator(`/name/${domain}`)
					return
				} else {
					tips("Please wait for minimum commitment time.")    
				}
			} else {
				update({loading: false})
				tips("Caused unexpected error")
			}
		} catch (error: any) {
			if (error.code==='ACTION_REJECTED' || error.code===4001) {
				tips("The registeration operation was canceled.")
			} else {
				tips(error.reason)
			}
			console.log(error)
			update({loading: false})
		}
	}

	React.useEffect(() => {
		let value = progressValue;
		if (value === 100) return;
		else value++;
		const timer = setTimeout(() => setProgressValue(value), stepTime / 67);
		return () => clearTimeout(timer);
	}, [progressValue])
	return (
		<div className='register-progress'>
			<div className='main-part'>
				{/* <div className="btn-area">
					<button className="notify-btn d-row center middle" style={{gap: 5}}>
						<img src={bell} alt="bell" />
						NOTIFY ME
					</button>
				</div> */}
				<div className="d-row middle" style={{gap: 5}}>
					<p className="name-text">{domain}</p>
					<i className="heart">
						<Icon size={24} icon={domain && favorites[domain.slice(0, domain.lastIndexOf('.'))] ? 'HeartFill' : 'Heart'} />
					</i>
				</div>
				<div className="third">
					<div className="d-column center middle">
						<p className="calc-text">You’ll be able manage your name soon.</p>
						<p className="s-calc-text">*Favorite the name for easy access in case you close out of your browser.</p>
					</div>
					<div className="step-area">
						<div className="step-item">
							<div className='img-region'>
								<p className={`num-text ${progressValue > 33 ? 'white' : 'gray'}`}>1</p>
								<img src={progressValue > 33 ? green_polygon: gray_polygon} alt="polygon" className='polygon-img' />
							</div>
							<div>
								<p className="step-title">REQUEST TO REGISTER</p>
								<p className="step-text">
									Your wallet will open and you will be asked to confirm the first two transactions required for registration. If the second transaction is not processed within 7 days of the first, you will need to start again from step 1.
								</p>
							</div>
						</div>
						<div className="v-line"></div>
						<div className="step-item">
							<div className='img-region'>
								<p className={`num-text ${progressValue > 66 ? 'white' : 'gray'}`}>2</p>
								<img src={progressValue > 66 ? green_polygon: gray_polygon} alt="polygon" className='polygon-img' />
							</div>
							<div>
								<p className="step-title">WAIT A MINUTE</p>
								<p className="step-text">
									The waiting period is required to ensure another person hasn’t tried to register the same name and protect you after your request.
								</p>
							</div>
						</div>
						<div className="v-line"></div>
						<div className="step-item">
							<div className='img-region'>
								<p className={`num-text ${progressValue > 99 ? 'white' : 'gray'}`}>3</p>
								<img src={progressValue > 99 ? green_polygon: gray_polygon} alt="polygon" className='polygon-img' />
							</div>
							<div>
								<p className="step-title">COMPLETE REGISTRATION</p>
								<p className="step-text">
									Click “register” and your wallet will re-open. Only ater the 2nd transaction is confirmed you’ll know if you got the name.
								</p>
							</div>
						</div>
					</div>
				</div>
				<Progress completed={progressValue} className="progress-bar" />
				<div className={`bottom-part ${progressValue === 100 ? '' : 'hidden'}`}>
					{/* <div className='d-row center middle' style={{gap: 5}}>
						<p className='purple-text tooltip'>
							READ ME
							<p className='tooltiptext'>
								<ul>
									<li>Email</li>
									<li>Google</li>
									<li>iCal</li>
								</ul>
							</p>
						</p>
						<img src={bag} alt="bag" />
					</div> */}
					<p className='purple-text'>MANAGE NAME</p>
					<button onClick={onSubmit} className='purple-btn'>SET AS PRIMARY ENS NAME</button>
				</div>
			</div>
		</div>
	)
}

export default RegisterStep;