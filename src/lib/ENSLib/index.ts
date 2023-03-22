// import { EtherscanProvider } from '@ethersproject/providers';
import { ethers } from 'ethers'
// import namehash from '@deamtest/ens-namehash'
import {N, provider, providerEth, zeroAddress} from '../../useStore';
import abiDeamNameWrapper from './abis/DeamNameWrapper.json';
import abiController from './abis/ETHRegistrarController.json';
import abiDummyOracle from './abis/DummyOracle.json';
import abiPublicResolver from './abis/PublicResolver.json';
import abiNameWrapper from './abis/NameWrapper.json';
import abiReverseRegistrar from './abis/ReverseRegistrar.json';
import abiDeamEtherVaults from './abis/DeamEtherVaults.json'
import contracts from './contracts.json';
import namehash from '../namehash';
// import { formatEthers } from '../utils';

// const DAYS = 86400
// const REGISTRATION_TIME = 28 * DAYS
// const MAX_EXPIRY = Math.round(new Date().getTime() / 1000) + 86400 * 366 //2n ** 64n - 1n
// const secret = '0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF'
export const Contracts = contracts 

export const abis = {
	deamNameWrapper: abiDeamNameWrapper,
	controller: abiController,
	dummyOracle: abiDummyOracle,
	nameWrapper: abiNameWrapper,
	publicResolver: abiPublicResolver,
	reverseRegistrar: abiReverseRegistrar,
	deamEtherVaults: abiDeamEtherVaults
}


export const iNameWrapper = new ethers.utils.Interface([
	"function getExtendedPrices (string[] memory _names, uint duration) public view returns (uint _basePrice, uint _premiumPrice, uint _etherPrice)",
])

export const iRegistrar = new ethers.utils.Interface([
	"function getPrice(string memory name, uint256 duration) public view returns (uint price)",
	"function getPriceAsUSD(string memory name, uint256 duration) public view returns (uint price)",
])

const abiEtherVaults = [
	"function getPrice(string memory _label, uint _duration, bool _asUsd) public view returns (uint _price)",
	"function getExtendedPrices(string[] memory _labels, uint _duration, bool _asUsd) public view returns (uint _price)"
]
export const iEtherVaults = new ethers.utils.Interface(abiEtherVaults)
// export const deamEtherVaults = new ethers.Contract(contracts.ethereum.deamVaults, abiEtherVaults, providerEth); 

// export const ifaceSfc = new ethers.Interface(abiSFC);

const publicResolver = new ethers.Contract(contracts.publicResolver, abiPublicResolver, provider);
const deamNameWrapper = new ethers.Contract(contracts.deamNameWrapper, abiDeamNameWrapper, provider);
const ethRegistrarController = new ethers.Contract(contracts.ethRegistrarController, abiController, provider);
const dummyOracle = new ethers.Contract(contracts.dummyOracle, abiDummyOracle, provider); 
// const deamEtherVaults = new ethers.Contract(contracts.ethereum.deamVaults, abiDeamEtherVaults, providerEth); 


// const publicResolver = new ethers.Contract(contracts.publicResolver, abiPublicResolver, provider);

// const bytesToHex = (text: string) => ('0x' + Array.from(new TextEncoder().encode(text), byte => byte.toString(16).padStart(2, "0")).join(""));
const hexToString = (hex: string) => hex.slice(2).match(/.{1,2}/g)?.map(v=>String.fromCharCode(parseInt(v, 16))).join('') || '';

export const getDomainByAddress = async (address: string, isRegistrant: boolean, page: number, pageCount: number) => {
	try {
		const {_currentPage, _totalPage, _infos} = await deamNameWrapper[isRegistrant ? 'asRegistrant' : 'asController'](address, page, pageCount);
		return {
			page: _currentPage.toNumber(),
			total: _totalPage.toNumber(),
			data: _infos.map(i=>({label: i.label, expire: i.expires.toNumber()})).sort((a, b)=>(a.expire===0 && b.expire===0 ? -1e12 : b.expire - a.expire))
		}
	} catch (error) {
		console.log(error);
	}
	return null;
}

// export const getDomainByName = async (name: string) => {
// 	try {
// 		// await new Promise(resolve=>setTimeout(resolve, 5000));
// 		const p = name.lastIndexOf('.');
// 		const parent = name.slice(p);
// 		const _name = name.slice(0, p);
// 		// const _root = name.slice(p);
// 		// if (_root===root) return null;
// 		const { _owner, _initialOwner, _expire, _resolver, _contentHash, _texts, _prices} = await deamNameWrapper.byName(_name);
		
// 		const basePrice = N(_prices.basePrice)
// 		const premiumPrice = N(_prices.premiumPrice)
// 		const etherPrice = N(_prices.etherPrice, 8)
// 		if (_initialOwner!==zeroAddress) {
// 			let k = 0;
// 			return {
// 				data: {
// 					name,
// 					parent, 
// 					owner: _owner,
// 					registrant: _initialOwner,
// 					expire: _expire.toNumber(),
// 					resolver: _resolver,
// 					contentHash: hexToString(_contentHash),
// 					snapshot: _texts[k++],
// 					url: _texts[k++],
// 					avatar: _texts[k++],
// 					comTwitter: _texts[k++],
// 					comGithub: _texts[k++],
// 					email: _texts[k++],
// 					description: _texts[k++],
// 					notice: _texts[k++],
// 					keywords: _texts[k++],
// 					comDiscord: _texts[k++],
// 					comReddit: _texts[k++],
// 					orgTelegram: _texts[k++],
// 					neonDelegate: _texts[k++]
// 				},
// 				prices: {
// 					basePrice, 
// 					premiumPrice, 
// 					etherPrice
// 				}
// 			}
// 		} else {
			
