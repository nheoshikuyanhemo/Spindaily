import 'dotenv/config';
import { ethers } from 'ethers';

const DELAY_MS = 24 * 60 * 60 * 1000;

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.PLUME_RPC;
const SPIN_CONTRACT = process.env.SPIN_CONTRACT;

if (!PRIVATE_KEY || !RPC_URL || !SPIN_CONTRACT) {
  console.error("❌ .env belum lengkap. Pastikan isi PRIVATE_KEY, PLUME_RPC, dan SPIN_CONTRACT sudah benar.");
  process.exit(1);
}

const ABI = [
  "function getSpinPrice() view returns (uint256)",
  "function startSpin() payable",
  "event SpinCompleted(address indexed walletAddress, string rewardCategory, uint256 rewardAmount)"
];

async function main() {
  console.log("🔄 Mulai spin harian...");

  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(SPIN_CONTRACT, ABI, wallet);

    const spinPrice = await contract.getSpinPrice();
    const balance = await provider.getBalance(wallet.address);

    if (balance < spinPrice) {
      console.error(`❌ Gagal spin: Saldo terlalu rendah. Dibutuhkan ${ethers.formatUnits(spinPrice)} PLUME, tetapi hanya ${ethers.formatUnits(balance)} tersedia.`);
    } else {
      const tx = await contract.startSpin({ value: spinPrice });
      console.log(`🎰 Transaksi spin dikirim: ${tx.hash}`);
      const receipt = await tx.wait();

      const iface = new ethers.Interface(ABI);
      const logs = receipt.logs
        .map(log => {
          try {
            return iface.parseLog(log);
          } catch {
            return null;
          }
        })
        .filter(log => log && log.name === "SpinCompleted");

      if (logs.length > 0) {
        const reward = logs[0].args;
        console.log(`🎁 Hadiah: ${reward.rewardCategory} - ${ethers.formatUnits(reward.rewardAmount)} PLUME`);
      } else {
        console.log("🎁 Spin selesai, tapi hadiah tidak terdeteksi dari log.");
      }
    }

  } catch (err) {
    console.error("❌ Gagal spin:", err.reason || err.message || err);
  }

  console.log(`⏱ Menunggu ${DELAY_MS / 1000 / 60 / 60} jam sebelum spin berikutnya...\n`);
  setTimeout(() => main(), DELAY_MS);
}

main();
