import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
// import useWebSocket from 'react-use-websocket';
import { v4 as uuidv4 } from 'uuid';
import Config from './config/current.json'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import zh from 'javascript-time-ago/locale/zh.json'
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';


import DNSProver from './lib/DNSProver';

// import Networks from './config/networks.json'
// import TestnetNetworks from './config/networks.testnet.json'
TimeAgo.addLocale(en)
TimeAgo.addLocale(zh)

const timeAgos:{[key:string]:any} = {
	'en-US': new TimeAgo('en'),
	'zh-CN': new TimeAgo('zh'),
}

export const deamAppId = Number(process.env.REACT_APP_DEAM_ID || 0)
export const deamApiKey = process.env.REACT_APP_DEAM_KEY || ''

export const config = Config
export const zeroAddress = "0x0000000000000000000000000000000000000000"

export const provider = new ethers.providers.JsonRpcProvider(config.rpc);
export const providerEth = new ethers.providers.JsonRpcProvider(config.ethereum.rpc[0]);
export const dnsProver = DNSProver.create("https://cloudflare-dns.com/dns-query")

const locales = {
	"en-US": require('./locales/en-US.json'),
	"zh-CN": require('./locales/zh-CN.json'),
} as {[lang: string]: {[key: string]: string}};

export const tips = (html:string) => {
	const timeout = 2000;
	toast(html, {
		position: "top-right",
		autoClose: timeout,
	})
}



export const encodeCall = (iface: ethers.utils.Interface, contract:string, method: string, values: any[], id: number) => {
	return {jsonrpc: "2.0", method: "eth_call", params: [{to: contract, data: iface.encodeFunctionData(method, values)}, "latest"], id} as RpcRequestType
}

export const decodeCallData = (iface: ethers.utils.Interface, method: string, value: string) => {
	try {
		return iface.decodeFunctionResult(method, value)
	} catch (error) {
	}
	return null
}

export const getExpectedDomainPrice = (label: string, duration: number) => {
	const len = label.length
	const _duration = duration
	let _base = 0
	if (len===4) {
		_base = config.pricePolicy[3] * _duration;
	} else if (len===3) {
		_base = config.pricePolicy[2] * _duration;
	} else if (len===2) {
		_base = config.pricePolicy[1] * _duration;
	} else if (len===1) {
		_base = config.pricePolicy[0] * _duration;
	} else {
		_base = config.pricePolicy[4] * _duration;	
	}
	return Math.round(_base * 100) / 100
}

export const loadExternal = (key:string, uri: string):Promise<boolean> => {
	if (key && key in window) return Promise.resolve(true)
	return new Promise(resolve=>{
		const script = document.createElement("script");
		script.src = uri
		script.async = true;
		script.onload = ()=>resolve(true)
		document.body.appendChild(script);
	})
}

export const fetchGet = async (uri: string, params?: RpcRequestType|RpcRequestType[]) => {
	try {
		const response = await fetch(uri, {
			headers: {Accept: "application/json", "Content-Type": "application/json"},
		});
		return await response.json()
	} catch (error) {
		console.log(error)
	}
	return null
}

export const fetchJson = async (uri: string, params?: RpcRequestType|RpcRequestType[]) => {
	try {
		const response = await fetch(uri, {
			body: JSON.stringify(params),
			headers: {Accept: "application/json", "Content-Type": "application/json"},
			method: "POST"
		});
		return await response.json() as RpcResponseType|RpcResponseType[];	
	} catch (error) {
		console.log(error)
	}
	return null
}

export const N = (n: ethers.BigNumber|string, p = 18) => {
	if (n==='0x') return 0
	return Number(ethers.utils.formatUnits(n, p))
}
// export const N = (n: ethers.BigNumber|number, p: number = 18) => (Number(ethers.utils.formatUnits(typeof n==='number' ? ethers.BigNumber.from(Math.round(n)) : n, p)))
export const NF = (n: number, p: number = 4) => (n.toFixed(p).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))

export const toDate = (timestamp: number) => {
	const d = new Date(timestamp * 1e3)
	return [d.getMonth() + 1, d.getDate()].join('/')
}

export const toKillo = (n: number) => {
	return (Number(n) < 1000 ? String(n) : `${~~(Number(n)/1000)}k`)
}

export const ellipsis = (address: string, start?: number) => {
	if (!address) return ''
	const len = start || 10
	return address.length > len ? `${address.slice(0, start || 10)}...${address.slice(-4)}` : address
}

export const now = ()=> Math.round(+new Date().getTime() / 1e3)

export const isSolcVersionText = (version: string)=> (/^v\d{1,2}\.\d{1,2}\.\d{1,2}\+commit\.[0-9a-f]{8}$/.test(version))

export const validateAddress = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address)

export const isHex = (hex: string) => /^0x[a-f0-9A-F]+$/.test(hex)

export const validateEmail = (email: string) => email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) !== null;
export const validateUsername = (username: string) => /^[a-zA-Z0-9]{6,20}$/.test(username);
export const validateUrl = (url: string) => /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(url);

