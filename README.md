# arb name system

# webpack
https://medium.com/edonec/create-react-17-typescript-with-eslint-webpack-scss-c4cdbedc31f6


ETHRegistrarController.sol
When deploy to new evm chain, should change ETH_NODE value as namehash of new rootname.
```ts
const ETH_NODE = namehash('arb')
```

ETHRegistrarController.sol
When deploy to new evm chain, should change root node name value as new rootname.
```ts
function _setReverseRecord(
        string memory name,
        address resolver,
        address owner
    ) internal {
        reverseRegistrar.setNameForAddr(
            msg.sender,
            owner,
            resolver,
            // string.concat(name, ".eth")
            string.concat(name, ".arb")
        );
    }
```

NameWrapper.sol
When deploy to new evm chain, should change ETH_NODE value as namehash of new rootname.


```js
bytes32 private constant ETH_NODE = 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae;

```

added new contract DeamName

```
deamname <=> NameWrapper
```