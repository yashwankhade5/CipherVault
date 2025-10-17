import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CipherValut } from "../target/types/cipher_valut";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";
import { it } from "mocha";

describe("cipher-valut", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.cipherValut as Program<CipherValut>;
  const owner1 = anchor.web3.Keypair.generate();
  const owner2 = anchor.web3.Keypair.generate();
  const connection = program.provider.connection;

 
  before(async () => {
  await connection.confirmTransaction(
    await connection.requestAirdrop(owner1.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
  );
});



  
      const [multiSigPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("multisig"), owner1.publicKey.toBuffer()],
      program.programId
    );
    const [vaultpda, bum1p] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("multisig"), multiSigPda.toBuffer()],
      program.programId
    );

  it("Is initialized!", async () => {
    // Add your test here.

    const connection = program.provider.connection;

    const tx = await program.methods.createMultisig(1, [owner1.publicKey, owner2.publicKey], "org").accounts({
      creator: owner1.publicKey,
    
    }).signers([owner1]).rpc();
    console.log("Your transaction signature", tx);
    await program.provider.connection.confirmTransaction(tx, "confirmed")
    const multisig_acc = await program.account.multisig.fetch(multiSigPda)
    expect(multisig_acc.creator).to.deep.equal(owner1.publicKey)
    expect(multisig_acc.owners).to.deep.equal([owner1.publicKey, owner2.publicKey])
    expect(multisig_acc.name).to.deep.equal("org")
    expect(multisig_acc.transactionCount).to.equal(0)
  });

  it("create transaction account sol ", async () => {
       const [transactionPda, bumptran] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("transaction"),owner1.publicKey.toBuffer(),Buffer.from([0])],
      program.programId
    );
    const tx = await program.methods.createTransaction(new anchor.BN(1),null)
    .accountsStrict({
      multisig:multiSigPda,
      proposer:owner1.publicKey,
      reciepient:owner2.publicKey,
      vault:vaultpda,
      transactionAccount:transactionPda,
      systemProgram:anchor.web3.SystemProgram.programId,
      tokenProgram:anchor
    }).signers([owner1])
    .rpc()
    
    console.log("transaction sign",tx)

  })
});
