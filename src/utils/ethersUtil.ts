declare global {
  interface Window {
    ethereum: any;
  }
}
const ethers = require("ethers");
// const hstABI = require("human-standard-token-abi");

export async function initEthers() {
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const network = Number(
    window.ethereum.send({ method: "net_version" }).result
  );
  return signer;
}
