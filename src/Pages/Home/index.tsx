import React from 'react';
import { Link/* , useNavigate */ } from 'react-router-dom';
import Slider, {Settings as SliderSettings} from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './home.scss';
import '../hamburger.scss';
import /* useStore,  */{ config/* , ellipsis, NF, now, prettyFormat, toKillo, zeroAddress  */} from '../../useStore'
import Icon from '../../components/Icon';
import logo from '../../assets/neon/img/logo.svg';
import wave_1 from '../../assets/neon/img/wave-1.svg';
import wave_2 from '../../assets/neon/img/wave-2.svg';
import wave_3 from '../../assets/neon/img/wave-3.svg';
import wave_4 from '../../assets/neon/img/wave-4.svg';
import wave_5 from '../../assets/neon/img/wave-5.svg';
import header_1 from '../../assets/neon/img/header-1.png';
import header_2 from '../../assets/neon/img/header-2.png';
import header_3 from '../../assets/neon/img/header-3.png';
import neon from '../../assets/neon/img/neon.png';
import group from '../../assets/neon/img/group.png';
import group2 from '../../assets/neon/img/group2.png';
import app from '../../assets/neon/img/app.png';
import app_1 from '../../assets/neon/img/app-1.png';
import app_2 from '../../assets/neon/img/app-2.png';
import app_3 from '../../assets/neon/img/app-3.png';
import app_4 from '../../assets/neon/img/app-4.png';
import app_5 from '../../assets/neon/img/app-5.png';
import browser from '../../assets/neon/img/browser.png';
import browser_1 from '../../assets/neon/img/browser-1.png';
import browser_2 from '../../assets/neon/img/browser-2.png';
import browser_3 from '../../assets/neon/img/browser-3.png';
import browser_4 from '../../assets/neon/img/browser-4.png';
import browser_5 from '../../assets/neon/img/browser-5.png';
import wallet from '../../assets/neon/img/wallet.png';
import wallet_1 from '../../assets/neon/img/wallet-1.png';
import wallet_2 from '../../assets/neon/img/wallet-2.png';
import wallet_3 from '../../assets/neon/img/wallet-3.png';
import wallet_4 from '../../assets/neon/img/wallet-4.png';
import wallet_5 from '../../assets/neon/img/wallet-5.png';
import dark_logo from '../../assets/neon/img/dark-logo.svg';
import slider_1 from '../../assets/neon/img/slider-1.png';
import slider_2 from '../../assets/neon/img/slider-2.png';
import slider_3 from '../../assets/neon/img/slider-3.png';
import slider_4 from '../../assets/neon/img/slider-4.png';
import main_img from '../../assets/neon/img/main.png';

const LinkItem = ({url, className, text}: {url: string, className: string, text: string}) => {
	return (
		url[0]==='/' ? (
			<Link to={url} className={className}>{text}</Link>
		) : (
			<a href={url} className={className}>{text}</a>
		)
	)
}

