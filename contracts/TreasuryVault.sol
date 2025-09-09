// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract TreasuryVault is SepoliaConfig {
    using FHE for *;
    
    struct TreasuryAsset {
        euint32 assetId;
        euint32 balance;
        euint32 value;
        euint8 assetType; // 1: ETH, 2: ERC20, 3: LP Token, 4: NFT
        bool isActive;
        string symbol;
        address tokenAddress;
        uint256 lastUpdated;
    }
    
    struct Transaction {
        euint32 transactionId;
        euint32 amount;
        euint8 transactionType; // 1: Deposit, 2: Withdraw, 3: Transfer, 4: Investment
        address from;
        address to;
        uint256 timestamp;
        string description;
    }
    
    struct PortfolioMetrics {
        euint32 totalValue;
        euint32 totalAssets;
        euint32 monthlyReturn;
        euint32 riskScore;
        uint256 lastCalculated;
    }
    
    struct DAOMember {
        address memberAddress;
        euint32 votingPower;
        euint32 reputation;
        bool isActive;
        bool isVerified;
        uint256 joinedAt;
    }
    
    mapping(uint256 => TreasuryAsset) public assets;
    mapping(uint256 => Transaction) public transactions;
    mapping(address => DAOMember) public members;
    mapping(address => euint32) public memberBalances;
    
    PortfolioMetrics public portfolioMetrics;
    
    uint256 public assetCounter;
    uint256 public transactionCounter;
    uint256 public totalMembers;
    
    address public owner;
    address public verifier;
    address public treasuryManager;
    
    // Access control
    mapping(address => bool) public authorizedUsers;
    
    event AssetAdded(uint256 indexed assetId, string symbol, address tokenAddress);
    event TransactionExecuted(uint256 indexed transactionId, address indexed from, address indexed to, uint8 transactionType);
    event MemberAdded(address indexed member, uint32 votingPower);
    event MemberRemoved(address indexed member);
    event PortfolioUpdated(uint32 totalValue, uint32 totalAssets);
    event FundsDeposited(address indexed depositor, uint32 amount);
    event FundsWithdrawn(address indexed withdrawer, uint32 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier onlyMember() {
        require(members[msg.sender].isActive, "Not a DAO member");
        _;
    }
    
    constructor(address _verifier, address _treasuryManager) {
        owner = msg.sender;
        verifier = _verifier;
        treasuryManager = _treasuryManager;
        authorizedUsers[msg.sender] = true;
        authorizedUsers[_treasuryManager] = true;
    }
    
    function addAsset(
        string memory _symbol,
        address _tokenAddress,
        externalEuint32 _initialBalance,
        externalEuint32 _initialValue,
        bytes calldata _balanceProof,
        bytes calldata _valueProof
    ) public onlyAuthorized returns (uint256) {
        require(bytes(_symbol).length > 0, "Symbol cannot be empty");
        
        uint256 assetId = assetCounter++;
        
        // Convert external encrypted values to internal
        euint32 internalBalance = FHE.fromExternal(_initialBalance, _balanceProof);
        euint32 internalValue = FHE.fromExternal(_initialValue, _valueProof);
        
        assets[assetId] = TreasuryAsset({
            assetId: FHE.asEuint32(0), // Will be set properly later
            balance: internalBalance,
            value: internalValue,
            assetType: FHE.asEuint8(2), // Default to ERC20
            isActive: true,
            symbol: _symbol,
            tokenAddress: _tokenAddress,
            lastUpdated: block.timestamp
        });
        
        emit AssetAdded(assetId, _symbol, _tokenAddress);
        return assetId;
    }
    
    function executeTransaction(
        address _to,
        externalEuint32 _amount,
        uint8 _transactionType,
        string memory _description,
        bytes calldata _amountProof
    ) public onlyMember returns (uint256) {
        require(_to != address(0), "Invalid recipient address");
        require(_transactionType >= 1 && _transactionType <= 4, "Invalid transaction type");
        
        uint256 transactionId = transactionCounter++;
        
        // Convert external encrypted amount to internal
        euint32 internalAmount = FHE.fromExternal(_amount, _amountProof);
        
        transactions[transactionId] = Transaction({
            transactionId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            transactionType: FHE.asEuint8(_transactionType),
            from: msg.sender,
            to: _to,
            timestamp: block.timestamp,
            description: _description
        });
        
        // Update member balance based on transaction type
        if (_transactionType == 1) { // Deposit
            memberBalances[msg.sender] = FHE.add(memberBalances[msg.sender], internalAmount);
        } else if (_transactionType == 2) { // Withdraw
            memberBalances[msg.sender] = FHE.sub(memberBalances[msg.sender], internalAmount);
        }
        
        emit TransactionExecuted(transactionId, msg.sender, _to, _transactionType);
        return transactionId;
    }
    
    function addMember(
        address _member,
        externalEuint32 _votingPower,
        externalEuint32 _reputation,
        bytes calldata _votingProof,
        bytes calldata _reputationProof
    ) public onlyOwner {
        require(_member != address(0), "Invalid member address");
        require(!members[_member].isActive, "Member already exists");
        
        euint32 internalVotingPower = FHE.fromExternal(_votingPower, _votingProof);
        euint32 internalReputation = FHE.fromExternal(_reputation, _reputationProof);
        
        members[_member] = DAOMember({
            memberAddress: _member,
            votingPower: internalVotingPower,
            reputation: internalReputation,
            isActive: true,
            isVerified: false,
            joinedAt: block.timestamp
        });
        
        totalMembers++;
        emit MemberAdded(_member, 0); // FHE.decrypt(internalVotingPower) - will be decrypted off-chain
    }
    
    function removeMember(address _member) public onlyOwner {
        require(members[_member].isActive, "Member does not exist");
        
        members[_member].isActive = false;
        totalMembers--;
        
        emit MemberRemoved(_member);
    }
    
    function verifyMember(address _member, bool _isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify members");
        require(members[_member].isActive, "Member does not exist");
        
        members[_member].isVerified = _isVerified;
    }
    
    function updatePortfolioMetrics(
        externalEuint32 _totalValue,
        externalEuint32 _totalAssets,
        externalEuint32 _monthlyReturn,
        externalEuint32 _riskScore,
        bytes calldata _valueProof,
        bytes calldata _assetsProof,
        bytes calldata _returnProof,
        bytes calldata _riskProof
    ) public onlyAuthorized {
        portfolioMetrics = PortfolioMetrics({
            totalValue: FHE.fromExternal(_totalValue, _valueProof),
            totalAssets: FHE.fromExternal(_totalAssets, _assetsProof),
            monthlyReturn: FHE.fromExternal(_monthlyReturn, _returnProof),
            riskScore: FHE.fromExternal(_riskScore, _riskProof),
            lastCalculated: block.timestamp
        });
        
        emit PortfolioUpdated(0, 0); // FHE.decrypt(_totalValue), FHE.decrypt(_totalAssets) - will be decrypted off-chain
    }
    
    function depositFunds(
        externalEuint32 _amount,
        bytes calldata _amountProof
    ) public onlyMember {
        euint32 internalAmount = FHE.fromExternal(_amount, _amountProof);
        
        memberBalances[msg.sender] = FHE.add(memberBalances[msg.sender], internalAmount);
        
        emit FundsDeposited(msg.sender, 0); // FHE.decrypt(internalAmount) - will be decrypted off-chain
    }
    
    function withdrawFunds(
        externalEuint32 _amount,
        bytes calldata _amountProof
    ) public onlyMember {
        euint32 internalAmount = FHE.fromExternal(_amount, _amountProof);
        
        // Check if member has sufficient balance (this would need to be done off-chain with decryption)
        memberBalances[msg.sender] = FHE.sub(memberBalances[msg.sender], internalAmount);
        
        emit FundsWithdrawn(msg.sender, 0); // FHE.decrypt(internalAmount) - will be decrypted off-chain
    }
    
    function authorizeUser(address _user, bool _authorized) public onlyOwner {
        authorizedUsers[_user] = _authorized;
    }
    
    // View functions that return encrypted data (to be decrypted off-chain)
    function getAssetInfo(uint256 _assetId) public view returns (
        string memory symbol,
        address tokenAddress,
        bool isActive,
        uint256 lastUpdated
    ) {
        TreasuryAsset storage asset = assets[_assetId];
        return (
            asset.symbol,
            asset.tokenAddress,
            asset.isActive,
            asset.lastUpdated
        );
    }
    
    function getTransactionInfo(uint256 _transactionId) public view returns (
        address from,
        address to,
        uint256 timestamp,
        string memory description
    ) {
        Transaction storage transaction = transactions[_transactionId];
        return (
            transaction.from,
            transaction.to,
            transaction.timestamp,
            transaction.description
        );
    }
    
    function getMemberInfo(address _member) public view returns (
        bool isActive,
        bool isVerified,
        uint256 joinedAt
    ) {
        DAOMember storage member = members[_member];
        return (
            member.isActive,
            member.isVerified,
            member.joinedAt
        );
    }
    
    function getPortfolioMetrics() public view returns (
        uint256 lastCalculated
    ) {
        return portfolioMetrics.lastCalculated;
    }
    
    function getMemberBalance(address _member) public view returns (uint8) {
        return 0; // FHE.decrypt(memberBalances[_member]) - will be decrypted off-chain
    }
    
    function getAssetBalance(uint256 _assetId) public view returns (uint8) {
        return 0; // FHE.decrypt(assets[_assetId].balance) - will be decrypted off-chain
    }
    
    function getAssetValue(uint256 _assetId) public view returns (uint8) {
        return 0; // FHE.decrypt(assets[_assetId].value) - will be decrypted off-chain
    }
    
    function getTotalPortfolioValue() public view returns (uint8) {
        return 0; // FHE.decrypt(portfolioMetrics.totalValue) - will be decrypted off-chain
    }
    
    function getMonthlyReturn() public view returns (uint8) {
        return 0; // FHE.decrypt(portfolioMetrics.monthlyReturn) - will be decrypted off-chain
    }
    
    function getRiskScore() public view returns (uint8) {
        return 0; // FHE.decrypt(portfolioMetrics.riskScore) - will be decrypted off-chain
    }
}
