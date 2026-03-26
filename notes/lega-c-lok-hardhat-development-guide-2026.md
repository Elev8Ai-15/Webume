# Lega-C-Lok: Hardhat Smart Contract Development Guide

**Research Date:** 2026-03-24
**Project:** Lega-C-Lok -- Blockchain-Powered Digital Inheritance Platform
**Target Chain:** Polygon PoS (Amoy Testnet + Mainnet)
**Researcher:** Elev8 AI Ops Research Analyst

---

## Question

What are the comprehensive best practices for building and deploying smart contracts on Polygon using Hardhat for the Lega-C-Lok project, covering setup, testing, security (ZKP, Shamir's Secret Sharing, Chainlink oracles), deployment, and frontend integration?

---

## Table of Contents

1. [Solidity Version](#1-solidity-version)
2. [Hardhat Setup](#2-hardhat-setup)
3. [Project Structure](#3-project-structure--monorepo-integration)
4. [Hardhat Configuration](#4-hardhat-configuration)
5. [Polygon Network Details](#5-polygon-network-details)
6. [Alchemy Integration](#6-alchemy-integration)
7. [OpenZeppelin & Security](#7-openzeppelin--security)
8. [Upgradeable Contracts (UUPS Proxy)](#8-upgradeable-contracts-uups-proxy)
9. [ZKP Integration (Circom + snarkjs)](#9-zkp-integration-circom--snarkjs)
10. [Chainlink Oracle Integration](#10-chainlink-oracle-integration)
11. [Testing Best Practices](#11-testing-best-practices)
12. [Deployment Scripts & Verification](#12-deployment-scripts--verification)
13. [Frontend Integration](#13-frontend-integration)
14. [Gas Optimization](#14-gas-optimization)
15. [Environment Variables & Secrets](#15-environment-variables--secrets)
16. [Contract Architecture Summary](#16-contract-architecture-summary)
17. [Recommended Development Workflow](#17-recommended-development-workflow)
18. [Sources](#18-sources)
19. [Gaps & Open Questions](#19-gaps--open-questions)

---

## 1. Solidity Version

**Recommendation: Use Solidity 0.8.28**

- The latest stable release is **v0.8.34** (Feb 18, 2026), which is a bugfix for a transient storage bug.
- Versions 0.8.29+ introduce experimental features (EOF, custom storage layouts, Osaka EVM) that are not yet needed.
- **v0.8.28** is the most battle-tested version with wide tooling support, transient storage support, and no known critical bugs for standard usage patterns.
- OpenZeppelin contracts v5.x targets `^0.8.20`, so 0.8.28 is fully compatible.

**If you want the absolute latest bugfixes**, use 0.8.34, but know that 0.8.29-0.8.33 had a transient storage bug that was patched. Since Lega-C-Lok does not use transient storage (`tstore`/`tload`), any version from 0.8.28 to 0.8.34 is safe.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
```

---

## 2. Hardhat Setup

### Hardhat 2 vs Hardhat 3

**Recommendation: Use Hardhat 2 (latest v2.x) for now.**

- **Hardhat 3** (v3.1.12) is production-ready as of Aug 2025, but its first-class chain support is limited to Ethereum Mainnet and OP Mainnet. Polygon requires the "generic chain type" fallback.
- Hardhat 3 requires Node.js v22.10.0+, uses ESM by default, and has a new plugin system. Many community plugins and tutorials have not fully migrated yet.
- Hardhat 2 has the most mature ecosystem for Polygon: plugins, tutorials, and community support.
- **Migrate to Hardhat 3 when Polygon gets first-class support.**

### Installation (Hardhat 2)

```bash
cd packages/contracts
pnpm init
pnpm add -D hardhat @nomicfoundation/hardhat-toolbox typescript ts-node @types/node
pnpm add -D @nomicfoundation/hardhat-verify
pnpm add dotenv
```

### Key Plugins (included in hardhat-toolbox)

| Plugin | Purpose |
|--------|---------|
| `@nomicfoundation/hardhat-toolbox` | All-in-one: ethers.js, chai matchers, gas reporter, coverage, typechain, network helpers, verify |
| `@nomicfoundation/hardhat-verify` | Contract verification on Etherscan/PolygonScan |
| `hardhat-gas-reporter` | Gas usage analytics per function |
| `solidity-coverage` | Test coverage analysis |
| `@typechain/hardhat` | TypeScript type generation from ABIs |
| `hardhat-deploy` | (Optional) Named deploy scripts with tags and dependencies |

### Additional Plugins for This Project

```bash
pnpm add -D @openzeppelin/hardhat-upgrades    # UUPS proxy deployment
pnpm add @openzeppelin/contracts               # Security primitives
pnpm add @openzeppelin/contracts-upgradeable   # Upgradeable versions
pnpm add @chainlink/contracts                  # Chainlink integration
```

---

## 3. Project Structure / Monorepo Integration

The Lega-C-Lok project is already a pnpm-based monorepo with `client/`, `server/`, `shared/`, and `drizzle/` directories. The existing `shared/webume-integration/chains.ts` already defines Polygon chain IDs 137 and 80002 with Alchemy RPC URLs.

### Recommended Approach: Add a `contracts/` Package

```
Lega-C-Lok/
+-- client/                    # React frontend (existing)
+-- server/                    # Express + tRPC backend (existing)
+-- shared/                    # Shared types (existing)
+-- drizzle/                   # Database schema (existing)
+-- contracts/                 # NEW: Hardhat smart contracts
|   +-- contracts/             # Solidity source files
|   |   +-- DigitalLegacyVaultV2.sol
|   |   +-- ZKPIdentityVerifier.sol
|   |   +-- Groth16Verifier.sol     # Auto-generated by snarkjs
|   |   +-- MockOracle.sol
|   |   +-- interfaces/
|   |   |   +-- IDigitalLegacyVault.sol
|   |   |   +-- IZKPVerifier.sol
|   |   +-- libraries/
|   |   |   +-- VaultLib.sol
|   |   |   +-- GuardianLib.sol
|   |   +-- mocks/
|   |       +-- MockChainlinkOracle.sol
|   +-- test/                  # Hardhat tests
|   |   +-- DigitalLegacyVaultV2.test.ts
|   |   +-- ZKPIdentityVerifier.test.ts
|   |   +-- Groth16Verifier.test.ts
|   |   +-- helpers/
|   |       +-- fixtures.ts
|   |       +-- constants.ts
|   +-- scripts/               # Utility scripts
|   |   +-- generate-proof.ts
|   |   +-- export-abi.ts
|   +-- ignition/              # Hardhat Ignition deploy modules
|   |   +-- modules/
|   |       +-- DeployVault.ts
|   |       +-- DeployVerifier.ts
|   |       +-- DeployAll.ts
|   +-- circuits/              # Circom ZKP circuits
|   |   +-- identity_verifier.circom
|   |   +-- build/             # Compiled circuit artifacts
|   |   +-- keys/              # Proving/verification keys
|   +-- typechain-types/       # Auto-generated TypeScript types
|   +-- coverage/              # Test coverage reports
|   +-- hardhat.config.ts
|   +-- package.json
|   +-- tsconfig.json
|   +-- .env                   # Local secrets (gitignored)
|   +-- .env.example           # Template for env vars
+-- package.json               # Root monorepo config
+-- pnpm-workspace.yaml        # Workspace definition
```

### Update pnpm-workspace.yaml

Add the contracts package to your workspace:

```yaml
packages:
  - 'client'
  - 'server'
  - 'shared'
  - 'contracts'
```

### contracts/package.json

```json
{
  "name": "@lega-c-lok/contracts",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "test:gas": "REPORT_GAS=true hardhat test",
    "coverage": "hardhat coverage",
    "deploy:amoy": "hardhat ignition deploy ignition/modules/DeployAll.ts --network amoy --verify",
    "deploy:polygon": "hardhat ignition deploy ignition/modules/DeployAll.ts --network polygon --verify",
    "verify": "hardhat verify --network amoy",
    "clean": "hardhat clean",
    "export-abi": "ts-node scripts/export-abi.ts",
    "circuits:compile": "bash circuits/compile.sh",
    "circuits:setup": "bash circuits/setup.sh",
    "circuits:verifier": "snarkjs zkey export solidityverifier circuits/keys/final.zkey contracts/Groth16Verifier.sol"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^5.0.0",
    "@nomicfoundation/hardhat-verify": "^2.0.0",
    "@openzeppelin/hardhat-upgrades": "^3.0.0",
    "@typechain/hardhat": "^9.0.0",
    "hardhat": "^2.22.0",
    "hardhat-gas-reporter": "^2.0.0",
    "solidity-coverage": "^0.8.0",
    "typescript": "^5.5.0",
    "ts-node": "^10.9.0",
    "@types/node": "^22.0.0"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^5.1.0",
    "@openzeppelin/contracts-upgradeable": "^5.1.0",
    "@chainlink/contracts": "^1.3.0",
    "dotenv": "^16.4.0",
    "snarkjs": "^0.7.0"
  }
}
```

---

## 4. Hardhat Configuration

### contracts/hardhat.config.ts

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";

const config: HardhatUserConfig = {
  // -------------------------------------------------------
  // Solidity Compiler
  // -------------------------------------------------------
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Balance between deploy cost and runtime cost
      },
      viaIR: false, // Enable only if hitting "stack too deep" errors
      evmVersion: "cancun",
    },
  },

  // -------------------------------------------------------
  // Networks
  // -------------------------------------------------------
  networks: {
    // Local development
    hardhat: {
      chainId: 31337,
      // Optional: fork Polygon Amoy for realistic testing
      // forking: {
      //   url: `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      //   blockNumber: 12000000,  // Pin to a specific block for reproducibility
      // },
    },

    // Polygon Amoy Testnet
    amoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      chainId: 80002,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: "auto",
      // Recommended: wait for confirmations
      // timeout: 60000,
    },

    // Polygon Mainnet
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      chainId: 137,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: "auto",
    },
  },

  // -------------------------------------------------------
  // Contract Verification (PolygonScan)
  // -------------------------------------------------------
  etherscan: {
    apiKey: {
      polygon: ETHERSCAN_API_KEY,
      polygonAmoy: ETHERSCAN_API_KEY,
      // Note: Etherscan API v2 keys work across all Etherscan-supported chains
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
    ],
  },

  // -------------------------------------------------------
  // Sourcify Verification (alternative to Etherscan)
  // -------------------------------------------------------
  sourcify: {
    enabled: true,
  },

  // -------------------------------------------------------
  // Gas Reporter
  // -------------------------------------------------------
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    token: "POL",          // Polygon's native token (formerly MATIC)
    coinmarketcap: COINMARKETCAP_API_KEY,
    outputFile: "gas-report.txt",
    noColors: true,
  },

  // -------------------------------------------------------
  // TypeChain (auto-generates TypeScript types from ABIs)
  // -------------------------------------------------------
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },

  // -------------------------------------------------------
  // Paths
  // -------------------------------------------------------
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
```

### contracts/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist",
    "declaration": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "./hardhat.config.ts",
    "./scripts/**/*.ts",
    "./test/**/*.ts",
    "./ignition/**/*.ts",
    "./typechain-types/**/*.ts"
  ],
  "files": ["./hardhat.config.ts"]
}
```

---

## 5. Polygon Network Details

| Parameter | Amoy Testnet | Mainnet |
|-----------|-------------|---------|
| **Chain ID** | 80002 | 137 |
| **Native Token** | POL (test) | POL |
| **Block Time** | ~2 seconds | ~2 seconds |
| **Explorer** | https://amoy.polygonscan.com | https://polygonscan.com |
| **Faucet** | https://faucet.polygon.technology | N/A |
| **Alchemy RPC** | `polygon-amoy.g.alchemy.com/v2/` | `polygon-mainnet.g.alchemy.com/v2/` |
| **Public RPC** | `https://rpc-amoy.polygon.technology` | `https://polygon-rpc.com` |

**Important:** The old Mumbai testnet is deprecated. Amoy is the current PoS testnet.

---

## 6. Alchemy Integration

### Setup

1. Create a free account at https://www.alchemy.com/
2. Create a new app, select "Polygon PoS" as the chain
3. Copy your API key
4. For testnet, create a second app on "Polygon Amoy"

### RPC URL Format

```
Mainnet:  https://polygon-mainnet.g.alchemy.com/v2/{YOUR_API_KEY}
Amoy:     https://polygon-amoy.g.alchemy.com/v2/{YOUR_API_KEY}
```

### Why Alchemy Over Public RPCs

- Rate limiting protection
- Enhanced APIs (trace, debug, NFT, etc.)
- WebSocket support for event listening
- Dashboard analytics and alerts
- Free tier is generous (300M compute units/month)

**Note:** The Lega-C-Lok project already uses Alchemy URLs in `shared/webume-integration/chains.ts`, so this aligns with existing infrastructure.

---

## 7. OpenZeppelin & Security

### Core Contracts to Use

```bash
pnpm add @openzeppelin/contracts @openzeppelin/contracts-upgradeable
```

| Contract | Purpose in Lega-C-Lok |
|----------|----------------------|
| `OwnableUpgradeable` | Admin access control for vault management |
| `ReentrancyGuardUpgradeable` | Prevent reentrancy on claim/withdrawal functions |
| `PausableUpgradeable` | Emergency pause capability |
| `UUPSUpgradeable` | Upgradeable proxy pattern |
| `Initializable` | Safe initialization for proxy contracts |
| `AccessControlUpgradeable` | Role-based access (GUARDIAN_ROLE, ADMIN_ROLE) |
| `ECDSA` | Signature verification for guardian operations |
| `MerkleProof` | Efficient verification of beneficiary lists |

### DigitalLegacyVaultV2 Skeleton

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract DigitalLegacyVaultV2 is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    // --- Structs ---
    struct Vault {
        bytes32 did;                    // Decentralized Identity hash
        uint256 lastCheckIn;            // Timestamp of last check-in
        uint256 checkInInterval;        // Required interval (e.g., 90 days)
        uint256 gracePeriod;            // Grace period after missed check-in
        bool isActive;
        bool isRevoked;
        address owner;
    }

    struct Guardian {
        address guardianAddress;
        bytes32 shareHash;              // Hash of Shamir's share
        bool isActive;
    }

    struct Beneficiary {
        address beneficiaryAddress;
        bytes32 identityCommitment;     // ZKP identity commitment
        uint256 sharePercentage;        // Basis points (e.g., 5000 = 50%)
    }

    // --- State Variables ---
    mapping(bytes32 => Vault) public vaults;                    // vaultId => Vault
    mapping(bytes32 => Guardian[]) public guardians;            // vaultId => Guardians
    mapping(bytes32 => Beneficiary[]) public beneficiaries;     // vaultId => Beneficiaries
    mapping(bytes32 => bool) public claimInitiated;             // vaultId => claim status

    address public zkpVerifier;          // ZKPIdentityVerifier contract address
    address public oracleVerifier;       // Chainlink oracle contract address

    uint256 public vaultCount;

    // --- Events ---
    event VaultCreated(bytes32 indexed vaultId, address indexed owner, bytes32 did);
    event CheckIn(bytes32 indexed vaultId, uint256 timestamp);
    event GuardianAdded(bytes32 indexed vaultId, address indexed guardian);
    event GuardianRemoved(bytes32 indexed vaultId, address indexed guardian);
    event BeneficiaryDesignated(bytes32 indexed vaultId, address indexed beneficiary);
    event ClaimInitiated(bytes32 indexed vaultId, address indexed claimant);
    event ClaimVerified(bytes32 indexed vaultId, address indexed beneficiary);
    event VaultRevoked(bytes32 indexed vaultId);

    // --- Initializer (replaces constructor for UUPS) ---
    function initialize(
        address _zkpVerifier,
        address _oracleVerifier
    ) public initializer {
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        zkpVerifier = _zkpVerifier;
        oracleVerifier = _oracleVerifier;
    }

    // --- Core Functions ---
    function createVault(
        bytes32 _did,
        uint256 _checkInInterval,
        uint256 _gracePeriod
    ) external whenNotPaused returns (bytes32) {
        // Implementation
    }

    function checkIn(bytes32 _vaultId) external {
        // Dead man's switch check-in
    }

    function addGuardian(
        bytes32 _vaultId,
        address _guardian,
        bytes32 _shareHash
    ) external {
        // Add guardian with Shamir's share hash
    }

    function removeGuardian(bytes32 _vaultId, address _guardian) external {
        // Remove guardian
    }

    function designateBeneficiary(
        bytes32 _vaultId,
        address _beneficiary,
        bytes32 _identityCommitment,
        uint256 _sharePercentage
    ) external {
        // Add beneficiary with identity commitment for ZKP
    }

    function initiateClaim(
        bytes32 _vaultId,
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        uint256[] calldata _pubSignals
    ) external nonReentrant {
        // Verify ZKP proof, check dead man's switch expired
    }

    function revokeVault(bytes32 _vaultId) external {
        // Vault owner revokes
    }

    // --- UUPS Required ---
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
```

### Shamir's Secret Sharing -- Implementation Pattern

**Key insight from research:** Shamir's Secret Sharing should be performed OFF-CHAIN, not in Solidity. The smart contract only stores and verifies share hashes.

**Why off-chain:**
- Finite field arithmetic in Solidity is extremely gas-expensive
- The secret (recovery key) should never exist on-chain
- Shares are distributed to guardians via the frontend/backend

**On-chain role:**
- Store `bytes32 shareHash` for each guardian (hash of their share)
- When guardians submit shares for recovery, verify hashes match
- Track threshold: e.g., 3-of-5 guardians must submit valid shares
- The actual secret reconstruction happens off-chain after threshold is met

**Recommended library:** Use `@splitsoftware/shamir` or `secrets.js` in the Node.js backend/frontend for share generation and reconstruction.

---

## 8. Upgradeable Contracts (UUPS Proxy)

### Why UUPS Over Transparent Proxy

- UUPS is cheaper to deploy (upgrade logic lives in implementation, not proxy)
- OpenZeppelin recommends UUPS for new projects
- The proxy contract is minimal -- just delegates calls
- Upgrade authorization is in the implementation contract (`_authorizeUpgrade`)

### Deployment with OpenZeppelin Hardhat Upgrades

```typescript
// ignition/modules/DeployVault.ts (or use scripts)
import { ethers, upgrades } from "hardhat";

async function main() {
  const ZKPVerifier = await ethers.getContractFactory("ZKPIdentityVerifier");
  const zkpVerifier = await ZKPVerifier.deploy();
  await zkpVerifier.waitForDeployment();

  const Vault = await ethers.getContractFactory("DigitalLegacyVaultV2");
  const vault = await upgrades.deployProxy(
    Vault,
    [await zkpVerifier.getAddress(), "0x0000000000000000000000000000000000000000"],
    { kind: "uups" }
  );
  await vault.waitForDeployment();

  console.log("Vault proxy deployed to:", await vault.getAddress());
}
```

### Upgrade Pattern

```typescript
async function upgrade() {
  const VaultV3 = await ethers.getContractFactory("DigitalLegacyVaultV3");
  const upgraded = await upgrades.upgradeProxy(PROXY_ADDRESS, VaultV3);
  console.log("Vault upgraded at:", await upgraded.getAddress());
}
```

### Critical Rules for Upgradeable Contracts

1. **Never use constructors** -- use `initialize()` with `initializer` modifier
2. **Never set initial values in variable declarations** -- set them in `initialize()`
3. **Never remove or reorder state variables** -- only append new ones at the end
4. **Always inherit `Initializable` first** in the inheritance chain
5. **Always include `_authorizeUpgrade`** with proper access control
6. **Add a storage gap** for future variables:

```solidity
// Reserve 50 storage slots for future upgrades
uint256[50] private __gap;
```

---

## 9. ZKP Integration (Circom + snarkjs)

### Overview

The ZKP system verifies beneficiary identity without revealing sensitive information. The Groth16 proving system is used because it produces the smallest proofs (3 group elements) with the fastest verification time.

### Workflow

```
1. Write circuit    ->  circuits/identity_verifier.circom
2. Compile          ->  circom identity_verifier.circom --r1cs --wasm --sym
3. Trusted setup    ->  snarkjs groth16 setup (powers of tau + phase 2)
4. Generate proof   ->  snarkjs groth16 prove (off-chain, in browser/backend)
5. Export verifier  ->  snarkjs zkey export solidityverifier -> Groth16Verifier.sol
6. Deploy verifier  ->  Deploy Groth16Verifier.sol to Polygon
7. Verify on-chain  ->  Call verifyProof() from DigitalLegacyVaultV2
```

### Circuit Example (Identity Verification)

```circom
pragma circom 2.1.6;

include "node_modules/circomlib/circuits/poseidon.circom";

// Proves: "I know a secret that hashes to the public commitment"
template IdentityVerifier() {
    // Private inputs (known only to the prover)
    signal input secret;           // The beneficiary's secret
    signal input nullifier;        // Prevents double-claiming

    // Public inputs (visible on-chain)
    signal output commitment;      // Poseidon(secret, nullifier)
    signal output nullifierHash;   // Poseidon(nullifier)

    // Compute commitment
    component hasher = Poseidon(2);
    hasher.inputs[0] <== secret;
    hasher.inputs[1] <== nullifier;
    commitment <== hasher.out;

    // Compute nullifier hash (to prevent double-spend)
    component nullHasher = Poseidon(1);
    nullHasher.inputs[0] <== nullifier;
    nullifierHash <== nullHasher.out;
}

component main {public []} = IdentityVerifier();
```

### ZKPIdentityVerifier.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Groth16Verifier.sol";  // Auto-generated by snarkjs

contract ZKPIdentityVerifier {
    Groth16Verifier public verifier;

    mapping(bytes32 => bool) public usedNullifiers;  // Prevent double-claims
    mapping(bytes32 => bool) public validCommitments; // Registered identity commitments

    event IdentityVerified(bytes32 indexed commitment, bytes32 nullifierHash);

    constructor(address _verifier) {
        verifier = Groth16Verifier(_verifier);
    }

    function registerCommitment(bytes32 _commitment) external {
        validCommitments[_commitment] = true;
    }

    function verifyIdentity(
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        uint256[] calldata _pubSignals
    ) external returns (bool) {
        // _pubSignals[0] = commitment
        // _pubSignals[1] = nullifierHash

        bytes32 commitment = bytes32(_pubSignals[0]);
        bytes32 nullifierHash = bytes32(_pubSignals[1]);

        require(validCommitments[commitment], "Unknown commitment");
        require(!usedNullifiers[nullifierHash], "Nullifier already used");

        bool isValid = verifier.verifyProof(_pA, _pB, _pC, _pubSignals);
        require(isValid, "Invalid ZKP proof");

        usedNullifiers[nullifierHash] = true;
        emit IdentityVerified(commitment, nullifierHash);

        return true;
    }
}
```

### Trusted Setup Ceremony

For production, the Groth16 trusted setup requires:

1. **Phase 1 (Powers of Tau)** -- universal, reusable across circuits. Use an existing ceremony like Hermez or run your own.
2. **Phase 2** -- circuit-specific. Must be done for each circuit.

```bash
# Phase 1: Download existing powers of tau (recommended for production)
wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau

# Phase 2: Circuit-specific setup
snarkjs groth16 setup identity_verifier.r1cs powersOfTau28_hez_final_15.ptau circuit_0000.zkey

# Contribute randomness (repeat with multiple parties for security)
snarkjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="First contribution"

# Export verification key
snarkjs zkey export verificationkey circuit_0001.zkey verification_key.json

# Generate Solidity verifier
snarkjs zkey export solidityverifier circuit_0001.zkey contracts/Groth16Verifier.sol
```

### Required npm Packages

```bash
pnpm add -D snarkjs circomlib
# Install circom compiler separately (Rust binary)
# See: https://docs.circom.io/getting-started/installation/
```

---

## 10. Chainlink Oracle Integration

### Use Case: Death Certificate Verification

Chainlink enables the DigitalLegacyVaultV2 contract to verify death certificates from off-chain APIs (government vital records systems, trusted third-party services).

### Two Approaches

#### Option A: Chainlink Functions (Recommended for 2026)

Chainlink Functions is a serverless platform that lets smart contracts call any external API. This is the modern, preferred approach.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract DeathCertificateOracle is FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public lastRequestId;
    bytes public lastResponse;
    bytes public lastError;

    // Chainlink Functions router address (Polygon Amoy)
    // Get from: https://docs.chain.link/chainlink-functions/supported-networks
    constructor(address router) FunctionsClient(router) {}

    function requestVerification(
        string calldata source,      // JavaScript code to execute
        bytes calldata encryptedSecretsUrls,
        string[] calldata args,      // e.g., ["certificateId", "ssn_hash"]
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donId
    ) external returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);

        if (encryptedSecretsUrls.length > 0) {
            req.addSecretsReference(encryptedSecretsUrls);
        }
        if (args.length > 0) {
            req.setArgs(args);
        }

        lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donId
        );

        return lastRequestId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        lastResponse = response;
        lastError = err;
        // Decode response and update vault status
    }
}
```

#### Option B: MockOracle (For Testing)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MockOracle {
    mapping(bytes32 => bool) public verifiedDeaths;

    event DeathVerified(bytes32 indexed vaultId, bool isVerified);

    // In production, only Chainlink nodes can call this
    // In testing, anyone can (for simulation)
    function verifyDeath(bytes32 _vaultId, bool _isVerified) external {
        verifiedDeaths[_vaultId] = _isVerified;
        emit DeathVerified(_vaultId, _isVerified);
    }

    function isDeathVerified(bytes32 _vaultId) external view returns (bool) {
        return verifiedDeaths[_vaultId];
    }
}
```

### Chainlink Functions Setup on Polygon Amoy

1. Go to https://functions.chain.link/
2. Create a subscription on Polygon Amoy
3. Fund it with testnet LINK tokens (get from faucet)
4. Note the subscription ID
5. Add your consumer contract address to the subscription
6. Key env vars: `CHAINLINK_FUNCTIONS_ROUTER`, `CHAINLINK_DON_ID`, `CHAINLINK_SUBSCRIPTION_ID`

### Chainlink Automation (Dead Man's Switch)

Chainlink Automation can be used to automatically check if a vault owner has missed their check-in:

```solidity
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

// In DigitalLegacyVaultV2:
function checkUpkeep(bytes calldata)
    external view returns (bool upkeepNeeded, bytes memory performData)
{
    // Check all vaults for missed check-ins
    // Return true if any vault has expired its check-in + grace period
}

function performUpkeep(bytes calldata performData) external {
    // Trigger the dead man's switch for expired vaults
}
```

---

## 11. Testing Best Practices

### Test Structure

```typescript
// test/DigitalLegacyVaultV2.test.ts
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { DigitalLegacyVaultV2 } from "../typechain-types";

describe("DigitalLegacyVaultV2", function () {
  // Use fixtures for efficient test setup (snapshots)
  async function deployVaultFixture() {
    const [owner, guardian1, guardian2, beneficiary] = await ethers.getSigners();

    const Groth16Verifier = await ethers.getContractFactory("Groth16Verifier");
    const groth16Verifier = await Groth16Verifier.deploy();

    const ZKPVerifier = await ethers.getContractFactory("ZKPIdentityVerifier");
    const zkpVerifier = await ZKPVerifier.deploy(await groth16Verifier.getAddress());

    const MockOracle = await ethers.getContractFactory("MockOracle");
    const mockOracle = await MockOracle.deploy();

    const Vault = await ethers.getContractFactory("DigitalLegacyVaultV2");
    const vault = await upgrades.deployProxy(
      Vault,
      [await zkpVerifier.getAddress(), await mockOracle.getAddress()],
      { kind: "uups" }
    );

    return { vault, zkpVerifier, mockOracle, groth16Verifier, owner, guardian1, guardian2, beneficiary };
  }

  describe("Vault Creation", function () {
    it("should create a vault with valid DID", async function () {
      const { vault, owner } = await loadFixture(deployVaultFixture);
      const did = ethers.keccak256(ethers.toUtf8Bytes("did:example:123"));
      const tx = await vault.createVault(did, 90 * 24 * 3600, 7 * 24 * 3600);
      await expect(tx).to.emit(vault, "VaultCreated");
    });

    it("should revert when creating duplicate vault", async function () {
      // ...
    });
  });

  describe("Dead Man's Switch", function () {
    it("should allow check-in within interval", async function () {
      // ...
    });

    it("should trigger after missed check-in + grace period", async function () {
      const { vault } = await loadFixture(deployVaultFixture);
      // Use hardhat time manipulation
      await time.increase(90 * 24 * 3600 + 7 * 24 * 3600 + 1);
      // Assert the vault is now claimable
    });
  });

  describe("Guardian Management", function () {
    it("should add guardian with share hash", async function () { /* ... */ });
    it("should remove guardian", async function () { /* ... */ });
    it("should revert if non-owner adds guardian", async function () { /* ... */ });
  });

  describe("ZKP Claim Verification", function () {
    it("should verify valid ZKP proof and initiate claim", async function () { /* ... */ });
    it("should reject invalid proof", async function () { /* ... */ });
    it("should prevent double-claiming with same nullifier", async function () { /* ... */ });
  });

  describe("Upgradeability", function () {
    it("should upgrade to V3 preserving state", async function () { /* ... */ });
    it("should only allow owner to upgrade", async function () { /* ... */ });
  });
});
```

### Key Testing Patterns

| Pattern | Purpose |
|---------|---------|
| `loadFixture()` | Snapshot-based test isolation (fastest) |
| `time.increase()` | Manipulate block timestamp (dead man's switch) |
| `time.setNextBlockTimestamp()` | Set exact timestamp for next block |
| `expect(...).to.be.revertedWith()` | Assert revert messages |
| `expect(...).to.emit()` | Assert event emission |
| `ethers.getSigners()` | Get test accounts for different roles |
| `upgrades.deployProxy()` | Test proxy deployment |

### Running Tests

```bash
# Run all tests
pnpm hardhat test

# Run with gas reporting
REPORT_GAS=true pnpm hardhat test

# Run specific test file
pnpm hardhat test test/DigitalLegacyVaultV2.test.ts

# Run with coverage (separate from gas reporting)
pnpm hardhat coverage

# Run tests on forked Polygon Amoy
pnpm hardhat test --network hardhat  # with forking enabled in config
```

### Coverage Target

- Aim for **90%+ line coverage** and **80%+ branch coverage**
- Contracts with less than 80% coverage are 3x more likely to contain critical bugs
- **Never run gas reporting and coverage together** -- coverage instrumentation distorts gas measurements

---

## 12. Deployment Scripts & Verification

### Hardhat Ignition (Recommended)

Hardhat Ignition is the declarative deployment system. It handles deployment ordering, retries, and state management.

```typescript
// ignition/modules/DeployAll.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployAllModule = buildModule("DeployAll", (m) => {
  // 1. Deploy Groth16 Verifier (auto-generated by snarkjs)
  const groth16Verifier = m.contract("Groth16Verifier");

  // 2. Deploy ZKP Identity Verifier
  const zkpVerifier = m.contract("ZKPIdentityVerifier", [groth16Verifier]);

  // 3. Deploy Mock Oracle (testnet) or configure Chainlink address (mainnet)
  const mockOracle = m.contract("MockOracle");

  // 4. Deploy DigitalLegacyVaultV2 (via UUPS proxy)
  // Note: For proxy deployments, use scripts with @openzeppelin/hardhat-upgrades
  // Ignition does not natively support proxy patterns yet

  return { groth16Verifier, zkpVerifier, mockOracle };
});

export default DeployAllModule;
```

### Deploy Script (For UUPS Proxy)

Since Hardhat Ignition does not natively handle UUPS proxy deployment, use a traditional deploy script for the main vault:

```typescript
// scripts/deploy.ts
import { ethers, upgrades, run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  // 1. Deploy Groth16Verifier
  const Groth16Verifier = await ethers.getContractFactory("Groth16Verifier");
  const groth16Verifier = await Groth16Verifier.deploy();
  await groth16Verifier.waitForDeployment();
  const groth16Addr = await groth16Verifier.getAddress();
  console.log("Groth16Verifier deployed to:", groth16Addr);

  // 2. Deploy ZKPIdentityVerifier
  const ZKPVerifier = await ethers.getContractFactory("ZKPIdentityVerifier");
  const zkpVerifier = await ZKPVerifier.deploy(groth16Addr);
  await zkpVerifier.waitForDeployment();
  const zkpAddr = await zkpVerifier.getAddress();
  console.log("ZKPIdentityVerifier deployed to:", zkpAddr);

  // 3. Deploy MockOracle (testnet only)
  const MockOracle = await ethers.getContractFactory("MockOracle");
  const mockOracle = await MockOracle.deploy();
  await mockOracle.waitForDeployment();
  const oracleAddr = await mockOracle.getAddress();
  console.log("MockOracle deployed to:", oracleAddr);

  // 4. Deploy DigitalLegacyVaultV2 (UUPS Proxy)
  const Vault = await ethers.getContractFactory("DigitalLegacyVaultV2");
  const vault = await upgrades.deployProxy(
    Vault,
    [zkpAddr, oracleAddr],
    { kind: "uups" }
  );
  await vault.waitForDeployment();
  const vaultAddr = await vault.getAddress();
  console.log("DigitalLegacyVaultV2 (proxy) deployed to:", vaultAddr);

  // 5. Wait for block confirmations before verifying
  console.log("Waiting for block confirmations...");
  await new Promise(r => setTimeout(r, 30000)); // 30s for Polygon

  // 6. Verify contracts on PolygonScan
  console.log("Verifying contracts...");

  await run("verify:verify", {
    address: groth16Addr,
    constructorArguments: [],
  });

  await run("verify:verify", {
    address: zkpAddr,
    constructorArguments: [groth16Addr],
  });

  await run("verify:verify", {
    address: oracleAddr,
    constructorArguments: [],
  });

  // Note: For UUPS proxy, verify the implementation contract
  const implAddr = await upgrades.erc1967.getImplementationAddress(vaultAddr);
  await run("verify:verify", {
    address: implAddr,
    constructorArguments: [],
  });

  // 7. Output deployment summary
  console.log("\n=== Deployment Summary ===");
  console.log("Groth16Verifier:", groth16Addr);
  console.log("ZKPIdentityVerifier:", zkpAddr);
  console.log("MockOracle:", oracleAddr);
  console.log("DigitalLegacyVaultV2 (proxy):", vaultAddr);
  console.log("DigitalLegacyVaultV2 (impl):", implAddr);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### Running Deployment

```bash
# Deploy to Amoy testnet
pnpm hardhat run scripts/deploy.ts --network amoy

# Deploy to Polygon mainnet
pnpm hardhat run scripts/deploy.ts --network polygon

# Verify a specific contract manually
pnpm hardhat verify --network amoy 0xCONTRACT_ADDRESS "constructor_arg_1" "constructor_arg_2"
```

### PolygonScan Verification Notes

- **Etherscan API v2 keys work across all chains** -- one key for both Etherscan and PolygonScan
- Wait at least 15-30 seconds after deployment before verifying (Polygon block propagation)
- For UUPS proxies, verify the **implementation contract**, not the proxy
- If automatic verification fails, try `hardhat verify` manually with constructor args

---

## 13. Frontend Integration

### Generating ABI + TypeScript Types

#### Option A: TypeChain (Current Standard)

TypeChain is bundled with `@nomicfoundation/hardhat-toolbox`. After `pnpm hardhat compile`, types are auto-generated in `typechain-types/`.

```typescript
// scripts/export-abi.ts
import * as fs from "fs";
import * as path from "path";

const CONTRACTS = [
  "DigitalLegacyVaultV2",
  "ZKPIdentityVerifier",
  "Groth16Verifier",
];

const OUTPUT_DIR = path.resolve(__dirname, "../../shared/contracts");

async function main() {
  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const name of CONTRACTS) {
    const artifactPath = path.resolve(
      __dirname,
      `../artifacts/contracts/${name}.sol/${name}.json`
    );
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    // Export just the ABI
    const outputPath = path.join(OUTPUT_DIR, `${name}.json`);
    fs.writeFileSync(outputPath, JSON.stringify({ abi: artifact.abi }, null, 2));
    console.log(`Exported ABI: ${outputPath}`);
  }

  // Export deployed addresses
  const addresses = {
    amoy: {
      DigitalLegacyVaultV2: "0x...",  // Update after deployment
      ZKPIdentityVerifier: "0x...",
      Groth16Verifier: "0x...",
    },
    polygon: {
      DigitalLegacyVaultV2: "0x...",
      ZKPIdentityVerifier: "0x...",
      Groth16Verifier: "0x...",
    },
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "addresses.json"),
    JSON.stringify(addresses, null, 2)
  );
  console.log("Exported contract addresses");
}

main();
```

#### Option B: Viem + ABIType (Modern Approach)

Since the Lega-C-Lok frontend already uses ethers.js (v6), sticking with TypeChain is fine. But for new projects in 2026, Viem + ABIType is the recommended direction -- it provides type-safe contract interactions without any code generation step, inferring types directly from ABI JSON at the TypeScript compiler level.

### Frontend Contract Integration

```typescript
// client/src/lib/contracts.ts
import { ethers } from "ethers";
import VaultABI from "@shared/contracts/DigitalLegacyVaultV2.json";
import addresses from "@shared/contracts/addresses.json";

const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || "80002";

export function getVaultContract(signer: ethers.Signer) {
  const network = CHAIN_ID === "137" ? "polygon" : "amoy";
  return new ethers.Contract(
    addresses[network].DigitalLegacyVaultV2,
    VaultABI.abi,
    signer
  );
}
```

---

## 14. Gas Optimization

Polygon gas is already cheap (~$0.001 per simple tx), but optimization still matters for complex operations like ZKP verification.

### Top Techniques for Lega-C-Lok

| Technique | Savings | Where to Apply |
|-----------|---------|----------------|
| **Use `bytes32` over `string`** | ~50% per storage slot | DID storage, share hashes |
| **Pack struct variables** | ~15% storage cost | Vault struct (pack bools together) |
| **Use `constant`/`immutable`** | 100% storage read savings | Verifier addresses if not upgradeable |
| **Use events for off-chain data** | Major savings | Vault creation metadata, guardian details |
| **Use mappings over arrays** | Variable | Guardian/beneficiary lookups |
| **Enable optimizer (runs: 200)** | 10-30% runtime | Already in config above |
| **Free storage slots (delete)** | 15,000 gas refund | When revoking vaults |
| **Cache storage reads in memory** | 2,100 gas per read | Any function reading same slot multiple times |
| **Use `calldata` over `memory`** | ~60 gas per param | All external function parameters |
| **Short-circuit require checks** | Variable | Put cheapest checks first |

### Struct Packing Example

```solidity
// BAD: wastes storage slots
struct VaultBad {
    bytes32 did;           // slot 0
    bool isActive;         // slot 1 (wastes 31 bytes)
    uint256 lastCheckIn;   // slot 2
    bool isRevoked;        // slot 3 (wastes 31 bytes)
    uint256 checkInInterval; // slot 4
}

// GOOD: packed into fewer slots
struct VaultGood {
    bytes32 did;                // slot 0 (32 bytes)
    uint256 lastCheckIn;        // slot 1 (32 bytes)
    uint256 checkInInterval;    // slot 2 (32 bytes)
    uint256 gracePeriod;        // slot 3 (32 bytes)
    address owner;              // slot 4 (20 bytes)
    bool isActive;              // slot 4 (1 byte, packed with address)
    bool isRevoked;             // slot 4 (1 byte, packed with address)
}
```

---

## 15. Environment Variables & Secrets

### contracts/.env.example

```bash
# -------------------------------------------------------
# Deployment Keys (NEVER commit the real .env file)
# -------------------------------------------------------
DEPLOYER_PRIVATE_KEY=0x...your_private_key_here...

# -------------------------------------------------------
# RPC Provider (Alchemy)
# -------------------------------------------------------
ALCHEMY_API_KEY=your_alchemy_api_key

# -------------------------------------------------------
# Contract Verification
# -------------------------------------------------------
ETHERSCAN_API_KEY=your_etherscan_api_key

# -------------------------------------------------------
# Gas Reporting (optional)
# -------------------------------------------------------
REPORT_GAS=false
COINMARKETCAP_API_KEY=your_cmc_api_key

# -------------------------------------------------------
# Chainlink Functions (Polygon Amoy)
# -------------------------------------------------------
CHAINLINK_FUNCTIONS_ROUTER=0x...
CHAINLINK_DON_ID=0x...
CHAINLINK_SUBSCRIPTION_ID=123
```

### contracts/.gitignore additions

```
# Hardhat
cache/
artifacts/
typechain-types/
coverage/
coverage.json
gas-report.txt

# Environment
.env

# Circuit build artifacts (large files)
circuits/build/
circuits/keys/*.zkey
circuits/keys/*.ptau

# Ignition deployment state
ignition/deployments/
```

---

## 16. Contract Architecture Summary

```
+----------------------------+
|   DigitalLegacyVaultV2     |  <-- UUPS Proxy (upgradeable)
|   (Main Vault Contract)    |
+----------------------------+
    |           |           |
    v           v           v
+--------+  +--------+  +------------------+
| ZKP    |  | Death  |  | Chainlink        |
| Identity|  | Cert   |  | Automation       |
| Verifier|  | Oracle |  | (Dead Man Switch)|
+--------+  +--------+  +------------------+
    |
    v
+-------------------+
| Groth16Verifier   |  <-- Auto-generated by snarkjs
| (On-chain ZKP)    |
+-------------------+
```

### Contract Responsibilities

| Contract | Responsibility |
|----------|---------------|
| **DigitalLegacyVaultV2** | Core logic: vault CRUD, check-ins, guardian/beneficiary mgmt, claim orchestration |
| **ZKPIdentityVerifier** | Manages identity commitments, nullifier tracking, delegates proof verification |
| **Groth16Verifier** | Pure math: verifies Groth16 proofs on BN128 curve (auto-generated, do not edit) |
| **MockOracle** | Testing stand-in for Chainlink Functions death certificate verification |
| **DeathCertificateOracle** | Production: Chainlink Functions consumer for off-chain death cert API |

---

## 17. Recommended Development Workflow

### Phase 1: Foundation (Week 1)
1. Set up `contracts/` package in monorepo
2. Install Hardhat + dependencies
3. Configure `hardhat.config.ts` with Polygon networks
4. Write contract interfaces (`IDigitalLegacyVault.sol`, `IZKPVerifier.sol`)
5. Deploy hello-world to Amoy to validate pipeline

### Phase 2: Core Contracts (Weeks 2-3)
1. Implement `DigitalLegacyVaultV2` (vault creation, check-in, guardian management)
2. Write comprehensive tests for each function
3. Implement `MockOracle` for testing
4. Achieve 90%+ test coverage on core contract

### Phase 3: ZKP Integration (Weeks 3-4)
1. Write circom circuit for identity verification
2. Run trusted setup ceremony
3. Generate `Groth16Verifier.sol`
4. Implement `ZKPIdentityVerifier.sol`
5. Write ZKP tests with real proof generation
6. Integrate ZKP verification into claim flow

### Phase 4: Oracle & Automation (Week 5)
1. Implement `DeathCertificateOracle` with Chainlink Functions
2. Set up Chainlink Automation for dead man's switch monitoring
3. Test on Amoy with live Chainlink services

### Phase 5: Integration & Deployment (Week 6)
1. Export ABIs + addresses to shared/
2. Build frontend contract integration layer
3. End-to-end testing on Amoy testnet
4. Security review / audit prep
5. Deploy to Polygon Mainnet
6. Verify all contracts on PolygonScan

---

## 18. Sources

### Hardhat
- [Hardhat 3 Official Docs](https://hardhat.org/docs/getting-started)
- [Hardhat 3 Configuration Reference](https://hardhat.org/docs/reference/configuration)
- [What's New in Hardhat 3](https://hardhat.org/docs/learn-more/whats-new)
- [Hardhat Releases (GitHub)](https://github.com/NomicFoundation/hardhat/releases)
- [Hardhat Network Management](https://hardhat.org/docs/explanations/network-management)
- [Hardhat Managing Dependencies](https://hardhat.org/docs/guides/writing-contracts/dependencies)

### Polygon
- [Polygon Hardhat Docs](https://docs.polygon.technology/tools/dApp-development/common-tools/hardhat/)
- [Polygon RPC Endpoints](https://docs.polygon.technology/pos/reference/rpc-endpoints/)
- [Polygon Amoy Testnet on ChainList](https://chainlist.org/chain/80002)
- [Polygon Amoy Faucet](https://faucet.polygon.technology/)
- [Alchemy Polygon Amoy RPC](https://www.alchemy.com/rpc/matic-amoy)
- [PolygonScan Amoy Explorer](https://amoy.polygonscan.com/)
- [Deploy on Polygon with Hardhat Ignition (AWS)](https://repost.aws/articles/ARMiTkQJ-GRaqeDCxHVIoPhA/deploy-a-smart-contract-on-polygon-mainnet-with-amb-access-and-hardhat-ignition)

### Solidity
- [Solidity Releases Blog](https://www.soliditylang.org/blog/category/releases/)
- [Solidity 0.8.34 (Latest Stable)](https://github.com/ethereum/solidity/releases)
- [Solidity 0.8.28 Release](https://www.soliditylang.org/blog/2024/10/09/solidity-0.8.28-release-announcement/)

### OpenZeppelin & Proxy
- [OpenZeppelin Upgrades Plugins](https://docs.openzeppelin.com/upgrades-plugins)
- [OpenZeppelin UUPS Proxy](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/utils/UUPSUpgradeable.sol)
- [QuickNode: Upgradeable Contracts with OpenZeppelin + Hardhat](https://www.quicknode.com/guides/ethereum-development/smart-contracts/how-to-create-and-deploy-an-upgradeable-smart-contract-using-openzeppelin-and-hardhat)
- [LogRocket: UUPS Proxy Pattern](https://blog.logrocket.com/using-uups-proxy-pattern-upgrade-smart-contracts/)

### ZKP (Circom + snarkjs)
- [snarkjs GitHub (iden3)](https://github.com/iden3/snarkjs)
- [Circom Documentation: Proving Circuits](https://docs.circom.io/getting-started/proving-circuits/)
- [snarkjs Solidity Verifier Generator](https://github.com/iden3/snarkjs-generate-solidity)
- [ZK-SNARKs Tutorial with Circom](https://markaicode.com/zero-knowledge-proofs-zk-snarks-circom-tutorial/)

### Chainlink
- [Chainlink on Polygon Docs](https://docs.polygon.technology/tools/oracles/chainlink/)
- [Chainlink Functions](https://chain.link/functions)
- [Chainlink Any API Documentation](https://docs.chain.link/any-api/introduction)
- [LYS Labs x Chainlink Functions Guide (2026)](https://lyslabs.substack.com/p/lys-labs-x-chainlink-functions-guide)
- [Chainlink Automation on Polygon Amoy](https://automation.chain.link/polygon-amoy/)

### Testing & Gas
- [hardhat-gas-reporter (GitHub)](https://github.com/cgewecke/hardhat-gas-reporter)
- [solidity-coverage (GitHub)](https://github.com/sc-forks/solidity-coverage)
- [Base Docs: Hardhat Coverage](https://docs.base.org/learn/hardhat/hardhat-tools-and-testing/analyzing-test-coverage)
- [MoldStud: Solidity Test Best Practices](https://moldstud.com/articles/p-top-best-practices-for-writing-solidity-tests-with-hardhat)

### Gas Optimization
- [RareSkills: 80+ Gas Tips](https://rareskills.io/post/gas-optimization)
- [Alchemy: 12 Gas Optimization Techniques](https://www.alchemy.com/overviews/solidity-gas-optimization)
- [Cyfrin: Top 11 Advanced Gas Tips](https://www.cyfrin.io/blog/solidity-gas-optimization-tips)
- [Hacken: Gas Optimization in Solidity](https://hacken.io/discover/solidity-gas-optimization/)
- [RapidInnovation: Polygon Gas Optimization](https://www.rapidinnovation.io/post/mastering-gas-efficiency-tips-and-tricks-for-polygon-smart-contracts)

### Frontend Integration
- [TypeChain GitHub](https://github.com/dethcrypto/TypeChain)
- [@typechain/hardhat npm](https://www.npmjs.com/package/@typechain/hardhat)

### Shamir's Secret Sharing
- [Shamir's Secret Sharing (Wikipedia)](https://en.wikipedia.org/wiki/Shamir's_secret_sharing)
- [Vault12: SSS for Crypto Security](https://vault12.com/blog/shamir-secret-sharing-sss/)
- [Ledger Academy: What is SSS?](https://www.ledger.com/academy/topics/security/shamirs-secret-sharing)
- [QuillAudits: SSS Visual Guide](https://www.quillaudits.com/blog/web3-security/shamir-secret-sharing)

### Monorepo
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [SummitShare DApp Template (Hardhat + pnpm monorepo)](https://github.com/SummitShare/Dapp-Template)

---

## 19. Gaps & Open Questions

1. **Death Certificate API**: No established API standard exists for on-chain death certificate verification. This will likely require a custom trusted data provider or partnership with a vital records service. Chainlink Functions provides the technical bridge, but the data source itself is the gap.

2. **Chainlink Functions Router Address for Polygon Amoy**: The exact router address and DON ID need to be looked up from the Chainlink supported networks page at deployment time, as these can change.

3. **Trusted Setup Ceremony**: For production ZKP deployment, a multi-party trusted setup ceremony is recommended for security. A single-party setup works for testnet but is not sufficient for mainnet.

4. **Hardhat 3 Polygon Support**: Hardhat 3 does not yet have first-class Polygon chain type support. The generic chain type works, but you miss Polygon-specific features. Monitor Hardhat releases for when Polygon is officially supported.

5. **Shamir's Secret Sharing Library**: No standard, audited Solidity library exists for SSS. The recommendation is to handle it off-chain, but the specific JavaScript library to use should be evaluated for security audits and maintenance status.

6. **Audit Requirements**: Before mainnet deployment, a professional security audit is strongly recommended given the financial nature of the vault contracts. Budget and timeline for this should be planned.

7. **LINK Token Funding**: Chainlink Functions and Automation require LINK tokens for operation. The ongoing operational cost for oracle services on mainnet should be estimated.

---

## Recommendation

Brad, this is a solid technical foundation for the Lega-C-Lok blockchain layer. The key decisions:

- **Use Hardhat 2** (not 3) until Polygon gets first-class support
- **Use Solidity 0.8.28** for maximum compatibility and stability
- **Use UUPS proxy pattern** for upgradeability (cheaper than transparent proxy)
- **Keep Shamir's Secret Sharing off-chain** -- only store share hashes on-chain
- **Use Chainlink Functions** (not the older Request/Receive pattern) for death certificate verification
- **Add the contracts as a separate package** in your existing pnpm monorepo
- **Start with Amoy testnet**, validate the full flow, then deploy to mainnet

The biggest open risk is the death certificate data source -- the blockchain infrastructure (Chainlink Functions) is ready, but partnering with a reliable vital records data provider will require business development work.
