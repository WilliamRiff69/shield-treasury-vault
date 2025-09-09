import { useContractRead, useContractWrite, useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

// Contract ABI - This would be generated from the compiled contract
const TREASURY_VAULT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_verifier", "type": "address"},
      {"internalType": "address", "name": "_treasuryManager", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "assetId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "symbol", "type": "string"},
      {"indexed": false, "internalType": "address", "name": "tokenAddress", "type": "address"}
    ],
    "name": "AssetAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "transactionId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "from", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "to", "type": "address"},
      {"indexed": false, "internalType": "uint8", "name": "transactionType", "type": "uint8"}
    ],
    "name": "TransactionExecuted",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_symbol", "type": "string"},
      {"internalType": "address", "name": "_tokenAddress", "type": "address"},
      {"internalType": "bytes", "name": "_initialBalance", "type": "bytes"},
      {"internalType": "bytes", "name": "_initialValue", "type": "bytes"},
      {"internalType": "bytes", "name": "_balanceProof", "type": "bytes"},
      {"internalType": "bytes", "name": "_valueProof", "type": "bytes"}
    ],
    "name": "addAsset",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_to", "type": "address"},
      {"internalType": "bytes", "name": "_amount", "type": "bytes"},
      {"internalType": "uint8", "name": "_transactionType", "type": "uint8"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "bytes", "name": "_amountProof", "type": "bytes"}
    ],
    "name": "executeTransaction",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bytes", "name": "_amount", "type": "bytes"},
      {"internalType": "bytes", "name": "_amountProof", "type": "bytes"}
    ],
    "name": "depositFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bytes", "name": "_amount", "type": "bytes"},
      {"internalType": "bytes", "name": "_amountProof", "type": "bytes"}
    ],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_assetId", "type": "uint256"}],
    "name": "getAssetInfo",
    "outputs": [
      {"internalType": "string", "name": "symbol", "type": "string"},
      {"internalType": "address", "name": "tokenAddress", "type": "address"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "uint256", "name": "lastUpdated", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_member", "type": "address"}],
    "name": "getMemberInfo",
    "outputs": [
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "uint256", "name": "joinedAt", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract address - This would be the deployed contract address
const TREASURY_VAULT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export const useTreasuryVault = () => {
  const { address, isConnected } = useAccount();
  const [isMember, setIsMember] = useState(false);
  const [memberInfo, setMemberInfo] = useState<any>(null);

  // Check if user is a member
  const { data: memberData, refetch: refetchMember } = useContractRead({
    address: TREASURY_VAULT_ADDRESS as `0x${string}`,
    abi: TREASURY_VAULT_ABI,
    functionName: 'getMemberInfo',
    args: address ? [address] : undefined,
    enabled: !!address && isConnected,
  });

  useEffect(() => {
    if (memberData) {
      const [isActive, isVerified, joinedAt] = memberData as [boolean, boolean, bigint];
      setMemberInfo({ isActive, isVerified, joinedAt: Number(joinedAt) });
      setIsMember(isActive);
    }
  }, [memberData]);

  // Deposit funds function
  const { write: depositFunds, isLoading: isDepositing } = useContractWrite({
    address: TREASURY_VAULT_ADDRESS as `0x${string}`,
    abi: TREASURY_VAULT_ABI,
    functionName: 'depositFunds',
  });

  // Withdraw funds function
  const { write: withdrawFunds, isLoading: isWithdrawing } = useContractWrite({
    address: TREASURY_VAULT_ADDRESS as `0x${string}`,
    abi: TREASURY_VAULT_ABI,
    functionName: 'withdrawFunds',
  });

  // Execute transaction function
  const { write: executeTransaction, isLoading: isExecuting } = useContractWrite({
    address: TREASURY_VAULT_ADDRESS as `0x${string}`,
    abi: TREASURY_VAULT_ABI,
    functionName: 'executeTransaction',
  });

  // Add asset function
  const { write: addAsset, isLoading: isAddingAsset } = useContractWrite({
    address: TREASURY_VAULT_ADDRESS as `0x${string}`,
    abi: TREASURY_VAULT_ABI,
    functionName: 'addAsset',
  });

  return {
    isConnected,
    isMember,
    memberInfo,
    depositFunds,
    withdrawFunds,
    executeTransaction,
    addAsset,
    isDepositing,
    isWithdrawing,
    isExecuting,
    isAddingAsset,
    refetchMember,
    contractAddress: TREASURY_VAULT_ADDRESS,
  };
};

export const useAssetInfo = (assetId: number) => {
  const { data: assetData, isLoading, refetch } = useContractRead({
    address: TREASURY_VAULT_ADDRESS as `0x${string}`,
    abi: TREASURY_VAULT_ABI,
    functionName: 'getAssetInfo',
    args: [BigInt(assetId)],
  });

  return {
    assetData,
    isLoading,
    refetch,
  };
};
