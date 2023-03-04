import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../hamburger.scss';
import './home.scss';
import SearchInput from '../../components/SearchInput';
import logo from '../../assets/arb/img/logo.svg';
import app_main from '../../assets/arb/img/app-main.png';
// import dark_logo from '../../assets/arb/img/dark-logo.svg';
import { validAddress, validDomainName } from '../../lib/utils';
import ConnectButton from '../../components/ConnectButton';
import useStore, { config, tips } from '../../useStore';

const Home = () => {
	const {connectedWallet} = useStore()
	const navigate = useNavigate();
	const [query, setQuery] = React.useState('');
	const refSearch = React.useRef<HTMLInputElement>(null);

	const onSubmit = () => {
		const label = query.trim();
		if (label === '') {
			refSearch.current?.focus();
		} else {
			if (validAddress(label)) {
				navigate(`/address/${label}`);
			} else {
				let domain = label;
				if (label.indexOf('.') === -1) {
					domain = `${label}.${config.rootDomain}`
				}
				if (validDomainName(domain)) {
					const x = domain.split('.')
					if (x[x.length-1]===config.rootDomain) {
						if (x.length===2 && x[0].length < 3) {
							tips("Domain name should be 3 characters at least.")
						} else {
							navigate(`/name/${domain}`);
							if (domain !== label) setQuery(domain)
						}
					} else {
						tips(`Currently ${config.title} supports [${config.rootDomain}] only.`)
					}
				} else {
					tips("Please input valid domain name.")
					refSearch.current?.select();
					refSearch.current?.focus();
				}
			}
		}
	}
	
	return (
		<div className='home'>
			<div className='back'>
				<div className='header'>
					<div className='container border d-row between middle' style={{height: '7em'}}>
						<Link to="/"><img src={logo} alt="logo" width={512} height={512} className="logo-symbol" /></Link>
						<div className='d-row center middle' style={{gap: '3em'}}>
							{connectedWallet.connected && <Link to={`/address/${connectedWallet.address}`}>MY ACCOUNT</Link>}
							<Link to='/favorites'>FAVORITES</Link>
							<Link to='/faq'>FAQ</Link>
							<Link to='/'>ABOUT</Link>
						</div>
						<ConnectButton theme="dark" />
					</div>
				</div>
				<div className="hamburger">
					<Link to="/"><img src={logo} alt="logo" className='logo' /></Link>
					<input style={{display: 'none'}} type="checkbox" id="__hamburger" />
					<label htmlFor="__hamburger">
						<span></span>
					</label>
					<ul>
						{connectedWallet.connected && <li><a href="/account"><p className='header-link text-dark'>MY ACCOUNT</p></a></li>}
						<li><a href="/favorites"><p className='header-link text-dark'>FAVORITES</p></a></li>
						<li><a href="/faq"><p className='header-link text-dark'>FAQ</p></a></li>
						<li><a href="/"><p className='header-link text-dark'>ABOUT</p></a></li>
					</ul>
				</div>
				<div className='mobile-connect'>
					<ConnectButton theme="dark" />
				</div>
				<div className='main d-column center middle' style={{gap: 20, height: '100vh'}}>
					<div className='mobile-empty'></div>
					<img src={app_main} alt="main" />
					<p className='title'>ARB NAME SERVICE</p>
					<div className='input-area'>
						<SearchInput ref={refSearch} align="center" showIcon={false} value={query} onChange={setQuery} onSubmit={onSubmit} />
					</div>
					<button className='sch-btn' onClick={onSubmit}>Search</button>
				</div>
				<div className='footer d-row center middle'>
					<span>
						@2023 ARB - powered by <b>ARB</b>
					</span>
				</div>
			</div>
		</div>
	)
}

export default Home;