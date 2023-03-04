## Usage

```js
import DNSProver from './DNSProver'
const prover = DNSProver.create("https://cloudflare-dns.com/dns-query")
const result = await prover.queryWithProof('TXT', textDomain)
```

## API
Please refer to [the doc](https://dnsprovejs.readthedocs.io)