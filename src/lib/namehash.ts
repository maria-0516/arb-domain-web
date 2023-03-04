import {keccak_256} from 'js-sha3';
import {toUnicode} from './uts46'

const hash = (inputName: string) => {
	let node = '0000000000000000000000000000000000000000000000000000000000000000';
	const name = normalize(inputName);
	if (name) {
		const labels = name.split('.');
		for(var i = labels.length - 1; i >= 0; i--) {
			node = keccak_256(Buffer.from(node + keccak_256(labels[i]), 'hex'));
		}
	}
	return '0x' + node;
}

const keccak256 = (label: string) => '0x' + keccak_256(label);

const normalize = (name: string) => name ? toUnicode(name, {useSTD3ASCIIRules: true}) : name;

const reverseNode = (address: string) => (namehash.hash(address.slice(2).toLowerCase() + '.addr.reverse'))

const namehash = {hash, normalize, keccak256, reverseNode};
export default namehash;