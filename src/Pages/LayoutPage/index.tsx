import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import './layoutPage.scss';
import SearchInput from "../../components/SearchInput";
import logo from '../../assets/neon/img/logo.svg';
import Loading from "../../components/Loading";
import useStore, { config, tips } from "../../useStore";
import { validAddress, validDomainName } from "../../lib/utils";
import ConnectButton from "../../components/ConnectButton";

const LayoutPage = (LayoutProps: any) => {
	const {connectedWallet, loading} = useStore();
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
						// if (x.length===2 && x[0].length < 3) {
						// 	tips("Domain name should be 3 characters at least.")
						// } else {
							navigate(`/name/${domain}`);
							if (domain !== label) setQuery(domain)
						// }
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
		<div className="layout">
			<div className="back">
				<div className='header'>
					<div className='container d-row between middle' style={{height: '7em'}}>
						<Link to="/"><img src={logo} alt="logo" style={{width: '64px', height:  '64px'}} /></Link>
						<div className='d-row center middle' style={{gap: '3em'}}>
							{connectedWallet.connected && <Link to={`/address/${connectedWallet.address}/controller`}>MY ACCOUNT</Link>}
							<Link to='/favorites'>FAVORITES</Link>
							<Link to='/faq'>FAQ</Link>
							<Link to='/'>ABOUT</Link>
						</div>
						<ConnectButton theme="dark" />
					</div>
				</div>
				<div className="hamburger">
					<Link to="/"><img src={logo} alt="logo" className='logo' style={{width: '64px', height:  '64px'}} /></Link>
					<input style={{display: 'none'}} type="checkbox" id="__hamburger" />
					<label htmlFor="__hamburger">
						<span></span>
					</label>
					<ul>
						{connectedWallet.connected && <li><Link to={`/address/${connectedWallet.address}`} className='header-link text-dark'>MY ACCOUNT</Link></li>}
						<li><Link to="/favorites" className='header-link text-dark'>FAVORITES</Link></li>
						<li><Link to="/faq" className='header-link text-dark'>FAQ</Link></li>
						<li><Link to="/" className='header-link text-dark'>ABOUT</Link></li>
					</ul>
				</div>
				<div className="mobile-region">
					<ConnectButton theme="dark" />
				</div>
				<div className="container">
					<div className="search-region">
						<div className="input-size">
							<SearchInput ref={refSearch} value={query} onChange={setQuery} onSubmit={onSubmit} />
						</div>
						<button className="sch-btn" onClick={onSubmit}>SEARCH</button>
					</div>
					<div className="main-region">
						<Outlet />
					</div>
				</div>
				<div className='footer d-row center middle'>
					@2022 NeonDomains - powered by NeonLink
				</div>
			</div>
			{loading && <Loading />}
		</div>
	)
}

export default LayoutPage;