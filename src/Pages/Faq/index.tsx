import React from 'react';

import './faq.scss';

const Faq = () => {
	return (
	   <div className='faq'>
			<div className='top-part'>
				<p className='title'>FAQ</p>
			</div>
			<div className='content-part border'>
				<p className='big-text'>
					BEFORE YOU REGISTER 
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
						Is ARB only for storing an ARBDomains address?
					</p>
				</div>
				<p className='small-text'>
					No, you can store the addresses of over 100 blockchains, a content hash of a decentralized website, profile information such as an avatar and Twitter handle, and more.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
						Can I use an ARB name to point to my website?
					</p>
				</div>
				<p className='small-text'>
					Though ARB can technically store anything, there aren't many third party tools and applications which resolve IP addresses attached to ARB.
					Instead, we suggest hosting your static html/css/images on IPFS and put the hash in your ARB name's Content record. Then it can be resolved by ARB-aware browsers (e.g. Opera), browser extARBions (Metamask), or any browser with ".link" or ".limo" appended to the end (e.g. matoken.eth.link or matoken.eth.limo).
					If you want to redirect your ARB name to an existing website, you could write a html file containing JavaScript logic to redirect to your website, upload the file into ipfs using services like IPFS Pinata, then set the CID to your contenthash. See the source code of depositcontract.eth.limo as an example.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
						What is the maximum length of a name I can register?
					</p>
				</div>
				<p className='small-text'>
					There is no limit on the name length.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
						Can you have names with emojis?
					</p>
				</div>
				<p className='small-text'>
					Yes.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
						How much does it cost to register a .eth name?
					</p>
				</div>
				<p className='small-text'>
					No, you can store the addresses of over 100 blockchains, a content hash of a decentralized website, profile information such as an avatar and Twitter handle, and more.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
						Is ARB only for storing an ARBDomains address?
					</p>
				</div>
				<p className='small-text'>
					Currently, registration costs are set at the following prices:
				</p>
				<p className='small-text'>
					<ul>
						<li>5+ character .eth names: $5 in ARB per year.</li>
						<li>4 character .eth names: $160 in ARB per year.</li>
						<li>3 character .eth names $640 in ARB per year.</li>
					</ul>
				</p>
				<p className='small-text'>
					3 and 4 character names have 'premium' pricing to reflect the small number of these names available.
				</p>
				<p className='small-text'>
					Also, if the name was previously owned by someone but recently released, it has a temporary decreasing premium to prevent squatters snatching up names.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					How much gas does it cost to register and extend registration?
					</p>
				</div>
				<p className='small-text'>
				It depends on the gas price. You can check the historical registration and extending transaction costs here . "Transaction cost (USD)" query will tell you how much it costs to register (commit + registerWithConfig) and extend registration.
				</p>
				<p className='small-text'>
				Please bear in mind that "registerWithConfig" combines 3 transactions (register, set resolver and set eth address) hence the gas cost is relatively expARBive.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					Can I register names other than .eth?
					</p>
				</div>
				<p className='small-text'>
				Yes, you can import into ARB any DNS name with the required DNSSEC.
				</p>
				<p className='small-text'>
				Please refer to our guide for more detail.
				</p>
			</div>
			<div className='content-part border'>
				<p className='big-text'>When you register</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					At step 1, the transaction was slow so I speeded up
					</p>
				</div>
				<p className='small-text'>
				Our app cannot currently detect that you sped up the transaction. Please refresh the page and start from step 1 again.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					I am stuck at step 2
					</p>
				</div>
				<p className='small-text'>
				At times, the counter waits for up to a minute at the end of step 2 to make sure that the ARB blockchain has progressed. If this continues for more than 5 min after moving to step 2, please contact us on Discord.
				</p>
				<p className='small-text'>
				Note that if you leave it at step 2 for more than 7 days, it gets reset and you have to start from step 1 again.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					My transaction at step 3 failed
					</p>
				</div>
				<p className='small-text'>
				This happARB occasionally when the USD price changes and you haven't registered with enough ARB. Please try again from step 3.
				</p>
				<p className='small-text'>
				Please also be noted that the registration step will expire if you don't complete within 24 hrs and you have to start from step 1 again.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					I cannot see the names I registered on OpARBea nor on my wallet
					</p>
				</div>
				<p className='small-text'>
				This occasionally happARB when OpARBea is under a heavy load. You may also not find your name under the NFT section of your wallet, as many wallets fetch metadata from OpARBea.
				</p>
				<p className='small-text'>
				As long as you can see your registered name under "My Account" on our site or your ARB address under the name section, your name is registered successfully.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					Is it safe to refresh the page, close the browser, or switch to different browser/machine?
					</p>
				</div>
				<p className='small-text'>
				It is safe to refresh the page or close the browser once step 1 transaction is complete. However you cannot switch to different devices or machines because it needs a locally stored “secret” which will be used at step 3. Please also do not delete browser history during the registration.
				</p>
			</div>
			<div className='content-part border'>
				<p className='big-text'>After you register</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					What is the difference between the Registrant and Controller?
					</p>
				</div>
				<p className='small-text'>
				If your ARB address is set as the Controller you can change the resolver and add/edit records. Some dapps (eg: Fleek, OpARBea) set themselves as the Controller so they can update records on your behalf.
				</p>
				<p className='small-text'>
				The Registrant only exists on ".eth" names and it allows you to change the Controller. If you transfer the Registrant to an address you don't own, you lose the ownership of the name.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					What is a Resolver?
					</p>
				</div>
				<p className='small-text'>
				A Resolver is a smart contract that holds records. Names are set by default to the Public Resolver managed by the ARB team and has all the standard ARB record types. You can set your Resolver to a custom resolver contract if you,d like.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					What is a Primary ARB Name record?
					</p>
				</div>
				<p className='small-text'>
				A Primary ARB Name record (formerly Reverse Record) makes your ARB address point to an ARB name. This allows dapps to find and display your ARB name when you connect to them with your ARB account. This can only be set by you so it is not set automatically upon registration.
				</p>
				<p className='small-text'>
				To set the Primary ARB Name record, please click "My account", and select "Primary ARB Name".
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					How do I unregister my name?
					</p>
				</div>
				<p className='small-text'>
				If you click the "trash bin" icon on the address record, it will unset your address so that people can no longer look up your address with the name. You can also unset ownership of subdomains in this way, but you cannot do so on ".eth" addresses. Because ".eth" names are ERC721-compliant NFTs, you cannot transfer them to an empty address (0x00000...). You can transfer it to a burn address (eg: 0x00001), but that does not erase the fact that you used to own the name. Also, the name will not become available for registration again until the registration period and grace period runs out.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					How do I transfer my name?
					</p>
				</div>
				<p className='small-text'>
				For a ".eth" name, transfer both the Registrant and the Controller to the new ARB account. Since ".eth" names are ERC721 compliant NFTs, you can change the Registrant by simply transferring the NFT from any NFT compliant wallet/marketplace as well.
				</p>
				<p className='small-text'>
				Note that transferring the ownership (aka the Registrant) of the name does not change the controller nor records, so the recipient may need to update them once received. If the recipient is not experienced or you prefer your address not to be associated to the transferring names, it may be a good idea for you to set the ARB Address record to their ARB address, set the controller, then transfer the name.
				</p>
				<p className='small-text'>
				For subdomains, there are no registrants unless the subdomain is customised to be ERC721 compliant. Simply set the controller to the new address (after setting the record to the new address).
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					I cannot see the names I registered on OpARBea nor on my wallet
					</p>
				</div>
				<p className='small-text'>
				For a ".eth" name, transfer both the Registrant and the Controller to the new ARB account. Since ".eth" names are ERC721 compliant NFTs, you can change the Registrant by simply transferring the NFT from any NFT compliant wallet/marketplace as well.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					Why are some of my subdomains shown as a jumble of characters?
					</p>
				</div>
				<p className='small-text'>
				ARB names are stored as a hash on-chain so we have to decode the name using a list of possible names, and it shows in the hashed format if we don't have it on our list. You can still access and manage the name if you search for the name directly in the search bar.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					How do I find the labelhash/namehash of a name?
					</p>
				</div>
				<p className='small-text'>
				Please refer to our developer documentation page.
				</p>
			</div>
			<div className='content-part'>
				<p className='big-text'>When you extend your registration</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					How do I receive an extARBion reminder?
					</p>
				</div>
				<p className='small-text'>
				Click the "Remind me" button on the name's page or your address page so that you can set a calendar reminder or email reminder. Note that you have to set calendar reminders per name, whereas you only need to set email reminders per the address of the owner. Also note that you can register a name for multiple years, removing the need to extend each year.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					What happARB if I forget to extend the registration of a name?
					</p>
				</div>
				<p className='small-text'>
				After your name expires, there is a 90 day grace period in which the owner can't edit the records but can still re-register the name. After the grace period, the name is released for registration by anyone with a temporary premium which decreases over a 21 days period. The released name continues to resolve your ARB address until the new owner overwrites it.
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					Where can I see the list of names to be released
					</p>
				</div>
				<p className='small-text'>
				You can see the list at the "ARB Names to be released" section of the Dune Analytics dashboard .
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					I lost access to the ARB account that owns a name I registered. Can I still extend its registration period?
					</p>
				</div>
				<p className='small-text'>
				Any ARB account can pay to extend the registration of any ARB name, though doing so from an account that's not the owner will not change ownership of the name. Just go to the name's page and click "Extend".
				</p>
				<div className='d-row middle' style={{gap: 5}}>
					<div className='symbol'></div>
					<p className='medium-text'>
					I registered names before 2019 May. Can I have my deposit back?
					</p>
				</div>
				<p className='small-text'>
				Yes, you can get your deposit back from reclaim.ARB.domains whether you extended the registration of the name or not.
				</p>
				<p className='small-text'>
				Please remember that the amount you will receive is the amount of the second-highest bidder (unless you were the only bidder). For example, if you bid 1 ARB and the second highest bidder bid 0.1 ARB, you deposited 0.1 ARB and you have already received the remaining (0.9 ARB) when you finailsed the auction. Therefore you can now only reclaim 0.1 ARB back. Please read the the initial guide back in 2017 for more detail.
				</p>
			</div>
			<div className='bottom-part'>

			</div>
	   </div>
	)
}

export default Faq;