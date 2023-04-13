import * as anchor from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { Keypair, PublicKey } from '@solana/web3.js'
import { Workflow } from '../target/types/workflow';
import * as buffer from "buffer";

describe('workflow', async () => {
  const provider = anchor.AnchorProvider.local("https://api.devnet.solana.com");
  anchor.setProvider(provider);
  const keypair =  web3.Keypair.fromSecretKey(
    Uint8Array.from([226,37,2,35,123,147,47,122,244,62,213,197,123,40,160,147,126,68,13,60,104,70,58,233,126,239,228,59,254,191,142,46,168,9,104,9,158,127,18,6,104,44,201,175,111,13,100,80,208,156,243,41,166,103,23,23,224,12,223,70,144,2,218,191])
  )
  const workflowProgram = anchor.workspace.Workflow as Program<Workflow>

  // const keypairTest = Keypair.generate()
  // console.log(keypairTest)

  const programId = new web3.PublicKey('ENHr4cF54EwYtc1NtfWAfmqexcDXZTxjizuXg6UPpUXv');
  let [pda, bump] = await web3.PublicKey.findProgramAddress(
    [keypair.publicKey.toBuffer()],
    programId,
  )

  let max = new Uint8Array([1])

  let [pda2, bump2] = await web3.PublicKey.findProgramAddress(
    [keypair.publicKey.toBuffer(), max],
    programId
  )
    
  console.log(provider.wallet.publicKey)
  console.log(anchor.web3.SystemProgram.programId)

  //test create init user
  // it("init user", async () => {
  //   await workflowProgram.methods.initUser().accounts({
  //     owner: keypair.publicKey,
  //     userInfo: pda,
  //     systemProgram: anchor.web3.SystemProgram.programId,
  //   }).signers([keypair]).rpc()
  // })

  //test create workflow
  // it("create workflow", async () => {
  //   await workflowProgram.methods.createWorkflow().accounts({
  //     owner: keypair.publicKey,
  //     userInfo: pda,
  //     aworkflow: pda2,
  //     systemProgram: anchor.web3.SystemProgram.programId,
  //   }).signers([keypair]).rpc()
  // })



})
