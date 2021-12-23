// contract address on Rinkeby:
const ssAddress = '0x55f23333DCEfBff5A36F0Ba5EE0E1EE91A84ee04'

// add contract ABI from Remix:

const ssABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "_instrumentId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "_rentPrice",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_minRentPeriod",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_maxRentPeriod",
                "type": "uint256"
            }
        ],
        "name": "LogInstrumentAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_instrumentId",
                "type": "uint256"
            }
        ],
        "name": "LogRented",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_instrumentId",
                "type": "uint256"
            }
        ],
        "name": "LogReturned",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_instrumentId",
                "type": "uint256"
            }
        ],
        "name": "LogShipped",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "idCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_instrumentType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_instrumentModel",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_imgUrl",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_rentPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_minRentPeriod",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_maxRentPeriod",
                "type": "uint256"
            }
        ],
        "name": "addInstrument",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_instrumentId",
                "type": "uint256"
            },
            {
                "internalType": "enum InstrumentRental.ShipmentMethod",
                "name": "_shipping",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "_rentingPeriod",
                "type": "uint256"
            }
        ],
        "name": "rentInstrument",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_instrumentId",
                "type": "uint256"
            }
        ],
        "name": "shipInstrument",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_instrumentId",
                "type": "uint256"
            }
        ],
        "name": "returnInstrument",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_instrumentId",
                "type": "uint256"
            }
        ],
        "name": "fetchItem",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "instrumentId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "instrumentType",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "rentPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minRentPeriod",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxRentPeriod",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "leaser",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "ownerFI",
                "type": "address"
            },
            {
                "internalType": "enum InstrumentRental.ShipmentMethod",
                "name": "shipment",
                "type": "uint8"
            },
            {
                "internalType": "enum InstrumentRental.RentingStatus",
                "name": "status",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
]

const rentingStatus = ['Available', 'Rented', 'Reserved', 'Not Available'];


function isEmpty(str) {
    return !str.trim().length;
}


async function getValues(indice) {

    let web3 = new Web3(window.ethereum)
    const dm = new web3.eth.Contract(ssABI, ssAddress)
    //web3.handleRevert = true
    dm.setProvider(window.ethereum)

    item = await dm.methods.fetchItem(indice).call()
    item_name = item[1].toString() // 'guitar'
    item_price = item[2].toString() // 
    item_minrent = item[3].toString() //  
    item_maxrent = item[4].toString() //   
    item_leaser = item[5].toString() // 
    item_owner = item[6].toString() // 
    item_rentstatus = rentingStatus[item[8].toString()] // 
    item_desc = '<b>' + item_name.toUpperCase() + '</b><br><br>'
        + `Period (days): ${item_minrent} - ${item_maxrent} <br>`
        + `Price (WEI): ${item_price}<br>`

    var statusText = "___";

    const rentButtonId = "subclass_rentbutton" + indice.toString()
    const rentObj = document.getElementById(rentButtonId);

    if (item_rentstatus == 'Rented') {
        rentObj.disabled = true
        statusText = '<span style="color: green">Rented by: '
            + item_leaser.substr(0, 3) + '...'
            + item_leaser.substr(item_leaser.length - 3) + '</span>';
    } else {
        rentObj.disabled = false
    }
    return [item_minrent, item_rentstatus, item_desc, statusText];
}


