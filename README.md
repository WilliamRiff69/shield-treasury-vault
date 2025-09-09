# Shield Treasury Vault

A decentralized treasury management platform built with Fully Homomorphic Encryption (FHE) for secure, private financial operations.

## Features

- **FHE-Protected Data**: All sensitive financial data is encrypted using Fully Homomorphic Encryption
- **Wallet Integration**: Connect with popular Web3 wallets via RainbowKit
- **DAO Treasury Management**: Secure management of decentralized organization funds
- **Real-time Analytics**: Live portfolio tracking and performance metrics
- **Transaction History**: Complete audit trail of all treasury operations

## Technologies

This project is built with:

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Web3**: Wagmi, RainbowKit, Viem
- **Blockchain**: Ethereum (Sepolia testnet)
- **Encryption**: FHEVM for Fully Homomorphic Encryption
- **Charts**: Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/WilliamRiff69/shield-treasury-vault.git
cd shield-treasury-vault
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Smart Contract

The project includes a Solidity smart contract that implements FHE-protected treasury operations:

- **TreasuryVault.sol**: Main contract with FHE-encrypted financial data
- **Sepolia Testnet**: Deployed on Ethereum Sepolia for testing

## Deployment

### Vercel Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Vercel:
```bash
npx vercel --prod
```

### Environment Variables

Create a `.env.local` file with the following variables:

```
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
VITE_CONTRACT_ADDRESS=your_contract_address
```

## Security

- All sensitive data is encrypted using FHE
- Wallet-based authentication
- Smart contract access controls
- Audit trail for all operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
