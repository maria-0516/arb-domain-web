declare module '*.svg' {
	import * as React from 'react';
  
	export const ReactComponent: React.FunctionComponent<React.SVGProps<
	  SVGSVGElement
	> & { title?: string }>;
  
	const src: string;
	export default src;
}
  
declare interface Window {
	connector: 			IConnector
	ethereum: 			any
	ethers: 			any
	soljsonReleases: 	any
	PR: 				any
}

declare interface RpcRequestType {
	jsonrpc: 		"2.0"
	method: 		string
	params: 		Array<any>
	id: 			string|number
}

declare interface RpcResponseType {
	jsonrpc: 		"2.0"
	id: 			string|number
	result?: 		any
	error?: 		any
}

declare interface ServerResponse {
	result?:    		any
	error?:     		number
}