// Rent musical instrument using the contract:
async function rentItem(buttonid) {

    let web3 = new Web3(window.ethereum)
    const dm = new web3.eth.Contract(ssABI, ssAddress)
    //web3.handleRevert = true
    dm.setProvider(window.ethereum)

    item = await dm.methods.fetchItem(buttonid).call()
    item_price = item[2].toString()

    var rentPeriod = document.getElementById('rentperiod-box' + buttonid).value;

    if (isEmpty(rentPeriod)) {
        rentPeriod = item[3].toString()
    }

    var shipMethod = document.getElementById('shipmethod-box' + buttonid).value;

    if (shipMethod == "2") {
        shipMethod = "0"
    }

    let text = "Please make sure that:\n\n \
                   - You've selected a shipping option\n \
                   - Your rental period is valid\n \
                   - You have enough funds\n\n \
                   --> Your transaction might otherwise fail.";

    if (confirm(text) == true) {
        dm.methods.rentInstrument(buttonid, Number(shipMethod), rentPeriod)
            .send({ from: ethereum.selectedAddress, value: item_price })
            .on('confirmation', function (confirmationNumber, receipt) {

                let a = document.createElement('a');
                a.target = '_blank';
                a.href = `https://rinkeby.etherscan.io/tx/${receipt["transactionHash"]}`;
                var text1 = `Account: ${receipt["from"]} rented the instrument.\n\nView transaction at: https://rinkeby.etherscan.io/tx/${receipt["transactionHash"]}\n\nClick OK to open the link on a new tab, Cancel to stay on this site`;

                if (confirm(text1)) {
                    a.click();
                    window.location.reload();
                } else {
                    window.location.reload();
                };
            })
            .on("error", error => { console.error(error); window.alert(error) })
    }

}



// Return the leased instruments by clicking on the "return" button
async function returnItem(buttonid) {

    let web3 = new Web3(window.ethereum)
    const dm = new web3.eth.Contract(ssABI, ssAddress)
    //web3.handleRevert = true
    dm.setProvider(window.ethereum)

    await dm.methods.returnInstrument(buttonid).send({ from: ethereum.selectedAddress })
        .on('confirmation', function (confirmationNumber, receipt) {
            console.log("return confirmed");
            alert("Nice, you've successfully returned the instrument. See you soon! :-)");
            window.location.reload();
        })
}



// Using the 'load' event listener for Javascript to
// check if window.ethereum is available

window.addEventListener('load', function () {

    if (typeof window.ethereum !== 'undefined') {
        console.log('window.ethereum is enabled')
        if (window.ethereum.isMetaMask === true) {
            console.log('MetaMask is active')
            initialiseFrontEnd()

        } else {
            console.log('MetaMask is not available. Please install MetaMask to use this site.')
            let mmDetected = document.getElementById('mm-detected')
            mmDetected.innerHTML += 'MetaMask Not Available!'
            // let node = document.createTextNode('<p>MetaMask Not Available!<p>')
            // mmDetected.appendChild(node)
        }
    } else {
        console.log('window.ethereum is not found')
        let mmDetected = document.getElementById('mm-detected')
        mmDetected.innerHTML += '--> MetaMask Not Available! Please install MetaMask to use this site.'
    }
})