export const prettyFormat = (n:number, p: number=8)=>{
	const x = String(n.toFixed(p)).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",").split('.')
	return (
		<>
			<span>{x[0]}.</span>
			<span className='gray'>{x[1]}</span>
		</>
	)
}

export const prettyPrint = (elem: HTMLElement) => {
	loadExternal('PR', '/run_prettify.min.js').then(()=>window.PR.prettyPrint(null, elem))
}

const setDocumentCookie = () => {
	const cookie = uuidv4()
	document.cookie = `${config.appKey}=${cookie}; path=/; sameSite=true; expires=${new Date(+new Date() + 7 * 86400000).toUTCString()}`
	return cookie
}

export const copyToClipboard = (text:string) => {
	var textField = document.createElement('textarea')
	textField.innerText = text
	document.body.appendChild(textField)
	textField.select()
	document.execCommand('copy')
	textField.remove()
};

const getStore = (initialState: StoreObject) => {
	const _state = initialState as {[key: string]: any};
	try {
		let buf = window.localStorage.getItem(config.appKey)
		if (buf) {
			const json = JSON.parse(buf)
			for(let k in json ) {
				if (_state[k] !== undefined) {
					_state[k] = json[k] as any
				}
			}
		}
		buf = window.sessionStorage.getItem(config.appKey)
		if (buf) {
			const json = JSON.parse(buf)
			for(let k in json ) {
				if (_state[k] !== undefined) {
					_state[k] = json[k] as any
				}
			}
		}
		_state.loading = false
		if (_state.cookie==='') {
			_state.cookie = uuidv4()
		}
	} catch (err) {
		console.log(err)
	}
	return _state
}



const setStore = (state:any) => {
	let json = {} as any;
	try {
		let buf = window.localStorage.getItem(config.appKey)
		if (buf) json = JSON.parse(buf)
	} catch (error) {}
	window.localStorage.setItem(config.appKey, JSON.stringify({...json, ...state}))
}
const setSessionStore = (state:any) => {
	let json = {} as any;
	try {
		let buf = window.sessionStorage.getItem(config.appKey)
		if (buf) json = JSON.parse(buf)
	} catch (error) {}
	window.sessionStorage.setItem(config.appKey, JSON.stringify({...json, ...state}))
}

const initialState: StoreObject = {
	theme:			'',
	lang:			'en-US',
	cookie:			'',
	loading:		false,
	connectedWallet: {
		address:	'',
		domain:		'',
		name:		'',
		showDialog:		false,
		connected: 	false
	},
	reg:			{
		year: 0,
		commitment: '',
		params: [],
		price: 0,
		timestamp: 0,
		domain: ''
	},
	favorites: {}
	// account:		null,
	// account: 		{uid: "ryh20412", username: "ryh20412", email: "felix44291@gmail.com", emailVerified: true, lastLogin: 123123, lastIp: "192.168.114.12"},	
	/*
	{
		token: 		'1234567',
		email: 		'felix@gmail.com'
	}
	*/
	// tokenIcons:		{},
	// verify:			null
}

export const slice = createSlice({
	name: 'store',
	initialState: getStore(initialState),
	reducers: {
		update: (state: any, action) => {
			for (const k in action.payload) {
				if (state[k] === undefined) new Error(`undefined store key ${k}`)
				state[k] = action.payload[k]
			}
			setStore(action.payload)
		},
		updateSession: (state: any, action) => {
			for (const k in action.payload) {
				if (state[k] === undefined) new Error(`undefined store key ${k}`)
				state[k] = action.payload[k]
			}
			setSessionStore(action.payload)
		}
	}
})

const useStore = () => {
	const G = useSelector((state: StoreObject) => state)

	const L = locales[G.lang]
	const dispatch = useDispatch()
	const update = (payload:Partial<StoreObject>) => dispatch(slice.actions.update(payload))
	const updateSession = (payload:Partial<StoreObject>) => dispatch(slice.actions.updateSession(payload))

	const getError = (code:number, args?:{[key:string]:string|number}|string|number) => T("error."+code, args)

	const T = (key:string, args?:{[key:string]:string|number}|string|number):string => {
		let text = L[key]
		if (text === undefined) throw new Error('Undefined lang key[' + key + ']')
		if (typeof args === 'string' || typeof args === 'number') {
			text = text.replace(/\{\w+\}/, String(args))
		} else if (args){
			for(let k in args) text = text.replace(new RegExp('{'+k+'}', 'g'), String(args[k]))
		}
		return text
	}
	const timeAgo = (time:number):string => {
		if (time < 1e12) time *= 1000
		return timeAgos[G.lang].format(time)
	}

	const setCookie = (extra?:Partial<StoreObject>) => {
		const cookie = setDocumentCookie()
		update({cookie, ...extra})
	}

	const showLoading = (show: boolean) => update({loading: show})

	return {...G, T, timeAgo, update, updateSession, setCookie, getError, showLoading};
}

export default useStore