$(window).on('load', function() {
    // PAGE LOADER
    $('.pre-load').stop().animate({ opacity: 0 }, 500, function() {
        $('.pre-load').css({ 'display': 'none' });
        $('body').css({ 'overflow-y': 'auto' });
    });
});
let status; //= 1;
let projectsList = [];
let startDate, endDate, acc, poolBalance, destinationToken, DT, destTokenSymbol, tokensClaimed, tokensClaimedPercent, tokensReceived;
$('.connectMM').click(async function() {
    connect();
});

async function connect() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    acc = await ethers.utils.getAddress(account);

    let addressVal = acc;
    $('.connectMM').html(addressVal.substring(0, 6) + '...' + addressVal.substring(36, 42));
}

let whiteList = [], approveValue;

$('#whiteListBtn').click(function(e) {
    e.preventDefault();
    $('#whiteList').html('');
    for (let i = 0; i < whiteList.length; i++) {
        $('#whiteList').append('<li class="py-2">' + whiteList[i] + '</li>');
    }
    $('#whitListModal').modal('show');
});

function update2() {
    POOL.methods.totalInvestments().call().then(ti => {
        POOL.methods.HardCap().call().then(hc => {
            endProgress = hc / 10 ** 18;
            currentProgressVal = ti / 10 ** 18;
            poolFilled = ((currentProgressVal / endProgress) * 100).toFixed(2);
            POOL.methods.StartDate().call().then(d => {
                startDate = d;
                POOL.methods.EndDate().call().then(d => {
                    endDate = d;
                    $('#startDate').html(new Date(startDate * 1000).toLocaleString());
                    $('#endDate').html(new Date(endDate * 1000).toLocaleString());
                    POOL.methods.TokenAddress().call().then(add => {
                        destinationToken = add;
                        $('#tokenContractAdd').html(add.substring(0, 6) + '...' + add.substring(36, 42));
                        $('#tokenContractAddF').html(add);
                        contractInitialization(destinationToken, tokenABI).then(C => {
                            DT = C;
                            DT.methods.balanceOf(poolAddress).call().then(bal => {
                                console.log(bal);
                                poolBalance = bal;
                                poolBalance /= 10 ** 18;
                                $('#balance').html(poolBalance);
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
                                console.log("status = " + r);
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

$(function() {
    // initialize factory contract
    contractInitialization(factoryContractAddress, factoryContractABI).then(C => {
        FACTORY = C;

        FACTORY.methods.totalPools().call().then(tp => {
            console.log(tp);
            for (let i = 1; i <= tp; i++) {
                FACTORY.methods.pools(i).call().then(p => {
                    projectsList[i - 1] = p;
                    $('#openList').append('<li class="nav-item"><a class="nav-link" title="' +
                        p.poolName + '" href="index.html?id=' +
                        p.poolId + '"><i class="fa fa-external-link-alt mr-2"></i> ' + p.poolName + '</a></li>');
                    // // GET PROJECT NAME

                    let url = document.location.href,
                        params, projectId;
                    params = url.split('=')[1];
                    projectId = params - 1;
                    // // if (!projectId.isNumber)
                    // //     projectId = 0;
                    if (projectId + 1 == i) {
                        $('#projectName').html(p.poolName);
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
                                    console.log('total claimed ' + tokensClaimed);
                                });
                            });
                            POOL.methods.InvestmentToken().call().then(IT => {
                                if (IT == USDT) {
                                    paymentSymbol = "USDT";
                                    contributionType = 1;
                                    tokenAddress = USDT;
                                    contractInitialization(tokenAddress, tokenABI).then(C => {
                                        TOKEN = C;
                                        update2();
                                    });
                                } else if (IT == USDC) {
                                    paymentSymbol = "USDC";
                                    contributionType = 1;
                                    tokenAddress = USDC;
                                    contractInitialization(tokenAddress, tokenABI).then(C => {
                                        TOKEN = C;
                                        update2();
                                    });
                                } else {
                                    paymentSymbol = "ETH";
                                    contributionType = 0;
                                    update2();
                                }
                            });
                            for (let x = 0; x <= 4; x++) {
                                POOL.methods.whitelistedArr(x).call().then(r => {
                                    whiteList[x] = r;
                                });
                            }

                            POOL.methods.MaxInvestment().call().then(r => {
                                r /= 10 ** 18;
                                $('#maxContribution').html(r);
                            });

                            POOL.methods.MinInvestment().call().then(r => {
                                r /= 10 ** 18;
                                $('#minContribution').html(r);
                            });

                            $('#instructionAddress').html(poolAddress.substring(0, 6) + '...' + poolAddress.substring(36, 42));
                            // RIGHT SECTION

                            $('#poolContractAdd').html(poolAddress.substring(0, 6) + '...' + poolAddress.substring(36, 42));
                            $('#poolContractAddF').html(poolAddress);

                            POOL.methods.DestinationAddress().call().then(add => {
                                $('#destinationAdd').html(add.substring(0, 6) + '...' + add.substring(36, 42));
                                $('#destinationAddF').html(add);
                            });

                            POOL.methods.OwnerBonus().call().then(add => {
                                $('#bonusTokens').html(add);
                            });
                        });
                    }
                });

            }



        });
    });

    // MENU TOGGLE
    $('.mirror').click(function() {
        $('.navbar-collapse').removeClass('show');
    });

    // CONTRIBUTION FORM

    $('#contributeBtn').click(async function() {
        await connect();
        $('#contributeModalBtn + .alert').addClass('d-none');
        $('#modalInput').val('');
    });

    $('#refundBtn').click(async function() {
        await connect();
        POOL.methods.Refund().send({
            from: acc,
            gasLimit: 200000,
            gasPrice: 21000000000 //21 Gwei
        }).on('transactionHash', function(hash) {
            alert('Transaction submitted on blockchain.');
        });
    });

    
    let contributionType;

    $('#modalInput').keyup(function() {
        if ($(this).val() > 0 && $(this).val() !== '') {
            if (contributionType === 1) {
                TOKEN.methods.allowance(acc, poolAddress).call().then(v => {
                    approveValue = v / 10 ** 18;
                    console.log("approved " + approveValue);
                    if ($(this).val() <= approveValue) {
                        // Enable the CONTRIBUTE button
                        $('#approveModalBtn').attr('disabled', '').addClass('d-none');
                        $('#approveModalBtn + p').addClass('d-none');
                        $('#contributeModalBtn').removeAttr('disabled');
                    } else {
                        // Show APPROVE button
                        $('#approveModalBtn').removeAttr('disabled').removeClass('d-none');
                        $('#approveModalBtn + p').removeClass('d-none');
                        $('#contributeModalBtn').attr('disabled', '');
                    }
                });
            } else {
                $('#approveModalBtn').attr('disabled', '').addClass('d-none');
                $('#approveModalBtn + p').addClass('d-none');
                $('#contributeModalBtn').removeAttr('disabled');
            }
        } else {
            $('#approveModalBtn').attr('disabled', '').addClass('d-none');
            $('#approveModalBtn + p').addClass('d-none');
            $('#contributeModalBtn').attr('disabled', '');
        }
    });

    $('#approveModalBtn').click(function(e) {
        e.preventDefault();
        //let formVals = $('#modalInput').val();
        //formVals = (convert(formVals * 10 ** 18)).toString();
        
        TOKEN.methods.balanceOf(acc).call().then(bal => {
        TOKEN.methods.approve(poolAddress, bal).send({
            from: acc,
            gasLimit: 30000,
            gasPrice: 21000000000 //21 Gwei
        }).on('transactionHash', function(hash) {
            $('#approveModalBtn').attr('disabled', '');
            $('#approveModalBtn').find('.before-click').addClass('d-none');
            $('#approveModalBtn').find('.after-click').removeClass('d-none');
            $('#approveModalBtn + p').html('Please wait for the approval to be confirmed');
        }).on('confirmation', function(confirmationNumber, receipt) {
            $('#approveModalBtn').find('.before-click').removeClass('d-none');
            $('#approveModalBtn').find('.after-click').addClass('d-none');

            $('#approveModalBtn').addClass('d-none');
            $('#approveModalBtn + p').addClass('d-none').html('Allow the site to move your tokens');
            $('#contributeModalBtn').removeAttr('disabled');
        });
        });
    });

    $('#contributeModalBtn').click(async function(e) {
        e.preventDefault();
        let formVals = $('#modalInput').val();
        let val = (convert(formVals * 10 ** 18)).toString();
        if (contributionType == 0) {
            val = ethers.BigNumber.from(val);
        val = ethers.utils.hexValue(val);
        var g = ethers.utils.hexValue(100000);
            const transactionHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: acc,
                    to: poolAddress,
                    value: val,
                    gas: g,
                    gasPrice: ethers.utils.hexValue(21000000000), // 21000000000
                }, ],
            });
            $('#contributeModalBtn').attr('disabled', '');
            $('#contributeModalBtn').find('.before-click').addClass('d-none');
            $('#contributeModalBtn').find('.after-click').removeClass('d-none');
            setTimeout(function() {
                $('#contributeModalBtn').find('.before-click').removeClass('d-none');
                $('#contributeModalBtn').find('.after-click').addClass('d-none');

                $('#contributeModalBtn + .alert').removeClass('d-none');
                setTimeout(function() {
                    $('#contributeModalBtn + .alert').addClass('d-none');
                }, 1000);
            }, 1500);
        } else {
            POOL.methods.Contribute(val).send({
                from: acc,
                gasLimit: 200000,
                gasPrice: 21000000000 //21 Gwei
            }).on('transactionHash', function(hash) {
                $('#contributeModalBtn').attr('disabled', '');
                $('#contributeModalBtn').find('.before-click').addClass('d-none');
                $('#contributeModalBtn').find('.after-click').removeClass('d-none');
                setTimeout(function() {
                    $('#contributeModalBtn').find('.before-click').removeClass('d-none');
                    $('#contributeModalBtn').find('.after-click').addClass('d-none');

                    $('#contributeModalBtn + .alert').removeClass('d-none');
                }, 1500);
            });
        }
    });

    $('#claimBtn').click(function(e) {
        e.preventDefault();
        POOL.methods.GetTokens().send({
            from: acc,
            gasLimit: 200000,
            gasPrice: 21000000000 //21 Gwei
        }).on('transactionHash', function(hash) {
            alert('Transaction submitted on blockchain.');
        });
    });

});

let paymentSymbol,
    poolFilled,
    endProgress = '',
    currentProgressVal = '';

function updatePage() {
    ///////////////////////////////////////////////////////
    if (paymentSymbol == "USDT")
            $('.progressSymbol').html('<img src="../images/usdt.png" alt="" class="mr-1"> ' + paymentSymbol);
        else if (paymentSymbol == "USDC")
            $('.progressSymbol').html('<img src="../images/usdc.png" alt="" class="mr-1"> ' + paymentSymbol);
        else
            $('.progressSymbol').html('<img src="../images/eth.png" alt="" class="mr-1"> ' + paymentSymbol);
    
    // CHECK STATUS
    if (status == 1) {
        $('#status1').removeClass('d-none');
        $('#status2').addClass('d-none');
        $('.status-text').html('<i class="bg-pink"></i> Live');

        // received funds stats
        $('#poolFilled').html(poolFilled);
        $('.progress-bar').css({ 'width': poolFilled + '%' }).html(currentProgressVal);
        $('.end-progress').html(endProgress);

        $('#refundCard').addClass('d-none');
        $('#refundBtn').addClass('d-none');
        $('.refund-text').addClass('d-none');
    } else if (status == 2) {
        $('#status1').addClass('d-none');
        $('#status2').removeClass('d-none');
        $('.status-text').html('<i class="bg-green"></i> Live');

        // BALANCE 0
        $('#claimText').html('Waiting for ' + destTokenSymbol + ' deposit');
        $('#claimBtn').attr('disabled', '');
        $('.start-progress').css({ 'color': '#787878' });
        // received funds stats
        $('#poolFilled').html(poolFilled);
        $('.progress-bar').css({ 'width': poolFilled + '%' }).html(currentProgressVal);
        $('.end-progress').html(endProgress);

        $('#refundCard').addClass('d-none');
        $('#refundBtn').addClass('d-none');
        $('.refund-text').addClass('d-none');
    } else if (status == 3) {
        $('#status1').addClass('d-none');
        $('#status2').removeClass('d-none');
        $('.status-text').html('<i class="bg-green"></i> Live');

        // balance is > 0
        $('#claimText').html(tokensClaimedPercent + '% ' + destTokenSymbol + ' claimed');
        $('#claimBtn').removeAttr('disabled');
        // // received funds stats
        $('#poolFilled').html(tokensClaimedPercent);
        $('.progress-bar').css({ 'width': tokensClaimedPercent + '%' }).html(tokensClaimed);
        $('.end-progress').html(tokensReceived);
        
        $('#refundCard').addClass('d-none');
        $('#refundBtn').addClass('d-none');
        $('.refund-text').addClass('d-none');
        
    } else if (status == 5) {
        $('#status1').addClass('d-none');
        $('#status2').removeClass('d-none');
        $('.status-text').html('<i class="bg-green"></i> Live');
        
        $('#claimText').html(tokensClaimedPercent + '% ' + destTokenSymbol + ' claimed');
        
        $("#claimBtn").attr("disabled", "disabled");
        //$('.contribute-text').addClass('d-none');
        
        $('#refundCard').addClass('d-none');
        $('#refundBtn').addClass('d-none');
        $('.refund-text').addClass('d-none');
        
        // received funds stats
        $('#poolFilled').html(tokensClaimedPercent);
        $('.progress-bar').css({ 'width': tokensClaimedPercent + '%' }).html(tokensClaimed);
        $('.end-progress').html(tokensReceived);
        
    } 
    ///////////////////////////SOFT CAP NOT REACHED ///////////////////////////
    else if (status == 4) {
        $('#status1').removeClass('d-none');
        $('#status2').addClass('d-none');
        $('.status-text').html('<i class="bg-green"></i> Live');
        $('#contributeBtn').addClass('d-none');
        $('.contribute-text').addClass('d-none');
        
        $('#refundCard').removeClass('d-none');
        $('#refundBtn').removeClass('d-none');
        $('.refund-text').removeClass('d-none');
        $('.refund-text').html('Soft Cap not reached. Get Refund.');
        
        // received funds stats
        $('#poolFilled').html(poolFilled);
        $('.progress-bar').css({ 'width': poolFilled + '%' }).html(currentProgressVal);
        $('.end-progress').html(endProgress);
    }
    /////////////////////////// POOL CANCELLED BY OWNER ////////////////////////
    else if (status == 6) {
        $('#status1').removeClass('d-none');
        $('#status2').addClass('d-none');
        $('.status-text').html('<i class="bg-green"></i> Live');
        $('#contributeBtn').addClass('d-none');
        $('.contribute-text').addClass('d-none');
        
        $('#refundCard').removeClass('d-none');
        $('#refundBtn').removeClass('d-none');
        $('.refund-text').removeClass('d-none');
        $('.refund-text').html('Pool is cancelled. Get Refund.');
        
        // received funds stats
        $('#poolFilled').html(poolFilled);
        $('.progress-bar').css({ 'width': poolFilled + '%' }).html(currentProgressVal);
        $('.end-progress').html(endProgress);
    }

    if (poolFilled == 100) {
        $('#claimText').html(poolFilled + '% ' + destTokenSymbol + ' claimed <i class="fa fa-check-circle ml-2 font-1x text-primary"></i>');
    }

    $('.symbol').html(paymentSymbol);
    $('.destionationSymbol').html(destTokenSymbol);


    // POOL FILLED

    if (poolFilled === 100) {
        $('#contributeBtn').attr('disabled', '').html('Contributions closed');
        $('.progress-bar').html('');
        $('.end-progress').css({ 'color': '#fff' });
        $('.contribute-text').addClass('d-none');
        $('.countdown').html('Closed');
        $('#claimBtn').attr('disabled', '');
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
                if (status == 1) {
                    $('#contributeBtn').attr('disabled', '').html('Contributions closed');
                    $('.contribute-text').addClass('d-none');
                }
                $('.countdown').html('Closed');
                // if (poolBalance == 0)
                //     status = 2;
                // else if (poolBalance > 0)
                //     status = 3;
            }
            /* else {
                            status = 1;
                        }*/
        }, 1000);
    });
}

async function contractInitialization(address, ABI) {
    const web3Instance = new Web3(window['ethereum']);
    return (await new web3Instance.eth.Contract(ABI, address));
}

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


// COPY TEXT

function copyToClipboard(element) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

let FACTORY, POOL;
let factoryContractAddress = "0x37f564c7670b1B53a8C76DC58f78CcC9c719d27C";
let factoryContractABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"child","type":"address"},{"indexed":false,"internalType":"uint256","name":"poolId","type":"uint256"}],"name":"PoolCreated","type":"event"},{"inputs":[{"internalType":"string","name":"_contractName","type":"string"},{"internalType":"uint256","name":"_hardCap","type":"uint256"},{"internalType":"uint256","name":"_softCap","type":"uint256"},{"internalType":"uint256","name":"_maxInvestment","type":"uint256"},{"internalType":"uint256","name":"_minInvestment","type":"uint256"},{"internalType":"address","name":"_managementAddress","type":"address"},{"internalType":"address","name":"_destinationAddress","type":"address"},{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_ownerBonus","type":"uint256"},{"internalType":"uint256","name":"_startDate","type":"uint256"},{"internalType":"uint256","name":"_endDate","type":"uint256"},{"internalType":"address[5]","name":"_whitelisted","type":"address[5]"},{"internalType":"uint256","name":"_token","type":"uint256"}],"name":"CreatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"pools","outputs":[{"internalType":"uint256","name":"poolId","type":"uint256"},{"internalType":"string","name":"poolName","type":"string"},{"internalType":"address","name":"poolAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPools","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
let poolAddress, tokenAddress;
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