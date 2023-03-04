export const validAddress = (input: string) => ( /^0x[a-fA-F0-9]{40}$/.test(input))
export const validDomainName = (input: string) => (/^(?!-)[A-Za-z0-9-]+([-.]{1}[a-z0-9]+)*\.[A-Za-z]{2,12}$/.test(input));
export const isArbDomain = (domain: string) => (domain.slice(-5)==='.arb');
export const isSubdomain = (domain: string) => (domain.split('.').length > 2);
export const bytesToHex = (text: string) => ('0x' + Array.from(new TextEncoder().encode(text), byte => byte.toString(16).padStart(2, "0")).join(""));