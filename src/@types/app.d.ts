declare interface DomainDataType {
	name: string
	parent: string
	owner: string
	registrant: string
	expire: number
	resolver: string
	contentHash: string
	texts: {[key: string]: string}
}

declare interface AddressDataType {
	label: string
	expire: number
}

declare interface PricesType {
	basePrice: number
	premiumPrice: number
	etherPrice: number
}

declare interface StoreObject {
	lang:				string
	theme:				string
	cookie?:			string
	loading:			boolean

	connectedWallet:			{		// wallet connector
		address:		string
		domain:			string
		name:			string
		showDialog:		boolean
		connected:		boolean
	},
	reg:                {		// domain registration paramters
		year:           number
		commitment:		string
		price:			number
		params: Array<string | number | boolean | string[]>
		timestamp: 		number
		domain:			string
		
	},
	favorites:			{
		[domainName: string]: number // number is expre date
	}
}

