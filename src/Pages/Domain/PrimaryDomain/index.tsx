import React from 'react'
// import { useParams } from 'react-router'
import Select, { ActionMeta, SingleValue } from 'react-select'
import useStore, { config, tips } from '../../../useStore'
import { Contracts, abis, getPrimaryDomain } from '../../../lib/ENSLib';
import useWallet from '../../../useWallet';
import { ethers } from 'ethers';
// import namehash from '../../../lib/namehash';
// import { isSubdomain } from '../../../lib/utils';

interface PrimaryDomainProps {
	data: AddressDataType[]
}


const PrimaryDomain = ({data}: PrimaryDomainProps) => {
	const {connectedWallet, update} = useStore()
	const wallet = useWallet();
	const [primary, setPrimary] = React.useState('');
	const [domains, setDomains] = React.useState<Array<{label: string, value: string}>>([]);
	const [isEdit, setIsEdit] = React.useState(false);

	const onChange = (newValue: SingleValue<{label: string, value: string}>, actionMeta: ActionMeta<{label: string, value: string}>) => {
		if (newValue) setPrimary(newValue.value)
	}

	const submit = async () => {
		update({loading: true})
		try {
			if (wallet.library && primary!=='') {
				const signer = wallet.library.getSigner()
				const reverseRegistrar = new ethers.Contract(Contracts.reverseRegistrar, abis.reverseRegistrar, signer)
				const tx = await reverseRegistrar.setName(primary);
				await tx.wait();
				const domain = await getPrimaryDomain(connectedWallet.address);
				if (domain!=='') {
					update({loading: false, connectedWallet: {...connectedWallet, domain: `${domain}.${config.rootDomain}`}})
					setIsEdit(false)
					return;
				}
			}
		} catch (error: any) {
			if (error.code==='ACTION_REJECTED' || error.code===4001) {
				tips("Setting primary domain operation was canceled.")
			} else {
				tips(error.reason)
			}
			// console.log(error)
		}
		update({loading: false})
	}

	React.useEffect(()=>{
		setDomains(data.filter(i=>i.label.indexOf('.')===-1).map(i=>({label: `${i.label}.${config.rootDomain}`, value: i.label})))
	}, [data])
	
	return (
		<div className='primary-domain'>
			<p className={'d-row center gap ' + (!!connectedWallet.domain ? "text-gray" : "text-pink")} style={{fontSize: '1.1em'}}>Primary {config.title} Name (reverse record): <b>{connectedWallet.domain || `not set`}</b> {!!connectedWallet.domain && !isEdit && <b className='cmd' onClick={()=>setIsEdit(true)}>UPDATE</b>}</p>
			{(!connectedWallet.domain || isEdit) && (
				<div className="main-part">
					<p className="detail-text">
						This designates one of your {config.title} names to represent your NeonDomains account and act as your cross-platform web3 username and profile. You can only have one primary {config.title} Name per {config.chainName} account and can change it at any time.
					</p> 
					<Select options={domains} className="select" placeholder="Select a domain" onChange={onChange} />
					<p className="detail-text">
						Only {config.title} names that point to your NeonDomains account can be set as your Primary {config.title} Name.
					</p>
					<div className="d-row middle" style={{gap: 10}}>
						{isEdit && <button className="btn outline" onClick={()=>setIsEdit(false)}>CANCEL</button>}
						<button disabled={primary===''} className="btn" onClick={submit}>SAVE</button>
					</div>
				</div>
			)}
			
		</div>
	)
}

export default PrimaryDomain;