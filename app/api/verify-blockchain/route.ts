import { NextResponse } from "next/server";
import { ethers } from "ethers";

// 1. Apne deployed contract ka address aur ABI yahan fix karein
const CONTRACT_ADDRESS = "YOUR_AMOY_DEPLOYED_CONTRACT_ADDRESS";
const CONTRACT_ABI = [
  "function registerCertificate(bytes32 _certHash, string memory _name, string memory _course) public",
  "function registry(bytes32) public view returns (string studentName, string courseName, uint256 timestamp, bool isReal)"
];

// 🔥 A. API End-point 1: Automatic Blockchain Minting & Registration
export async function POST(request: Request) {
  try {
    const { action, certHash, name, course } = await request.json();

    // Provider & Signer details loaded dynamically from environment
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    
    // Admin key se write credentials create kiye
    const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY || "", provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    // ACTION: 1 - Register Certificate on Blockchain (Auto-Mint)
    if (action === "register") {
      if (!certHash || !name || !course) {
        return NextResponse.json({ error: "Missing required fields for registration" }, { status: 400 });
      }

      console.log(`[Blockchain] Registering certificate for ${name}...`);
      
      // Smart contract function trigger kiya straight from server backend
      const tx = await contract.registerCertificate(certHash, name, course);
      await tx.wait(); // Waiting for block validation confirmation
      
      return NextResponse.json({ success: true, txHash: tx.hash });
    }

    // ACTION: 2 - Verify Certificate Data (Read Query)
    if (action === "verify") {
      if (!certHash) return NextResponse.json({ error: "Hash missing" }, { status: 400 });

      const certData = await contract.registry(certHash);

      if (certData.isReal) {
        return NextResponse.json({
          verified: true,
          name: certData.studentName,
          course: certData.courseName,
          date: new Date(Number(certData.timestamp) * 1000).toLocaleDateString()
        });
      } else {
        return NextResponse.json({ verified: false, message: "Certificate data not found in ledger" });
      }
    }

    return NextResponse.json({ error: "Invalid Action Specified" }, { status: 400 });

  } catch (error: any) {
    console.error("Blockchain Operation Failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}