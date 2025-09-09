# Shield Treasury Vault - Deployment Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Vercel CLI** (for deployment)
4. **WalletConnect Project ID**

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# Treasury Vault Contract Address (deployed contract address)
VITE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Network Configuration
VITE_NETWORK=sepolia
```

## Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open browser:**
Navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Vercel Deployment

### Method 1: Vercel CLI

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
# Deploy to preview
npm run deploy:preview

# Deploy to production
npm run deploy
```

### Method 2: Vercel Dashboard

1. **Connect GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - `VITE_WALLET_CONNECT_PROJECT_ID`
   - `VITE_CONTRACT_ADDRESS`
   - `VITE_NETWORK`
3. **Deploy** automatically on push to main branch

## Smart Contract Deployment

### Prerequisites for Contract Deployment

1. **Hardhat** or **Foundry**
2. **FHEVM** dependencies
3. **Sepolia testnet** access

### Contract Deployment Steps

1. **Install dependencies:**
```bash
npm install @fhevm/solidity hardhat
```

2. **Configure Hardhat:**
Create `hardhat.config.ts` with FHEVM configuration

3. **Deploy contract:**
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

4. **Update environment variables** with deployed contract address

## Security Considerations

- All sensitive data is encrypted using FHE
- Wallet-based authentication required
- Smart contract access controls
- Environment variables should be kept secure

## Troubleshooting

### Common Issues

1. **Wallet Connection Issues:**
   - Ensure WalletConnect Project ID is correct
   - Check network configuration

2. **Contract Interaction Issues:**
   - Verify contract address is correct
   - Ensure user is a verified DAO member

3. **Build Issues:**
   - Clear node_modules and reinstall
   - Check TypeScript errors

### Support

For issues and questions:
- Check the GitHub repository issues
- Review the smart contract documentation
- Contact the development team

## License

MIT License - see LICENSE file for details
