const ethers = require("ethers");

declare global {
  interface Window {
    ethereum: any;
  }
}
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

export const getAccount = async () => {
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    // console.log('accounts', accounts);
    if (Array.isArray(accounts) && accounts.length > 0) {
      return accounts[0];
    }
  } catch (err) {
    console.error("ERROR:", err);
  }
  return null;
};
