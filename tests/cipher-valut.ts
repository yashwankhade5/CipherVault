import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CipherValut } from "../target/types/cipher_valut";

describe("cipher-valut", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.cipherValut as Program<CipherValut>;
  const owner1 = anchor.web3.Keypair.generate();
  const owner2 = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.createMultisig(1,[owner1.publicKey,owner2.publicKey],"org")
    .accounts({
      creator:owner1.publicKey,  
    }).rpc();
    console.log("Your transaction signature", tx);
  });
});
