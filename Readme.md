# 🔐 CipherVault — On-Chain Multisig Governance Vault

CipherVault is a **full-stack Solana dApp** that enables secure **on-chain governance** and **treasury management** with multi-signature approvals, mint creation, and token supply governance.  

🌐 **Live Demo:** [https://ciphervault-frontend.vercel.app/](https://ciphervault-frontend.vercel.app/)

---

## 🧩 Project Overview

CipherVault brings **DAO-style governance** and **secure fund management** together.  
It allows users to create and manage a **Vault** governed by multiple signers, where all treasury actions are executed only upon required approvals.

### ✨ Features
- 🏦 **Multisig Vault:** secure on-chain fund storage  
- ⚙️ **Governance Logic:** proposal and approval mechanisms  
- 💰 **Mint Creation & Token Supply Governance**  
- 📊 **Token Governance:** control minting and supply decisions  
- 🧠 **Full-Stack Architecture:** Anchor + React + Solana Web3  
- 🔗 **Solana Devnet Ready**  

---

## 🧱 Project Structure


    .
    ├── app/ # React frontend (Vite + Tailwind)

    ├── migrations/ # Anchor migrations
    ├── programs/
    │ └── cipher-vault/ # On-chain program (Anchor, Rust)
    ├── tests/ # Anchor test scripts
    └── Anchor.toml # Anchor config file



---

## ⚙️ Prerequisites

Before running the project, make sure you have these installed:

- [Anchor](https://book.anchor-lang.com/)
- [Yarn](https://classic.yarnpkg.com/)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Rust + Cargo](https://www.rust-lang.org/tools/install)

---

## 🚀 Running Locally (Local Validator)

1. **Start Solana Local Validator**
   ```bash
   solana-test-validator


2. **Install dependencies (backend + tests)**

    ```bash
    yarn install
    ```  

3. **Generate program keypair**
    ```bash
    solana-keygen new -o target/deploy/cipher_vault-keypair.json
    ```

4. **Get and set Program ID**

    ```bash
    solana address -k target/deploy/cipher_vault-keypair.json
    ````

    Copy the generated public key and update it in your Anchor.toml file under [programs.localnet] and in lib.rs update declare_id("publickey").
    
5. **In your Anchor.toml, update the cluster under [provider]:**
    ```bash
    cluster = "http://127.0.0.1:8899"
    ```

6. **Run Anchor tests (build + deploy + test)**
    ```bash
    anchor test
    ```

7. **Run Frontend**
    ```bash
    cd app
    yarn install
    yarn dev
    ```

8. **Update RPC endpoint for local environment**
  
    In app/src/main.tsx, update the ConnectionProvider endpoint to your local validator:
    ```bash
    <ConnectionProvider endpoint="http://127.0.0.1:8899">
    ```

9. **Also set your Solana CLI config to local:**
    ```bash
    solana config set --url http://127.0.0.1:8899
    ```

9. **Visit the frontend**

    Open the Vite dev server URL (usually http://localhost:5173).


## 🌐 Running on Devnet

1. **No need to run the validator.**

2. **In your Anchor.toml, update the cluster under [provider]:**
    ```bash
    cluster = "devnet"
    ```
3. **Generate program keypair**
    ```bash
    solana-keygen new -o target/deploy/cipher_vault-keypair.json
    ```

4. **Get and set Program ID**

    ```bash
    solana address -k target/deploy/cipher_vault-keypair.json
    ````

    Copy the generated public key and update it in your Anchor.toml file under [programs.localnet] and in lib.rs update declare_id("publickey").

3. **No need to edit the ConnectionProvider — it’s already set to Devnet in the repo.**

4. **Install dependencies (if not done):**
    ```bash
    yarn install
    cd app
    yarn install
    ```

7. **Run frontend:**
    ```bash
    yarn dev
    ```

## 🧠 Notes

Make sure your wallet is funded on the chosen network (localnet or devnet).

For Devnet, request SOL using:

    
    solana airdrop 2



All tests and deployments use the keypair at
target/deploy/cipher_vault-keypair.json

## 🧾 License

This project is open-source under the MIT License
.

**💡 CipherVault — Secure, governed, and on-chain.**