const Home = () => {
	
	// const navigate = useNavigate();

	const walletText = ['coinbase', 'coinbase wallet', 'rainbow', 'trust wallet', 'mycrypto'];
	const appText = ['uniswap', 'etherscan', 'showtime', 'opensea', 'aave'];
	const browserText = ['coinbase wallet extension', 'brave', 'metamask extension', 'statu', 'cloudfare'];
	const appImg = [app_1, app_2, app_3, app_4, app_5];
	const walletImg = [wallet_1, wallet_2, wallet_3, wallet_4, wallet_5];
	const browserImg = [browser_1, browser_2, browser_3, browser_4, browser_5];

	const [sliderIndex, setSliderIndex] = React.useState(0);

	const settings = {
		autoPlay: true,
		centerMode: true,
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1.7,
		slidesToScroll: 1,
		appendDots: (dots) => <ul style={{margin: 10}}>{dots}</ul>,
		
		beforeChange: (prev: any, next: any) => {   // here to detect slide change
			setSliderIndex(next);
		},
		customPaging: (index) => {
			const style = {
			  width: 29,
			  height: 4,
			  display: "inline-block",
			  backgroundColor: 'rgba(255,255,255,0.15)',
			  borderRadius: '5px',
			  margin: '0 10px'
			};
			const activeStyle = {
			  width: 29,
			  height: 4,
			  display: "inline-block",
			  backgroundColor: '#2FF2FF',
			  borderRadius: '5px',
			  margin: '0 10px'
			};
			return (
			  <span className="slick-dot" style={index === sliderIndex ? activeStyle : style} />
			);
		},
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 1.7,
					slidesToScroll: 1,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					initialSlide: 2
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		  ]
	} as Partial<SliderSettings>;

	return (
		<div className='home scroll'>
			<div className='main'>
				<div className='background'>
					<div className='foreground'></div>
					<div className='relative first-part'>
						<div style={{zIndex:3}}>
							<img src={wave_1} alt="wave" className='absolute-img' style={{top:0}} />
							<header className={`section-align`}>
								<div>
									<Link to="/"><img src={logo} alt="logo" /></Link>
								</div>
								<div className='d-row center'>
									<LinkItem url={config.links.governance} className="header-link" text="GOVERNANCE"/>
									<LinkItem url={config.links.community} className="header-link" text="COMMUNITY"/>
									<LinkItem url={config.links.team} className="header-link" text="TEAM"/>
									<LinkItem url={config.links.jobs} className="header-link" text="JOBS"/>
									<LinkItem url={config.links.docs} className="header-link" text="DOCS"/>
								</div>
								<div className='d-row middle gap1'>
									<a href={config.links.medium} className="img-btn-white"><Icon icon="Medium" /></a>
									<a href={config.links.twitter} className="img-btn-white"><Icon icon="Twitter" /></a>
									<a href={config.links.discord} className="img-btn-white"><Icon icon="Discord" /></a>
									<a href={config.links.telegram} className="img-btn-white"><Icon icon="Telegram" /></a>
									<Link to='/app' className='app-btn'>Go to app</Link>
								</div>
							</header>
							<div className="hamburger">
								<div style={{display: 'inline-block'}}>
									<div style={{display: 'flex', gap: '2em', alignItems: 'center'}}>
										<Link to="/"><img src={dark_logo} alt="logo" className='logo' /></Link>
										<div style={{flex: 1}}>
											<Link to='/app' className='app-btn'>Go to app</Link>
										</div>
									</div>
									
								</div>
								<input style={{display: 'none'}} type="checkbox" id="__hamburger" />
								<label htmlFor="__hamburger">
									<span></span>
								</label>
								<ul>
									<li><LinkItem url={config.links.governance} className="header-link text-dark" text="GOVERNANCE"/></li>
									<li><LinkItem url={config.links.community} className="header-link text-dark" text="COMMUNITY"/></li>
									<li><LinkItem url={config.links.team} className="header-link text-dark" text="TEAM"/></li>
									<li><LinkItem url={config.links.jobs} className="header-link text-dark" text="JOBS"/></li>
									<li><LinkItem url={config.links.docs} className="header-link text-dark" text="DOCS"/></li>
								</ul>
							</div>
							<section className='section-margin d-flex flex-wrap section-align center top-text'>
								<div className='col-lg-7 col-md-12 col-sm-12' style={{padding:'0 30px'}}>
									<p className='h1 text-white'>DECENTRALIZED</p>
									<p className='h1 text-white'>NAMING FOR</p>
									<p className='h1 text-blue'>WALLETS,</p>
									<p className='h1 text-blue'>WEBSITES & MORE</p>
									<div className='icon-box'>
										<Link to="/app">
											<div className='d-column middle' style={{cursor:'pointer'}}>
												<img src={header_1} alt="header-1" className='top-icon' />
												<p className='text-white white-hover uppercase' style={{fontSize:'12px',marginTop:'10px'}}>search</p>
											</div>
										</Link>
										<Link to='/new-register' >
											<div className='d-column middle' style={{cursor:'pointer'}}>
												<img src={header_2} alt="header-2" className='top-icon' />
												<p className='text-white white-hover uppercase' style={{fontSize:'12px',marginTop:'10px'}}>register</p>
											</div>
										</Link>
										<Link to='/' >
											<div className='d-column middle' style={{cursor:'pointer'}}>
												<img src={header_3} alt="header-3" className='top-icon' />
												<p className='text-white white-hover uppercase' style={{fontSize:'12px',marginTop:'10px'}}>manage</p>
											</div>
										</Link>
									</div>
								</div>
								<div className='col-lg-5 col-md-12 col-sm-12 d-flex top-box'>
									<img src={main_img} alt="main" style={{width: '100%',zIndex: 2}} />
								</div>
							</section>	
						</div>	
					</div>
					<div className='relative'>
						<img src={wave_2} alt="wave" className='absolute-img' />
						<div className='slider-back'>
							<section className='slider'>
								<Slider {...settings}>
									<div><img src={slider_1} alt="slider-1" className='slider-img' /></div>
									<div><img src={slider_2} alt="slider-2" className='slider-img' /></div>
									<div><img src={slider_3} alt="slider-3" className='slider-img' /></div>
									<div><img src={slider_4} alt="slider-4" className='slider-img' /></div>
								</Slider>
							</section>	
						</div>
						<section className='d-row center middle section-align username'>
							<div className='username-box'>
								<p className='username-letter'>YOUR WEB3 USERNAME</p>
								<input type="text" className='username-input' placeholder='john.neon' />
								<div className='username-detail'>
									<p style={{textAlign:'center'}}>No more sandboxed usernames. Own your username, store an avatar and other profile data, and use it across services</p>
								</div>
								<img src={neon} alt="neon" className='username-symbol' />
							</div>
						</section>
						<section className='blockchain'>
							<div>
								<p className='letter'>NNS is the most widely integrated</p>
								<p className='letter'>blockchain naming standard</p>
							</div>
							<div className='row center' style={{gap:'2em'}}>
								<div className='item'>
									<p className='big'>262m</p>
									<p className='small'>NAMES</p>
								</div>
								<div className='item'>
									<p className='big'>507</p>
									<p className='small'>INTEGRATIONS</p>
								</div>
								<div className='item'>
									<p className='big'>573</p>
									<p className='small'>OWNERS</p>
								</div>
							</div>
						</section>
					</div>
					<div className='relative'>
						<img src={wave_3} alt="wave" className='absolute-img' />
						<section className='half section-align md-pb-0'>
							<div className='col-lg-6 col-md-12'>
								<p className='title'>ONE NAME FOR ALL OF YOUR ADDRESSES</p>
								<p className='detail'>No more copying and pasting long addresses. Use your NNS name to store all of your addresses and receive any cryptocurrency, token, or NFT.</p>
							</div>
							<div className='col-lg-6 col-md-12 group'>
								<img src={group} alt="group" className='group-img'/>
							</div>
						</section>
						<section className='half section-align md-pt-0'>
							<div className='col-lg-6 col-md-12 group2'>
								<img src={group2} alt="group2" className='group2-img'/>
							</div>
							<div className='col-lg-6 col-md-12 center'>
								<p className='title'>DECENTRALIZED WEBSITES</p>
								<p className='detail'>Launch censorship-resistant decentralized websites with ENS. Upload your website to IPFS and access it with your ENS name.</p>
							</div>
						</section>
					</div>
					<div className='relative'>
						<img src={wave_4} alt="wave-4" className='absolute-img' />
						<section className='white'>
							<p className='title'>USE TRADITIONAL DOMAINS</p>
							<p className='detail'>The native suffix for NNS is .ARB which has the full security benefits of being blockchain-native.</p>
							<div style={{backgroundColor:'rgba(246, 245, 255, 1)',padding:'10px 20px'}}>
								<p className='medium'>.com .org .69 .io .xyz .app .art</p>
							</div>
							<p className='detail'>You can also use ENS with DNS names you already own. ENS supports most DNS names, including:</p>
						</section>
					</div>
					<div className='relative d-column center middle' style={{zIndex:11}}>
						<img src={wave_5} alt="wave-5" className='absolute-img' />
						<section className='bottom'>
							<p className='title'>NNS ECOSYSTEM</p>
							<div className='sys-group'>
								<div className='d-column center middle area'>
									<img src={wallet} alt="wallet" style={{width:50}} />
									<p className='white-text'>wallet</p>
									<div className='d-column center white-box'>
										<div className='d-row around'>
											{
												walletImg.map((i, k) => (
													<div key={k} className='d-row'>
														<div className='item'>
															<img src={i} alt="wallet" style={{width:44,height:44}} />
															<p className='dark-text'>{walletText[k]}</p>
														</div>
													</div>
												))
											}
										</div>
										<p className='pink-text'>see more</p>
									</div>
								</div>
								<div className='d-column center middle area'>
									<img src={app} alt="app" style={{width:50}} />
									<p className='white-text'>app</p>
									<div className='d-column center white-box'>
										<div className='d-row around'>
											{
												appImg.map((i, k) => (
													<div key={k} className='d-row'>
														<div className='item'>
															<img src={i} alt="app" style={{width:44,height:44}} />
															<p className='dark-text'>{appText[k]}</p>
														</div>
													</div>
												))
											}
										</div>
										<p className='pink-text'>see more</p>
									</div>
								</div>
								<div className='d-column center middle area'>
									<img src={browser} alt="browser" style={{width:50}} />
									<p className='white-text'>browser</p>
									<div className='d-column center white-box'>
										<div className='d-row around'>
											{
												browserImg.map((i, k) => (
													<div key={k} className='d-row'>
														<div className='item'>
															<img src={i} alt="browser" style={{width:44,height:44}} />
															<p className='dark-text'>{browserText[k]}</p>
														</div>
													</div>
												))
											}
										</div>
										<p className='pink-text'>see more</p>
									</div>
								</div>
							</div>
							<div className='hr'></div>
							<p className='title'>GET INVOLVED</p>
							<div className='row center'>
								<div className='bottom-text'>
									<p className='white-text'>Subscribe to our mailing list</p>
									<p className='blue-text'>Subscribe</p>
								</div>
								<div className='bottom-text'>
									<p className='white-text'>Join our Discord community</p>
									<p className='blue-text'>Join Discord</p>
								</div>
								<div className='bottom-text'>
									<p className='white-text'>Discuss on our forum</p>
									<p className='blue-text'>Discuss</p>
								</div>
								<div className='bottom-text'>
									<p className='white-text'>Read our documentation</p>
									<p className='blue-text'>Read docs</p>
								</div>
							</div>
						</section>
						<footer>
							<div className='text-order'>
								<p className='text'>Copyright © 2022. <b>NeonLink</b></p>
								<p className='text'>Powered by <b>NeonLink. </b>All Rights Reserved</p>
							</div>
							<Link to="/"><img src={dark_logo} alt="logo" className='footer-logo' /></Link>
							<div className='d-row gap1'>
								<a href={config.links.medium} className='img-btn'><Icon icon="Medium" /></a>
								<a href={config.links.twitter} className='img-btn'><Icon icon="Twitter" /></a>
								<a href={config.links.discord} className='img-btn'><Icon icon="Discord" /></a>
								<a href={config.links.telegram} className='img-btn'><Icon icon="Telegram" /></a>
							</div>
						</footer>
					</div>
				</div>
			</div>
		</div >
	)
};

export default Home;