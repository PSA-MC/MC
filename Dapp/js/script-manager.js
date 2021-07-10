let FACTORY, POOL;
let factoryContractAddress = "0x37f564c7670b1B53a8C76DC58f78CcC9c719d27C";
let factoryContractABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"child","type":"address"},{"indexed":false,"internalType":"uint256","name":"poolId","type":"uint256"}],"name":"PoolCreated","type":"event"},{"inputs":[{"internalType":"string","name":"_contractName","type":"string"},{"internalType":"uint256","name":"_hardCap","type":"uint256"},{"internalType":"uint256","name":"_softCap","type":"uint256"},{"internalType":"uint256","name":"_maxInvestment","type":"uint256"},{"internalType":"uint256","name":"_minInvestment","type":"uint256"},{"internalType":"address","name":"_managementAddress","type":"address"},{"internalType":"address","name":"_destinationAddress","type":"address"},{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_ownerBonus","type":"uint256"},{"internalType":"uint256","name":"_startDate","type":"uint256"},{"internalType":"uint256","name":"_endDate","type":"uint256"},{"internalType":"address[5]","name":"_whitelisted","type":"address[5]"},{"internalType":"uint256","name":"_token","type":"uint256"}],"name":"CreatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"pools","outputs":[{"internalType":"uint256","name":"poolId","type":"uint256"},{"internalType":"string","name":"poolName","type":"string"},{"internalType":"address","name":"poolAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPools","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

let poolAddress, tokenAddress, acc, hash, status;
let tokenABI = [{
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_to",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "tokenOwner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [{
            "internalType": "uint256",
            "name": "remaining",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokens",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [{
            "internalType": "bool",
            "name": "success",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "tokenOwner",
            "type": "address"
        }],
        "name": "balanceOf",
        "outputs": [{
            "internalType": "uint256",
            "name": "balance",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokens",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [{
            "internalType": "bool",
            "name": "success",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokens",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [{
            "internalType": "bool",
            "name": "success",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address payable",
            "name": "_newOwner",
            "type": "address"
        }],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let USDT = "0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA"; //"0xdAC17F958D2ee523a2206206994597C13D831ec7";
let USDC = "0x7E0480Ca9fD50EB7A3855Cf53c347A1b4d6A2FF5"; //"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
let poolABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_contractName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_hardCap",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_softCap",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_maxInvestment",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_minInvestment",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_managementAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_destinationAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_ownerBonus",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_startDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_endDate",
				"type": "uint256"
			},
			{
				"internalType": "address[5]",
				"name": "_whitelisted",
				"type": "address[5]"
			},
			{
				"internalType": "uint256",
				"name": "_token",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "CancelPool",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "CheckStatus",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "status",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ContractName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "Contribute",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DestinationAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "EndDate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "GetTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "HardCap",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "InvestmentToken",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ManagementAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MaxInvestment",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MinInvestment",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "OwnerBonus",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "Refund",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SendFundsToProject",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SoftCap",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "StartDate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "Status",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TokenAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "Whitelisted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalClaimed",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalInvestments",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalTokensReceived",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "whitelistedArr",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];
let TOKEN;
$(window).on('load', function() {
    // PAGE LOADER
    $('.pre-load').stop().animate({ opacity: 0 }, 500, function() {
        $('.pre-load').css({ 'display': 'none' });
        $('body').css({ 'overflow-y': 'auto' });
    });
});

let mainnetProjectsList = [];
let testnetProjectsList = [];
let chainId;

async function connect() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    acc = await ethers.utils.getAddress(account);

    let addressVal = acc;
    $('.connectMM').html(addressVal.substring(0, 6) + '...' + addressVal.substring(36, 42));
}

async function contractInitialization(address, ABI) {
    const web3Instance = new Web3(window['ethereum']);
    chainId = await web3Instance.eth.getChainId();
    return (await new web3Instance.eth.Contract(ABI, address));
}
let poolObject, paymentSymbol, paymentSymbolImg,
    poolFilled,
    endProgress,
    currentProgressVal, whiteListArray = [],
    totalInvestment, destinationToken, poolBalance, destTokenSymbol;

function update2() {
    POOL.methods.totalInvestments().call().then(ti => {
        totalInvestment = ti;
        $('#totalInvestment').html(ti / 10 ** 18);
        POOL.methods.HardCap().call().then(hc => {
            $('#hardCap').html(hc / 10 ** 18);
            endProgress = hc / 10 ** 18;
            currentProgressVal = ti / 10 ** 18;
            poolFilled = ((currentProgressVal / endProgress) * 100).toFixed(2);

            $('#poolFilled').html(poolFilled);
            $('.progress-bar:not(.funds)').css({ 'width': poolFilled + '%' }).html(currentProgressVal);
            POOL.methods.StartDate().call().then(d => {
                startDate = d;
                POOL.methods.EndDate().call().then(d => {
                    endDate = d;
                    $('#startDate').html(new Date(startDate * 1000).toLocaleString());
                    $('#endDate').html(new Date(endDate * 1000).toLocaleString());
                    POOL.methods.TokenAddress().call().then(add => {
                        destinationToken = add;
                        $('#tokenContractAdd').html(add.substring(0, 6) + '...' + add.substring(36, 42));
                        contractInitialization(destinationToken, tokenABI).then(C => {
                            DT = C;
                            DT.methods.balanceOf(poolAddress).call().then(bal => {
                                poolBalance = bal;
                                let distance = parseInt(endDate) - new Date().getTime() / 1000;
                                if (distance < 0) {
                                    // if (poolBalance == 0)
                                    //     status = 2;
                                    // else if (poolBalance > 0)
                                    //     status = 3;
                                }
                                // else
                                //     status = 1;
                                countDown(endDate);
                            });
                            POOL.methods.CheckStatus().call().then(r => {
                                status = r;


                                DT.methods.symbol().call().then(s => {
                                    destTokenSymbol = s;

                                    updatePage();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

let tokensClaimed, tokensReceived, tokensClaimedPercent;
$(function() {

    // initialize factory contract
    contractInitialization(factoryContractAddress, factoryContractABI).then(C => {
        FACTORY = C;

        FACTORY.methods.totalPools().call().then(tp => {
            for (let i = 1; i <= tp; i++) {
                FACTORY.methods.pools(i).call().then(p => {
                    testnetProjectsList[i - 1] = p;
                    // // GET PROJECT NAME
                    let url = document.location.href,
                        params, projectId;
                    params = url.split('=')[1];
                    projectId = params - 1;

                    // // if (!projectId.isNumber)
                    // //     projectId = 0;
                    if (projectId + 1 == i) {
                        $('.projectName').html(p.poolName);
                        poolAddress = p.poolAddress;
                        ////////////////////////////////////////////////////////
                        // initialize pool contract
                        contractInitialization(poolAddress, poolABI).then(C => {
                            POOL = C;
                            POOL.methods.totalClaimed().call().then(claimed => {
                                POOL.methods.totalTokensReceived().call().then(received => {
                                    tokensReceived = received / 10 ** 18;
                                    tokensClaimed = claimed / 10 ** 18;
                                    if (received > 0)
                                        tokensClaimedPercent = ((claimed / received) * 100).toFixed(2);
                                    else
                                        tokensClaimedPercent = 0;
                                    console.log('claimed ' + claimed);
                                    console.log('received ' + received);
                                    console.log('total claimed ' + tokensClaimedPercent);
                                });
                            });
                            POOL.methods.InvestmentToken().call().then(IT => {
                                if (IT == USDT) {
                                    paymentSymbol = "USDT";
                                    paymentSymbolImg = '<img src="../images/usdt.png" alt="" class="mr-1">';
                                    contributionType = 1;
                                    tokenAddress = USDT;
                                    contractInitialization(tokenAddress, tokenABI).then(C => {
                                        TOKEN = C;
                                        update2();
                                    });
                                } else if (IT == USDC) {
                                    paymentSymbol = "USDC";
                                    paymentSymbolImg = '<img src="../images/usdc.png" alt="" class="mr-1">';
                                    contributionType = 1;
                                    tokenAddress = USDC;
                                    contractInitialization(tokenAddress, tokenABI).then(C => {
                                        TOKEN = C;
                                        update2();
                                    });
                                } else {
                                    paymentSymbol = "ETH";
                                    paymentSymbolImg = '<img src="../images/eth.png" alt="" class="mr-1">';
                                    contributionType = 0;
                                    update2();
                                }
                                $('.selectedCurrency').html(paymentSymbol);
                                $('.selectedCurrency.with-image').html(paymentSymbolImg + paymentSymbol);

                            });

                            POOL.methods.OwnerBonus().call().then(add => {
                                $('#bonus').html(add + '%');
                            });

                            for (let x = 0; x <= 4; x++) {
                                POOL.methods.whitelistedArr(x).call().then(r => {
                                    whiteListArray[x] = r;
                                });
                            }

                            POOL.methods.SoftCap().call().then(hc => {
                                $('#softCap').html(hc / 10 ** 18);
                            });

                            POOL.methods.MaxInvestment().call().then(r => {
                                r /= 10 ** 18;
                                $('#maxContribution').html(r);
                            });

                            POOL.methods.MinInvestment().call().then(r => {
                                r /= 10 ** 18;
                                $('#minContribution').html(r);
                            });

                            // RIGHT SECTION
                            $('.poolContractAdd').html(poolAddress.substring(0, 6) + '...' + poolAddress.substring(36, 42));
                            $('#poolContractAddF').html(poolAddress);

                            POOL.methods.DestinationAddress().call().then(add => {
                                $('#destinationAddress').html(add.substring(0, 6) + '...' + add.substring(36, 42));
                                $('#destinationAddressF').html(add);
                            });

                            POOL.methods.TokenAddress().call().then(add => {
                                $('#tokenContractAddress').html(add.substring(0, 6) + '...' + add.substring(36, 42));
                                $('#tokenContractAddressF').html(add);
                            });
                        });
                    }
                });
            }
            /*$('#openEM').html(tp);

            $('#openRTN').html(tp);*/

            $('#open').html(tp);
        });
    });
    // MENU TOGGLE
    $('.mirror').click(function() {
        $('.navbar-collapse').removeClass('show');
    });

    // POPOVER
    $('[data-toggle="popover"]').popover({
        trigger: 'focus'
    });

    ////////////////////////////////////////////////////////


    ////// DASHBOARD


    /*$('#fundSentEM').html(0);
    $('#tokenClaimedEM').html(0);
    $('#fundSentRTN').html(0);
    $('#tokenClaimedRTN').html(0);*/

    // LOAD POOLS
    // LIST PROJECTS - IN LEFT SECTION

    //loadPools(mainnetProjectsList);

    setTimeout(function() {
        if (chainId === 1) {
            $('.pools-a a').removeClass('active');
            $('#loadMainnetPools').addClass('active');
            loadPools(mainnetProjectsList);

            $('#loadMainnetPools').click(function(e) {
                e.preventDefault();
                $('.pools-a a').removeClass('active');
                $(this).addClass('active');

                loadPools(mainnetProjectsList);
            });
            $('#loadTestnetPools').click(function(e) {
                e.preventDefault();
                $('.pools-a a').removeClass('active');
                $(this).addClass('active');

                $('#openList').html('<p class="text-muted text-center">Switch Network</p>');
            });

            $('#chainText').html('Ethereum Mainnet <i class="bg-green ml-2"></i>');
            // $('#open').html(0);
            $('#fundSent').html(0);
            $('#tokenClaimed').html(0);
        } else {
            $('.pools-a a').removeClass('active');
            $('#loadTestnetPools').addClass('active');
            loadPools(testnetProjectsList);

            $('#loadMainnetPools').click(function(e) {
                e.preventDefault();
                $('.pools-a a').removeClass('active');
                $(this).addClass('active');

                $('#openList').html('<p class="text-muted text-center">Switch Network</p>');
            });
            $('#loadTestnetPools').click(function(e) {
                e.preventDefault();
                $('.pools-a a').removeClass('active');
                $(this).addClass('active');

                loadPools(testnetProjectsList);
            });

            $('#chainText').html('Ropsten Test Network <i class="bg-pink ml-2"></i>');
            // $('#open').html(0);
            $('#fundSent').html(0);
            $('#tokenClaimed').html(0);
        }
    }, 1000);


    ////// CREATE NEW POOL

    // INPUTS VALIDATION
    if ($('#newPoolForm').length) {
        $('#newPoolForm input').on('keyup change blur', function() {
            $('#newPoolForm input').each(function() {
                if ($(this).val() > '0' && $(this).val !== '') {
                    $(this).parents('.input-parent').find('i').removeClass('text-lighter').addClass('text-primary');
                    if ($(this).hasClass('active-if-value'))
                        $(this).addClass('bg-primary text-white');
                } else {
                    $(this).parents('.input-parent').find('i').removeClass('text-primary').addClass('text-lighter');
                    if ($(this).hasClass('active-if-value'))
                        $(this).removeClass('bg-primary text-white');
                }

                if ($(this).prop('required')) {
                    if ($(this).val() !== '' && $('input[name="currency"]').is(':checked') && $('input[name="network"]').is(':checked')) {
                        $('#createPool').removeAttr('disabled');
                    } else {
                        $('#createPool').attr('disabled', '');
                        return false;
                    }
                }
            });
        });
        $('input[name="currency"]').on('keyup change blur', function() {
            if ($('input[name="currency"]').is(':checked')) {
                let currency = $(this).val().toUpperCase();
                $('.selectedCurrency').html(currency);
            }
        });

        // DATE TIME PICKER
        $('#startDate').datetimepicker({
            format: 'DD/MM/YYYY, HH:mm',
            minDate: new Date(),
            icons: {
                time: 'fa fa-clock',
            }
        });
        $('#endDate').datetimepicker({
            format: 'DD/MM/YYYY, HH:mm',
            minDate: new Date(),
            icons: {
                time: 'fa fa-clock',
            }
        });

        $('#createPool').click(function(e) {
            e.preventDefault();
            let formVals = [];
            $('#newPoolForm input').each(function() {
                if ($(this).attr('id') === 'startDate' || $(this).attr('id') === 'endDate') {
                    let dateArgs = $(this).val().match(/\d{2,4}/g),
                        year = dateArgs[2],
                        month = parseInt(dateArgs[1]) - 1,
                        day = dateArgs[0],
                        hour = dateArgs[3],
                        minutes = dateArgs[4];

                    let milliseconds = new Date(year, month, day, hour, minutes).getTime() / 1000;
                    // console.log(milliseconds);
                    formVals.push(milliseconds);
                } else if ($(this).attr('type') === 'radio') {
                    if ($(this).is(':checked')) {
                        formVals.push($(this).val());
                    }
                } else {
                    formVals.push($(this).val());
                }
            });
            let whiteLestNewArray = ($('#whitelistInput').val().replaceAll("\\n", "")).split(',');

            formVals.push(whiteLestNewArray);

            console.log(formVals);
            // return false;
            let CImg;
            if (formVals[9] == 'USDT')
                CImg = '../images/usdt.png';
            else if (formVals[9] == 'USDT')
                CImg = '../images/usdc.png';
            else
                CImg = '../images/eth.png';
            poolObject = {
                "name": formVals[0],
                "managerAddress": formVals[1],
                "destinationAddress": formVals[2],
                "contractAddress": formVals[3],
                "maxPoolVolume": formVals[4],
                "minPoolVolume": formVals[5],
                "maxIndividualContribution": formVals[6],
                "minIndividualContribution": formVals[7],
                "network": formVals[8],
                "currency": formVals[9],
                "currencyImg": CImg,
                "startDate": formVals[10],
                "endDate": formVals[11],
                "bonusTokens": formVals[12],
                "Whitelisting": formVals[13],
                // "changingDates": formVals[14],
                "poolLink": 'https://apes.fi/pool/14'
            };
            //window.name = poolObject;
            var jsonString = JSON.stringify(poolObject);
            // GO TO NEXT PAGE
            window.location.href = 'deploy-pool.html?data=' + jsonString;
        });
    }

    $('#editPool').click(function(event) {
        window.history.go(-1);
    });

    // $('#ethLink').click(function(e) {
    //     e.preventDefault();
    // });

    // $('#deployPool').click(function(event) {
    //     $('#exampleModal').modal('show');
    // });



    //////// DEPLOY PAGE

    // DATA COMING FROM PREVIOUS PAGE (NEW POOL PAGE)

    if ($('.deploy-page').length) {
        let url = document.location.href,
            jString;
        jString = url.split('=')[1];
        jString = jString.replaceAll("%22", "\"");
        jString = jString.replaceAll("%20", " ");
        poolObject = JSON.parse(jString);
        //poolObject = window.name;
        $('#projectName').html(poolObject.name);
        if (poolObject.managerAddress !== '') {
            $('.poolManagerAddress').html(poolObject.managerAddress).addClass('text-primary').parents('.input-parent').find('i').addClass('text-primary').parent().find('.warning').addClass('d-none');
        }
        if (poolObject.destinationAddress !== '') {
            $('#destinationAddress').html(poolObject.destinationAddress).addClass('text-primary').parents('.input-parent').find('i').addClass('text-primary').parent().find('.warning').addClass('d-none');
        }
        if (poolObject.contractAddress !== '') {
            $('#tokenContractAddress').html(poolObject.contractAddress).addClass('text-primary').parents('.input-parent').find('i').addClass('text-primary').parent().find('.warning').addClass('d-none');
        }
        if (poolObject.maxPoolVolume !== '') {
            $('#hardCap').html(poolObject.maxPoolVolume).addClass('text-primary').parents('.input-parent').find('i').addClass('text-primary').parent().find('.warning').addClass('d-none');
        }
        if (poolObject.minPoolVolume !== '') {
            $('#softCap').html(poolObject.minPoolVolume).addClass('text-primary').parents('.input-parent').find('i').addClass('text-primary').parent().find('.warning').addClass('d-none');
        }
        if (poolObject.maxIndividualContribution !== '') {
            $('#maxContribution').html(poolObject.maxIndividualContribution).addClass('text-primary').parents('.input-parent').find('i').addClass('text-primary').parent().find('.warning').addClass('d-none');
        }
        if (poolObject.minIndividualContribution !== '') {
            $('#minContribution').html(poolObject.minIndividualContribution).addClass('text-primary').parents('.input-parent').find('i').addClass('text-primary').parent().find('.warning').addClass('d-none');
        }
        if (poolObject.network !== '') {
            $('#networkSelected').html(poolObject.network);
        }
        if (poolObject.currency !== '') {
            $('.selectedCurrency').html(poolObject.currency.toUpperCase());
        }
        if (poolObject.startDate !== '') {
            $('#startDate').html(new Date(poolObject.startDate * 1000).toLocaleString()).addClass('text-primary');
        }
        if (poolObject.endDate !== '') {
            $('#endDate').html(new Date(poolObject.endDate * 1000).toLocaleString()).addClass('text-primary');
        }
        if (poolObject.bonusTokens !== '') {
            $('#bonus').html(poolObject.bonusTokens + '%').addClass('text-primary');
        }
        console.log(poolObject.Whitelisting);
        if (poolObject.Whitelisting.length > 0) {
            // $('input[name="whitelist"]').attr('checked', '');
            $('#whitelistArray').html('');
            for (let i = 0; i < poolObject.Whitelisting.length; i++) {
                $('#whitelistArray').append('<p class="my-1">' + poolObject.Whitelisting[i] + '</p>');
            }
            $('#whitelistArray').addClass('text-primary').parent().find('.warning').addClass('d-none');
        }
        if (poolObject.changingDates) {
            $('input[name="changeDates"]').attr('checked', '');
        }


        // CONFIRM MM MODAL

        $('#afterConfirm').slideUp(0);

        $('#deployModalInput').keyup(function() {
            if ($(this).val() > 0 || $(this).val() !== '') {
                $('#confirmMM').removeAttr('disabled');
            } else {
                $('#confirmMM').attr('disabled', '');
            }
        });

        let t;
        if (poolObject.currency == 'eth')
            t = 0;
        else if (poolObject.currency == 'usdt')
            t = 1;
        else if (poolObject.currency == 'usdc')
            t = 2;

        $('#confirmMM').click(async function(e) {
            e.preventDefault();
            await connect();
            FACTORY.methods.CreatePool(
                poolObject.name,
                (convert(poolObject.maxPoolVolume * 10 ** 18)).toString(),
                (convert(poolObject.minPoolVolume * 10 ** 18)).toString(),
                (convert(poolObject.maxIndividualContribution * 10 ** 18)).toString(),
                (convert(poolObject.minIndividualContribution * 10 ** 18)).toString(),
                poolObject.managerAddress,
                poolObject.destinationAddress,
                poolObject.contractAddress,
                poolObject.bonusTokens,
                poolObject.startDate,
                poolObject.endDate,
                poolObject.Whitelisting,
                t
            ).send({
                from: acc,
                gasLimit: 2000000,
                gasPrice: 21000000000 //21 Gwei
            }).on('transactionHash', function(hash) {
                hash = hash;
                $('#ethLink').attr('href', 'https://ropsten.etherscan.io/tx/' + hash);
                $('#beforeConfirm').slideUp();
                $('#afterConfirm').slideDown();
            });
        });
    }


    ///// PROGRESS PAGE

    if ($('.progress-page').length) {
        $('#projectName').html(poolObject.name);
        if (poolObject.managerAddress !== '') {
            $('.poolManagerAddress').html(poolObject.managerAddress).addClass('text-primary').parents('.input-parent').find('i').addClass('text-primary');
        }

        setTimeout(function() {
            window.location.href = 'project.html';
        }, 5000);
    }


    ////// PROJECT PAGE

    if ($('.project-page').length) {

        // GET PROJECT NAME

        let url = document.location.href,
            params, projectId;
            
        params = url.split('=')[1];
        console.log('params = ', params);
        projectId = params;
        /*if (!projectId.isNumber)
            projectId = 0;*/
        console.log("PID = ", projectId);
        let origin = window.location.origin;
        console.log("origin = ", origin);
        $('#poolLink').html(origin + "/_test_/Investor/index.html?id=" + (projectId)).attr('href', origin + "/_test_/Investor/index.html?id=" + (projectId));

        //$('.projectName').html(testnetProjectsList[projectId].poolName);

        // $('.projectName').html(poolObject.name);
        // if (poolObject.managerAddress !== '') {
        //     $('#poolLink').html(poolObject.poolLink).attr('href', poolObject.poolLink);
        // }
        // if (poolObject.managerAddress !== '') {
        //     $('.poolManagerAddress').html(poolObject.managerAddress.substring(0, 6) + '...' + poolObject.managerAddress.substring(36, 42));
        // } else {
        //     $('.manager-add').hide().next('i').removeClass('d-none');
        // }
        // if (poolObject.destinationAddress !== '') {
        //     $('#destinationAddress').html(poolObject.destinationAddress.substring(0, 6) + '...' + poolObject.destinationAddress.substring(36, 42));
        //     $('#setDestinationAddBtn').addClass('d-none');
        // } else {
        //     $('.destination-add').hide().next('i').removeClass('d-none');
        // }
        // if (poolObject.contractAddress !== '') {
        //     $('#tokenContractAddress').html(poolObject.contractAddress.substring(0, 6) + '...' + poolObject.contractAddress.substring(36, 42));
        //     $('#setTokenContractBtn').addClass('d-none');
        // } else {
        //     $('.contract-add').hide().next('i').removeClass('d-none');
        // }
        // if (poolObject.maxPoolVolume !== '') {
        //     $('#hardCap').html(poolObject.maxPoolVolume);
        // }
        // if (poolObject.minPoolVolume !== '') {
        //     $('#softCap').html(poolObject.minPoolVolume);
        // }
        // if (poolObject.maxIndividualContribution !== '') {
        //     $('#maxContribution').html(poolObject.maxIndividualContribution);
        // }
        // if (poolObject.minIndividualContribution !== '') {
        //     $('#minContribution').html(poolObject.minIndividualContribution);
        // }
        // if (poolObject.network !== '') {
        //     $('#networkSelected').html(poolObject.network);
        // }
        // if (poolObject.currency !== '') {
        //     $('.selectedCurrency').html(poolObject.currency);
        //     if (poolObject.currencyImg !== '')
        //         $('.selectedCurrency.badge').html('<img src="' + poolObject.currencyImg + '" alt="" class="mr-1">' + poolObject.currency);
        // }

        // if (poolObject.startDate !== '') {
        //     $('#startDate').html(poolObject.startDate);
        // }
        // if (poolObject.endDate !== '') {
        //     $('#endDate').html(poolObject.endDate);
        // }
        // if (poolObject.bonusTokens !== '') {
        //     $('#bonus').html(poolObject.bonusTokens + '%');
        // }
        /*if (poolObject.Whitelisting) {
            $('input[name="whitelist"]').attr('checked', '');
        }
        if (poolObject.changingDates) {
            $('input[name="changeDates"]').attr('checked', '');
        }*/
    }


});

function convert(n) {
    var sign = +n < 0 ? "-" : "",
        toStr = n.toString();
    if (!/e/i.test(toStr)) {
        return n;
    }
    var [lead, decimal, pow] = n.toString()
        .replace(/^-/, "")
        .replace(/^([0-9]+)(e.*)/, "$1.$2")
        .split(/e|\./);
    return +pow < 0 ?
        sign + "0." + "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) + lead + decimal :
        sign + lead + (+pow >= decimal.length ? (decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0))) : (decimal.slice(0, +pow) + "." + decimal.slice(+pow)))
}

function updatePage() {

    // $('.progress-bar:not(.funds)').css({ 'width': poolFilled + '%' }).html(currentProgressVal);
    // let balance = 0;
    //let fundsFilled = 0;
    // $('.progress-bar.funds').css({ 'width': poolFilled + '%' });

    poolBalance /= 10 ** 18;
    $('#balance').html(poolBalance);
    
    if (status == 1) {
        $('#fundsCard').addClass('d-none');
    } else if (status == 2) { // 
        $('#fundsCard').removeClass('d-none');
        $('#tasksStatus').addClass('d-none');
        $('#sendFundsHolder').removeClass('d-none');
        // BALANCE 0
        $('#claimText').html('Waiting for ' + destTokenSymbol + ' deposit');
        $('#claimTokensBtn').attr('disabled', '');
        $('.start-progress').css({ 'color': '#787878' });
        
        // enable cancel button
        $('#cancelPoolBtn').removeClass('d-none');
    } else if (status == 3) {
        $('#claimText').html(tokensClaimedPercent + '% ' + destTokenSymbol + ' claimed');
        $('#claimTokensBtn').removeAttr('disabled');
        $('#fundsCard').removeClass('d-none');
        $('.progress-bar.funds').css({ 'width': tokensClaimedPercent + '%' });
        $('#tasksStatus').removeClass('d-none');
        $('#sendFundsHolder').addClass('d-none');
    } else if (status == 5) { // balance 0, funds sent
        $('#claimText').html('Waiting for ' + destTokenSymbol + ' deposit');
        $('#claimTokensBtn').attr('disabled', '');
        $('.start-progress').css({ 'color': '#787878' });
        $('#fundsCard').removeClass('d-none');

        $('#tasksStatus').removeClass('d-none'); // no pending tasks
        $('#sendFundsHolder').addClass('d-none'); // send funds btn
    }

    // POOL FILLED

    if (poolFilled == 100) {
        $('#contributeBtn').addClass('d-none');
        $('.progress-bar').html('');
        $('.end-progress').css({ 'color': '#fff' });
        $('.contribute-text').addClass('d-none');
        $('.countdown').html('Closed');
        $('#tasksStatus').addClass('d-none');
        $('#sendFundsHolder').removeClass('d-none');
    }

    if (whiteListArray.length > 0) {
        $('#addWhitelistBtn').addClass('d-none');
        $('#moreWhitelist').removeClass('d-none');
        $('#whitelistTable tbody').html('');
        for (let i = 0; i < whiteListArray.length; i++) {
            $('#whitelistTable tbody').append('<tr><td>' + whiteListArray[i] + '</td></tr>');
        }
    }


    // WHITELIST UPLOAD FILE
    // $('#uploadFile').change(function() {
    //     console.log($(this).val());
    //     $('.first-step').addClass('d-none');
    //     $('.second-step').removeClass('d-none');

    //     $('#whitelistFileName').html($(this).val());
    //     $('#whitelistAddCount').html('3');
    // });

    // $('#confirmWhitelist').click(function(e) {
    //     e.preventDefault();
    //     alert('you clicked confirm');
    //     $('#whitelistModal').modal('hide');
    //     $('.first-step').removeClass('d-none');
    //     $('.second-step').addClass('d-none');
    //     $('#uploadFile').val('');
    // });


    $('#destinationAddressModal').keyup(function() {
        if ($(this).val() > '0' && $(this).val !== '') {
            $(this).parents('.input-parent').find('i').removeClass('text-lighter').addClass('text-primary');
            $('#destinationNext').removeAttr('disabled');
        } else {
            $(this).parents('.input-parent').find('i').removeClass('text-primary').addClass('text-lighter');
            $('#destinationNext').attr('disabled', '');
        }
    });

    $('#destinationNext').click(function() {
        $('.first-step').addClass('d-none');
        $('.second-step').removeClass('d-none');

        $('#destinationAddressNextStep').html($('#destinationAddressModal').val());
    });

    $('#confirmDestinationAdd').click(function(e) {
        e.preventDefault();
        alert('you clicked confirm with value: ' + $('#destinationAddressModal').val());
        $('#setDestinationAddModal').modal('hide');
        $('.first-step').removeClass('d-none');
        $('.second-step').addClass('d-none');
        $('#destinationAddressModal').val('').parents('.input-parent').find('i').removeClass('text-primary').addClass('text-lighter');
    });

    $('.decimals').html('18');

    $('#tokenContractModal').keyup(function() {
        if ($(this).val() > '0' && $(this).val !== '') {
            $(this).parents('.input-parent').find('i').removeClass('text-lighter').addClass('text-primary');
            $('#contractNext').removeAttr('disabled');
        } else {
            $(this).parents('.input-parent').find('i').removeClass('text-primary').addClass('text-lighter');
            $('#contractNext').attr('disabled', '');
        }
    });

    $('#contractNext').click(function() {
        $('.first-step').addClass('d-none');
        $('.second-step').removeClass('d-none');

        $('#tokenContractNextStep').html($('#tokenContractModal').val());
    });

    $('#confirmContractAdd').click(function(e) {
        e.preventDefault();
        alert('you clicked confirm with value: ' + $('#tokenContractModal').val());
        $('#setTokenContractModal').modal('hide');
        $('.first-step').removeClass('d-none');
        $('.second-step').addClass('d-none');
        $('#tokenContractModal').val('').parents('.input-parent').find('i').removeClass('text-primary').addClass('text-lighter');
    });

    $('#claimTokensBtn').click(async function(e) {
        e.preventDefault();
        await connect();
        POOL.methods.GetTokens().send({
            from: acc,
            gasLimit: 200000,
            gasPrice: 21000000000 //21 Gwei
        }).on('transactionHash', function(hash) {
            alert('Transaction submitted on blockchain.');
        });
    });


    $('#sendFundBtn').click(async function() {
        await connect();
        POOL.methods.SendFundsToProject(

        ).send({
            from: acc,
            gasLimit: 2000000,
            gasPrice: 21000000000 //21 Gwei
        }).on('transactionHash', function(hash) {
            alert('Funds sent request submitted to blockchain');
            $('#fundsCard').removeClass('d-none');
            $('#tasksStatus').removeClass('d-none');
            $('#sendFundsHolder').addClass('d-none');
        });
    });
    
    
    $('#cancelPoolBtn').click(async function() {
        await connect();
        POOL.methods.CancelPool(
        ).send({
            from: acc,
            gasLimit: 2000000,
            gasPrice: 21000000000 //21 Gwei
        }).on('transactionHash', function(hash) {
            alert('Pool cancellation request submitted to blockchain');
        });
    });
}


// COPY TEXT

function copyToClipboard(element) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}


// LOAD PROJECTS

function loadPools(poolArray) {
    $('#openList').html('');
    for (let i = 0; i < poolArray.length; i++) {
        $('#openList').append('<li class="nav-item"><a class="nav-link" title="' + poolArray[i].poolName + '" href="project.html?id=' + poolArray[i].poolId + '"><i class="fa fa-external-link-alt mr-2"></i> ' + poolArray[i].poolName + '</a></li>');
    }
}


// COUNTDOWN

function countDown(dateVal) {
    $('.countdown').each(function() {
        let thisCount = $(this);

        let x = setInterval(function() {

            let distance = parseInt(dateVal) - new Date().getTime() / 1000;

            let days = Math.floor(distance / (3600 * 24));
            let hours = Math.floor(distance % (3600 * 24) / 3600);
            let minutes = Math.floor(distance % 3600 / 60);
            let seconds = Math.floor(distance % 60);

            if (days > 0)
                thisCount.find('.counter-holder .day').html(days + 'd :');
            else
                thisCount.find('.counter-holder .day').html('');
            if (hours > 0)
                thisCount.find('.counter-holder .hours').html(hours + 'h :');
            else
                thisCount.find('.counter-holder .hours').html('');
            if (minutes > 0)
                thisCount.find('.counter-holder .minutes').html(minutes + 'm :');
            else
                thisCount.find('.counter-holder .minutes').html('');
            if (seconds > 0)
                thisCount.find('.counter-holder .seconds').html(seconds + 's');
            else
                thisCount.find('.counter-holder .seconds').html('');

            if (distance < 0) {
                clearInterval(x);
                $('#contributeBtn').attr('disabled', '').html('Contributions closed');
                $('.contribute-text').addClass('d-none');
                $('.countdown').html('Closed');
                if (status == 1) {
                    $('#sendFundsHolder').removeClass('d-none');
                    $('#tasksStatus').addClass('d-none');
                }
            }
        }, 1000);
    });
}