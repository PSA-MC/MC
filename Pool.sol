pragma solidity ^0.6.0;
// SPDX-License-Identifier: UNLICENSED

import './SafeMath.sol';
import './IERC20.sol';
contract Pool {
    using SafeMath for uint256;
    
    /**Dynamic attributes set on deployment**/
    string public ContractName;
    uint256 public HardCap;
    uint256 public SoftCap;
    uint256 public MaxInvestment;
    uint256 public MinInvestment;
    address public ManagementAddress;
    address public DestinationAddress;
    address public TokenAddress;
    uint256 public OwnerBonus;
    mapping(address => bool) public Whitelisted;
    address[5] public whitelistedArr;
    uint256 public StartDate;
    uint256 public EndDate;
    enum SupportedPayments{ETH, USDT, USDC}
    address public InvestmentToken; // this would be marked address(0) if ether is supported
    uint256 public Status = 1;
    struct Investor{
        uint256 investment;
        uint256 claimed;
    }
    mapping (address => Investor) investors;
    uint256 public totalInvestments;
    uint256 public totalTokensReceived;
    uint256 public totalClaimed;
    uint256 private OwnerTokens;
    uint256 private tokenPerInvestment;
    
    address private constant USDT = 0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA;//0xdAC17F958D2ee523a2206206994597C13D831ec7;
    address private constant USDC = 0x7E0480Ca9fD50EB7A3855Cf53c347A1b4d6A2FF5;//0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    
    constructor(string memory _contractName, uint256 _hardCap, uint256 _softCap,
    uint256 _maxInvestment, uint256 _minInvestment, address _managementAddress,
    address _destinationAddress, address _tokenAddress, uint256 _ownerBonus,
    uint256 _startDate, uint256 _endDate, address[5] memory _whitelisted, 
    uint256 _token
    ) public{
        ContractName = _contractName;
        HardCap = _hardCap;
        SoftCap = _softCap;
        MaxInvestment = _maxInvestment;
        MinInvestment = _minInvestment;
        ManagementAddress = _managementAddress;
        DestinationAddress = _destinationAddress;
        TokenAddress = _tokenAddress;
        OwnerBonus = _ownerBonus;
        StartDate = _startDate;
        EndDate = _endDate;
        for(uint256 i = 0; i < _whitelisted.length; i++){
            Whitelisted[_whitelisted[i]] = true;
            whitelistedArr[i] = _whitelisted[i];
        }
        
        if(SupportedPayments(_token) == SupportedPayments.ETH)
            InvestmentToken = address(0);
        else if(SupportedPayments(_token) == SupportedPayments.USDT)
            InvestmentToken = USDT;
        else if(SupportedPayments(_token) == SupportedPayments.USDC)
            InvestmentToken = USDC;
        
    }
    
    receive() external payable{
        if(InvestmentToken == address(0))
            _contribute(msg.value); // Eths will get inside the contract
        else
            revert();
    }
    
    function Contribute(uint256 _amount) external payable{
        require(msg.sender != ManagementAddress, "Investments not allowed by managemenet address");
        require(IERC20(InvestmentToken).transferFrom(msg.sender, address(this), _amount), "Failed transfer"); // supported token will get inside the contract
        _contribute(_amount);
    }
    
    // Get contributions from whitelisted addresses 
    function _contribute(uint256 _amount) private onlyWhitelisted investmentOpen{
        require(investors[msg.sender].investment.add(_amount) >= MinInvestment, "investment lowered than min allowed");
        require(investors[msg.sender].investment.add(_amount) <= MaxInvestment, "investment exceeds the max allowed");
        require(totalInvestments.add(_amount) <= HardCap, "Hard cap is reached");
        
        totalInvestments = totalInvestments.add(_amount);
        investors[msg.sender].investment = investors[msg.sender].investment.add(_amount);
    }
    
    // pool manager will initiate this function to send investments to the project
    // tokens will be returned back from the project
    function SendFundsToProject() external onlyManagement softCapReached{
        if(InvestmentToken == address(0))
            payable(DestinationAddress).transfer(totalInvestments);
        else
            IERC20(InvestmentToken).transfer(DestinationAddress, totalInvestments);
        Status = 2;
    }
    
    function GetTokens() external softCapReached{
        require(investors[msg.sender].investment > 0 || msg.sender == ManagementAddress, "Not allowed");
        
        uint256 bal = IERC20(TokenAddress).balanceOf(address(this));
        uint256 difference = bal.add(totalClaimed).sub(totalTokensReceived);
        if(tokenPerInvestment == 0 || difference > 0) {
            totalTokensReceived = totalTokensReceived.add(difference);
            require(totalTokensReceived > 0, "Tokens not received");
            uint256 _oShare = onePercent(difference).mul(OwnerBonus);
            OwnerTokens = OwnerTokens.add(_oShare); // add owner's tokens
            tokenPerInvestment = tokenPerInvestment.add((difference.sub(_oShare)).div(totalInvestments));
        }
        
        uint256 tokens;
        if(msg.sender == ManagementAddress)
            tokens = OwnerTokens;
        else
            tokens = tokenPerInvestment.mul(investors[msg.sender].investment);
            
        uint256 claimable = tokens.sub(investors[msg.sender].claimed);
        require(claimable > 0 , "Already Claimed");
        
        investors[msg.sender].claimed = investors[msg.sender].claimed.add(claimable);
        totalClaimed = totalClaimed.add(claimable);
        IERC20(TokenAddress).transfer(msg.sender, claimable);
        Status = 3;
    }
    
    function Refund() external softCapNotReachedORCancelled {
        require(investors[msg.sender].investment > 0, "Not allowed");
        if(InvestmentToken == address(0))
            payable(msg.sender).transfer(investors[msg.sender].investment);
        else
            IERC20(InvestmentToken).transfer(ManagementAddress, investors[msg.sender].investment);
        investors[msg.sender].investment = 0;
        Status = 4;
    }
    
    function CancelPool() external onlyManagement {
        require(block.timestamp >= EndDate, "Pool not ended");
        uint256 investmentBalance = 0;
        
        if(InvestmentToken == address(0))
            investmentBalance = address(this).balance;
        else
            investmentBalance = IERC20(InvestmentToken).balanceOf(address(this));
        require(investmentBalance > 0, "No investment balance in pool");
        Status = 6;
    }
    
    function CheckStatus() external view returns (uint256 status){
        uint256 investmentBalance = 0;
        
        if(InvestmentToken == address(0))
            investmentBalance = address(this).balance;
        else
            investmentBalance = IERC20(InvestmentToken).balanceOf(address(this));
        
        if(Status == 6) // Pool cancelled by the management address
            return Status;
        else if(block.timestamp >= StartDate && block.timestamp <= EndDate)
            return 1;
        else if(block.timestamp > EndDate && totalInvestments < SoftCap)
            return 4;
        else if(block.timestamp > EndDate && IERC20(TokenAddress).balanceOf(address(this)) == 0 &&  investmentBalance > 0) // tokens not added yet, funds also not sent yet
            return 2;
        else if(block.timestamp > EndDate && IERC20(TokenAddress).balanceOf(address(this)) == 0 && investmentBalance == 0) // tokens not added yet, funds sent to destination
            return 5;
        else if(block.timestamp > EndDate && IERC20(TokenAddress).balanceOf(address(this)) > 0) // tokens are sent by destination
            return 3;
        else 
            return Status;
    }
    
    modifier onlyWhitelisted(){
        require(Whitelisted[msg.sender], "UnAuthorized");
        _;
    }
    
    modifier investmentOpen(){
        require(block.timestamp > StartDate && block.timestamp <= EndDate, "Investment is close");
        _;
    }
    
    modifier onlyManagement(){
        require(msg.sender == ManagementAddress, "UnAuthorized");
        _;
    }
    
    modifier softCapNotReached(){
        require(block.timestamp >= EndDate, "Pool not ended");
        require(totalInvestments < SoftCap, "SoftCap is reached");
        _;
    }
    
    modifier softCapNotReachedORCancelled{
        require(block.timestamp >= EndDate, "Pool not ended");
        require(totalInvestments < SoftCap || Status == 6, "Pool is neither cancelled nor insufficient soft cap");
        _;
    }
    
    modifier softCapReached(){
        require(block.timestamp >= EndDate, "Pool not ended");
        require(totalInvestments >= SoftCap, "SoftCap not reached");
        _;
    }
    
    // ------------------------------------------------------------------------
    // Calculates onePercent of the uint256 amount sent
    // ------------------------------------------------------------------------
    function onePercent(uint256 _tokens) internal pure returns (uint256){
        uint256 roundValue = _tokens.ceil(100);
        uint onePercentofTokens = roundValue.mul(100).div(100 * 10**uint(2));
        return onePercentofTokens;
    }
}