// 			return {
// 				prices: {
// 					basePrice, 
// 					premiumPrice, 
// 					etherPrice
// 				}
// 			}
// 		}
// 	} catch (error) {
// 		console.log(error)
// 	}
// 	return null
// }

export const getPrice = async (domain: string, duration: number) => {
	// await new Promise(resolve => setTimeout(resolve, 500));
	const {base, premium} = await ethRegistrarController.rentPrice(domain, '0x' + duration.toString(16));
	if (base && premium) {
		const basePrice = N(base)
		const premiumPrice = N(premium)
		return {basePrice, premiumPrice};
	}
}

export const getEtherPrice = async () => {
	await new Promise(resolve => setTimeout(resolve, 500));
	const price = await dummyOracle.latestAnswer();
	return N(price, 8);
}

// export const makeCommitment = async (name: string, ownerAddress: string, data: []) => {
//     const params = [
// 		name,
// 		ownerAddress,
// 		REGISTRATION_TIME,
// 		secret,
// 		contracts.publicResolver,
// 		data,
// 		false,
// 		0,
// 		MAX_EXPIRY,
// 	];

//     const commitment = await ethRegistrarController.makeCommitment(...params)
// 	let tx = await ethRegistrarController.commit(commitment)
// 	await tx.wait();
// }

export const isExistCommitment = () => {

}

/**
 * return gas price as GWEI
 */
export const getGasPrice = async () => {
	const price = await provider.getGasPrice()
	return N(price, 9)
}

export const getCommitment = async (name: string, owner: string, duration: number, secret: string, resolver: string, data: string[], reverseRecord: boolean, fuses: number, wrapperExpiry: number) => {
	const hash = await ethRegistrarController.makeCommitment(
		name,
		owner,
		duration,
		secret,
		resolver,
		data,
		reverseRecord,
		fuses,
		wrapperExpiry
	);
	return hash;
}

export const getLimitTime = async (hash: string) => {
	const r = await deamNameWrapper.getLimitTime(hash)
	return {_timestamp: r._timestamp, _min: r._min.toNumber(), _max: r._max.toNumber()} 
}

export const getExtendedPrices = async (name: string[]) => {
	const response = await deamNameWrapper.getExtendedPrices(name);
	const { _basePrice, _premiumPrice, _etherPrice} = response;
	return {_basePrice: N(_basePrice), _premiumPrice: N(_premiumPrice), _etherPrice: N(_etherPrice, 8)};
}

export const getSubdomains = async (domain: string) => {
	return await deamNameWrapper.subdomains(namehash.hash(domain));
}
export const getExpires = async (domains: string[]) => {
	const _ds = domains.filter(i=>i.indexOf('.')===-1);
	if (_ds.length) {
		const _ex = await deamNameWrapper.getExpires(_ds);
		const _rs = {} as {[label: string]: number};
		for (let k = 0; k < _ds.length; k++) {
			_rs[_ds[k]] = _ex[k].toNumber();
		}
		return domains.map(i=>(_rs[i] || 0))
	}
	return Array(domains.length).fill(0);
}

export const getPrimaryDomain = async (address: string) => {
	return await publicResolver.name(namehash.reverseNode(address));
}

export const getDomainInfo = async (domain: string) => {
	
	// await new Promise(resolve=>setTimeout(() => resolve, 100000))

	const p = domain.indexOf('.');
	const label = domain.slice(0, p);
	const isSecondLevel = domain.slice(p + 1).indexOf('.')===-1;
	// const _labelhash = namehash.keccak256(label)
	const _domainhash = namehash.hash(domain)
	const d = await deamNameWrapper.getDomainInfo(label, _domainhash, isSecondLevel);
	return {
		data: {
			name: domain,
			parent: domain.slice(p+1),
			owner: d._accounts[0],
			registrant: d._accounts[1],
			expire: d._expire,
			resolver: d._accounts[2],
			contentHash: hexToString(d._contentHash),
			texts: Object.fromEntries(d._texts)
		},
		prices: {
			basePrice: N(d._prices[0] || 0),
			premiumPrice: N(d._prices[1] || 0),
			etherPrice: N(d._prices[2] || 0, 8 || 0),
		},
		subs: d._subs,
	}
}

// export const getEtherDomainPrice = async (label: string, duration: number, asUsd: boolean) => {
// 	return await deamEtherVaults.getPrice(label, duration, asUsd);
// }

// export const getEtherExtendDomainsPrice = async (label: string[], duration: number, asUsd: boolean) => {
// 	return await deamEtherVaults.getExtendedPrices(label, duration, asUsd);
// }
