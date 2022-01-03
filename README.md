## blockchain-developer-bootcamp-final-project: 
# Musical instruments rental

### Brief introduction
While many people have a dusty guitar, saxophone, or other instruments lying around in their homes, others would like to rent these very same instruments for a while - maybe to refresh their skills, to get a simple idea if they like the instrument at all... or simply as a different way to use their time for a while. The musical instruments rental service is ideal for that. ;-)

### Deployed with Github Pages:
https://schultzl.github.io/blockchain-developer-bootcamp-final-project/

### Screencast link:
https://www.loom.com/share/78730d59c2bf4289ac28ac9e3f09dd0a

### Public Ethereum account for certification:
0x27072aEa00D4df1c451033F27B886A4C32f181Fa


-----

## General infromation:

### Recommendations/Prerequisites
- Node.js (v16.13.0)
- Truffle and Ganache (truffle v5.4.18, solc v0.8.0)
- Web3.js (v1.5.3)

Tipp: Run `yarn install` in the root of the project directory to install dependencies 

### Directory structure:
- `contracts`: smart contracts (deployed to the Rinkeby testnet)
- `migrations`: migration scripts
- `test`: tests for smart contracts in `/contracts`
- `truffle-config.js`: configuration file for truffle
- `dapp.js`
- `index.html`

### Compile and test the contract (locally):
Note: 
1. You should be in the root of the project directory to run the commands listed below
2. Remember to start ganache (should run on port 8545; command `ganache-cli`), and open a different terminal window in order to run the commands "truffle migrate" (local testnet) and "truffle test" as listed below.

- To compile: truffle compile
- To migrate to local testnet: truffe migrate
- To run tests: truffle test

- To migrate to a public testnet (e.g. rinkeby): truffe migrate --network <testnet_name>


### Run the frontend locally

Note: 
1. If you choose to redeploy this contract, you need to create an .env file and add your infura key (INFURA_API_KEY) and mnemonic (MNEMONIC) to it. Alternatively, you can deploy it locally (to dev). In this case, the contract address needs to be updated in file dapp.js (variable `ssAddress`)

2. To run the frontend locally, it is recommended to use a live server (Live Server, "Ritwick Dey", v5.6.1)

- In VS code, right-click on the index.html file --> "Open with Live Server"


-----

## Current workflow:

1. Instrument owners have to upload information about the instrument(s) they want to make available for rent
2. Leasers enter the website and register with Metamask
3. Leasers browse the instruments
4. Leasers select the item rent
5. Leasers select the shipment method desired
6. The contract becomes valid for the agreed period of time after the transaction has been approved
7. The instrument is sent to the leaser 
8. The leaser returns the instrument to the owner after use


### Example on how to interact with the contract locally
- truffle migrate
- truffle console
- let instance = await InstrumentRental.deployed()
- Use functions, e.g.

    ... to add an instrument:
    
    instance.addInstrument("flute", "XXXXX", "ht<span>tps://</span>pictureofaflute.jpg", web3.utils.toWei('0.003'), 3, 100)

    ... to fetch an instrument that has been added to the contract
    
    instance.fetchItem(0)


### Not implemented (yet), but actually important:
- Confirmation that the leaser received the instrument
- Confirmation that the owner received the instrument back after renting it
- Methods to check if instrument has been returned in good shape or if damage occurred
- A method to check (and if so, enforce some penalty) if the leaser exceeds the time he/she was given allowance to keep the rented instrument