const initialiseFrontEnd = async function () {
    let web3 = new Web3(window.ethereum)

    const dm = new web3.eth.Contract(ssABI, ssAddress)
    //web3.handleRevert = true
    dm.setProvider(window.ethereum)

    ////////////// helper functions

    function defineOverlayStyle(item_rentstatus) {

        var backgroundColor = "black";
        var opacity = "1";
        var item_desc_cont = `Status: <span style="color: green">${item_rentstatus}</span>`;

        if ((item_rentstatus == 'Rented') || (item_rentstatus == 'Not Available') || (item_rentstatus == 'Reserved')) {
            item_desc_cont = `Status: <span style="color: #ff0000">${item_rentstatus}</span>`

            backgroundColor = "gray"
            opacity = "0.3"
        }

        return [item_desc_cont, backgroundColor, opacity];
    }

    //////////////

    let mmConnected = document.getElementById('mm-connected')

    web3.eth.getAccounts(function (err, accounts) {
        if (err != null) {
            console.error("An error occurred: " + err);
        } else if (accounts.length == 0) {
            mmConnected.innerHTML = 'Please connect to MetaMask (<b> Rinkeby! </b>) to rent a super cool instrument.'
        }
        else {

            if (window.ethereum.networkVersion === '4') {
                mmConnected.innerHTML = 'Welcome to Instrument Rental! How are you rocking today? :-)'
                const mmAlreadyConnected = document.getElementById("mm-connect")
                mmAlreadyConnected.disabled = true
            } else {
                mmConnected.innerHTML = 'Welcome to Instrument Rental!<br> \
                                        Please note that we only run on the <b> rinkeby </b> testnet.<br> \
                                         Switch to the <span style="color: red">rinkeby</span> testnet \
                                         <span style="color: red"> and refresh</span> use this site. '
            }
        }
    });

    // Grabbing the button object,  
    const mmEnable = document.getElementById('mm-connect');

    // since MetaMask has been detected, we know
    // `ethereum` is an object, so we'll do the canonical
    // MM request to connect the account. 
    // 
    // typically we only request access to MetaMask when we
    // need the user to do something, but this is just for
    // an example

    mmEnable.onclick = async () => {
        await ethereum.request({ method: 'eth_requestAccounts' })
        // grab mm-current-account
        // and populate it with the current address
        mmConnected.innerHTML = 'Welcome to Instrument Rental! How are you rocking today? :-)'
    }


    const mmShowAccount = document.getElementById('mm-show');

    mmShowAccount.onclick = async () => {
        var mmCurrentAccount = document.getElementById('mm-current-account');
        var firstAccount;
        web3.eth.getAccounts().then(e => {
            firstAccount = e[0];
            console.log("Current Account: " + firstAccount);
            mmCurrentAccount.innerHTML = 'Current Account: ' + firstAccount
        })
    }

    // Guitar

    var imgGuitar = document.createElement("img");
    imgGuitar.src = "https://thumbs.dreamstime.com/b/funny-classical-guitar-cartoon-style-vector-cute-185881190.jpg"
    var srcGuitar = document.getElementById("guitarImg");
    srcGuitar.appendChild(imgGuitar);

    const [item0_minrent, item0_rentstatus, item0_description, item0_statusText] = await getValues(0);
    [item0_desc_cont, backgroundColor0, opacity0] = defineOverlayStyle(item0_rentstatus)

    const item0_desc = document.getElementById('item0Description')
    item0_desc.innerHTML = item0_description + item0_desc_cont

    document.getElementById("overlay0").style.backgroundColor = backgroundColor0
    document.getElementById("overlay0").style.opacity = opacity0
    document.getElementById("leaserNr0").innerHTML = item0_statusText

    // Piano

    var imgPiano = document.createElement("img");
    imgPiano.src = "https://cdn.w600.comps.canstockphoto.at/piano-cartoon-hand-gezeichnet-bild-clipart-vektor_csp51093457.jpg"
    var srcPiano = document.getElementById("pianoImg");
    srcPiano.appendChild(imgPiano);

    const [item3_minrent, item3_rentstatus, item3_description, item3_statusText] = await getValues(3); // [item3_minrent, item3_rentstatus, item3_description]
    [item3_desc_cont, backgroundColor3, opacity3] = defineOverlayStyle(item3_rentstatus)

    const item3_desc = document.getElementById('item3Description')
    item3_desc.innerHTML = item3_description + item3_desc_cont

    document.getElementById("overlay3").style.backgroundColor = backgroundColor3
    document.getElementById("overlay3").style.opacity = opacity3
    document.getElementById("leaserNr3").innerHTML = item3_statusText

    // Saxophone

    var img = document.createElement("img");
    img.src = "https://thumbs.dreamstime.com/b/funny-cute-saxophone-side-view-cartoon-style-vector-funny-cute-saxophone-side-view-cartoon-style-gold-185881672.jpg"
    var src = document.getElementById("saxophoneImg");
    src.appendChild(img);

    const [item2_minrent, item2_rentstatus, item2_description, item2_statusText] = await getValues(2);
    [item2_desc_cont, backgroundColor2, opacity2] = defineOverlayStyle(item2_rentstatus)

    const item2_desc = document.getElementById('item2Description')
    item2_desc.innerHTML = item2_description + item2_desc_cont

    document.getElementById("overlay2").style.backgroundColor = backgroundColor2
    document.getElementById("overlay2").style.opacity = opacity2
    document.getElementById("leaserNr2").innerHTML = item2_statusText

}

