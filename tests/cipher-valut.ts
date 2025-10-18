import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CipherValut } from "../target/types/cipher_valut";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { assert, expect } from "chai";
import { it } from "mocha";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

describe("cipher-valut", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.cipherValut as Program<CipherValut>;
  const owner1: Keypair = anchor.web3.Keypair.generate();
  const owner2: Keypair = anchor.web3.Keypair.generate();
  console.log("owner1",owner1.publicKey.toBase58());
  console.log("owner1",owner2.publicKey.toBase58());
  const connection: Connection = program.provider.connection;
  let transactionPda: PublicKey;
  let bumptran: number;
  let multisig_account_data;

  let transaction_account_data;


  before(async () => {
    await connection.confirmTransaction(
      await connection.requestAirdrop(owner1.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL),

    );
  });

  before(async () => {
    await connection.confirmTransaction(
      await connection.requestAirdrop(owner2.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL),

    );
  });



  const [multiSigPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("multisig"), owner1.publicKey.toBuffer(), Buffer.from("org")],
    program.programId
  );

  console.log(multiSigPda.toBase58())
  const [vaultpda, bum1p] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("multisig"), multiSigPda.toBuffer()],
    program.programId
  );

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.createMultisig(2, [owner1.publicKey, owner2.publicKey], "org").accounts({
      creator: owner1.publicKey,
    }).signers([owner1]).rpc();

    console.log("Your transaction signature", tx);

    await program.provider.connection.confirmTransaction(tx, "confirmed")
    multisig_account_data = await program.account.multisig.fetch(multiSigPda)
    expect(multisig_account_data.creator).to.deep.equal(owner1.publicKey)
    expect(multisig_account_data.owners).to.deep.equal([owner1.publicKey, owner2.publicKey])
    expect(multisig_account_data.name).to.deep.equal("org")
    expect(multisig_account_data.transactionCount).to.equal(0)

    await connection.confirmTransaction(
      await connection.requestAirdrop(owner1.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
    )

    const vault_account_data = await program.provider.connection.getAccountInfo(vaultpda, "confirmed")

    expect(vault_account_data.lamports).to.deep.equal(946560)
    expect(vault_account_data.owner).to.deep.equal(program.programId)
  });

  it("create transaction account sol ", async () => {
    await connection.confirmTransaction(
      await connection.requestAirdrop(vaultpda, 2 * anchor.web3.LAMPORTS_PER_SOL)
    );
    const multisig = await program.account.multisig.fetch(multiSigPda)
    const transBuffer = Buffer.alloc(8)
    transBuffer.writeBigUInt64LE(BigInt(multisig.transactionCount));
    [transactionPda, bumptran] = PublicKey.findProgramAddressSync(
      [Buffer.from("transaction"), owner1.publicKey.toBuffer()],
      program.programId
    )
    const tx = await program.methods.createTransaction(new anchor.BN(1*anchor.web3.LAMPORTS_PER_SOL), null)
      .accounts({
        multisig: multiSigPda,
        proposer: owner1.publicKey,
        reciepient: owner2.publicKey,
        vault: vaultpda,
      })
      .signers([owner1])
      .rpc()

    console.log("transaction sign from transaction account craetion", tx)
    transaction_account_data = await program.account.transactionAccount.fetch(transactionPda)
    expect(transaction_account_data.proposer).to.deep.equal(owner1.publicKey)
    expect(transaction_account_data.approval).to.deep.equal([true, false])
    expect(transaction_account_data.multisig).to.deep.equal(multiSigPda)
    expect(transaction_account_data.executed).to.deep.equal(false)
    expect(transaction_account_data.valut).to.deep.equal(vaultpda)

  })

  it("it approves transaction", async () => {
const approval_data1 = await program.account.transactionAccount.fetch(transactionPda)
    console.log(approval_data1)

    const tx = await program.methods.approval()
    .accounts({
      approver:owner2.publicKey,
      multisig:multiSigPda,
      transaction:transactionPda
    }
    ).signers([owner2])
    .rpc({skipPreflight:true,commitment:"finalized"})

    console.log("approval",tx)
    console.log(vaultpda)
    console.log(transactionPda)
    console.log(multiSigPda)

const approval_data = await program.account.transactionAccount.fetch(transactionPda)
    expect(approval_data.approval).to.deep.equal([true, true])
    expect(approval_data.reciepient).to.deep.equal(transaction_account_data.reciepient)

  })

  it("Transaction execution",async ()=>{
    
    const latestBlockhash = await connection.getLatestBlockhash("confirmed");
const valut_account_data =  await connection.getAccountInfo(vaultpda)
const owner2AccountBefore =  await connection.getAccountInfo(owner2.publicKey)

    const tx = await program.methods.fnExecute()
    .accounts({
      multisig:multiSigPda,
      transactionAccount:transactionPda,
      vault:vaultpda,
      reciepientAccount:owner2.publicKey,
      signer:owner2.publicKey
      
    }).signers([owner2]).rpc()
//      .transaction();
//      tx.recentBlockhash= latestBlockhash.blockhash;
     

// await connection.sendTransaction(tx, [owner2,]);

    console.log("execution transaction sign", tx)

const valutAccountAfter =  await connection.getAccountInfo(vaultpda)
const owner2AccountAfter =  await connection.getAccountInfo(owner2.publicKey)




  })

});
