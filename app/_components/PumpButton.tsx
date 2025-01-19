// "use client";

// import { useState, useEffect, Suspense } from "react";
// import {
//   Connection,
//   PublicKey,
//   LAMPORTS_PER_SOL,
//   Transaction,
//   SystemProgram,
// } from "@solana/web3.js";
// import { Loader2 } from "lucide-react";
// import { Toast } from "./ui/Toast";
// import { useWalletStore } from "@/lib/store";
// import { useSearchParams } from "next/navigation";
// import {
//   createOrUpdateUser,
//   getReferrerAddress,
//   recordPumpTransaction,
// } from "@/lib/database/index";
// import {
//   PUMP_AMOUNT_USD,
//   RECIPIENT_WALLET,
//   REFERRAL_PERCENTAGE,
// } from "@/lib/constants";
// import { PhantomGuide } from "./PhantomGuide";

// const QUICKNODE_RPC_URL = `https://autumn-tame-sponge.solana-mainnet.quiknode.pro/${
//   process.env.NEXT_PUBLIC_QUICK_NODE_API_KEY as string
// }`;

// interface PhantomProvider {
//   connect: (params?: {
//     onlyIfTrusted?: boolean;
//   }) => Promise<{ publicKey: PublicKey }>;
//   signTransaction: (transaction: Transaction) => Promise<Transaction>;
//   solana?: {
//     connect: (params?: {
//       onlyIfTrusted?: boolean;
//     }) => Promise<{ publicKey: PublicKey }>;
//     signTransaction: (transaction: Transaction) => Promise<Transaction>;
//   };
// }

// interface PhantomWindow extends Window {
//   phantom?: {
//     solana?: PhantomProvider;
//   };
// }

// declare const window: PhantomWindow;

// interface ToastData {
//   type: "success" | "error" | "warning" | "loading";
//   message: string;
// }

// interface SolanaPrice {
//   solana: {
//     usd: number;
//   };
// }

// function PumpButtonInner() {
//   const [showPhantomGuide, setShowPhantomGuide] = useState<boolean>(false);
//   const searchParams = useSearchParams();
//   const [phantom, setPhantom] = useState<PhantomProvider | null>(null);
//   const [connected, setConnected] = useState<boolean>(false);
//   const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [toast, setToast] = useState<ToastData | null>(null);

//   const { setWalletAddress } = useWalletStore();

//   // useEffect(() => {
//   //   if (window?.phantom?.solana) {
//   //     const provider = window.phantom.solana;
//   //     setPhantom(provider);

//   //     provider
//   //       .connect({ onlyIfTrusted: true })
//   //       .then(async ({ publicKey }: { publicKey: PublicKey }) => {
//   //         setPublicKey(publicKey);
//   //         setWalletAddress(publicKey.toString());
//   //         setConnected(true);
//   //       })
//   //       .catch(() => {
//   //         return;
//   //       });
//   //   } else {
//   //     setShowPhantomGuide(true);
//   //   }
//   // }, [setWalletAddress]);

//   useEffect(() => {
//     let mounted = true;

//     const checkPhantomWallet = async () => {
//       // Only check for window.phantom when component is mounted
//       if (typeof window !== "undefined" && window?.phantom?.solana && mounted) {
//         const provider = window.phantom.solana;
//         setPhantom(provider);

//         try {
//           const { publicKey } = await provider.connect({ onlyIfTrusted: true });
//           if (mounted) {
//             setPublicKey(publicKey);
//             setWalletAddress(publicKey.toString());
//             setConnected(true);
//           }
//         } catch (error) {
//           // Handle silently as this is just an auto-connect attempt
//           console.error(error);
//         }
//       } else if (mounted) {
//         setShowPhantomGuide(true);
//       }
//     };

//     checkPhantomWallet();

//     // Cleanup function
//     return () => {
//       mounted = false;
//     };
//   }, [setWalletAddress]);

//   const getSolPrice = async (): Promise<number> => {
//     try {
//       const response = await fetch(
//         "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
//       );
//       const data: SolanaPrice = await response.json();
//       return data.solana.usd;
//     } catch (error) {
//       throw new Error("Failed to fetch SOL price");
//       console.error(error);
//     }
//   };

//   const connectWallet = async (): Promise<void> => {
//     try {
//       setLoading(true);
//       const { publicKey } = await phantom!.connect();
//       setWalletAddress(publicKey.toString());
//       const refAddress = searchParams.get("ref");
//       if (refAddress) {
//         await createOrUpdateUser(publicKey.toString(), refAddress);
//       } else {
//         await createOrUpdateUser(publicKey.toString());
//       }
//       setPublicKey(publicKey);
//       setConnected(true);
//       setToast({
//         type: "success",
//         message: "Wallet connected successfully!",
//       });
//     } catch (error) {
//       setToast({
//         type: "error",
//         message: "Failed to connect wallet. Please try again.",
//       });
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const pump = async (): Promise<void> => {
//     if (!connected || !phantom) {
//       await connectWallet();
//       return;
//     }

//     try {
//       setLoading(true);
//       setToast({
//         type: "loading",
//         message: "Processing your pump...",
//       });

//       // Initialize connection with maximum commitment
//       const connection = new Connection(QUICKNODE_RPC_URL, {
//         commitment: "processed",
//         confirmTransactionInitialTimeout: 60000,
//       });

//       // Get SOL price and calculate amount
//       const solPriceUSD = await getSolPrice();
//       console.log("Current SOL price:", solPriceUSD);

//       const solAmount = PUMP_AMOUNT_USD / solPriceUSD;
//       const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL);
//       console.log("Total lamports to send:", lamports);

//       if (!publicKey) throw new Error("Public key not found");

//       // Check balance
//       const balance = await connection.getBalance(publicKey);
//       console.log("Current balance:", balance / LAMPORTS_PER_SOL, "SOL");

//       // Ensure enough balance for transaction + fees (5000 lamports buffer for fees)
//       if (balance < lamports + 10000) {
//         throw new Error("Insufficient balance for transaction and fees");
//       }

//       // Get referrer address and log it
//       const referrerAddress = await getReferrerAddress(publicKey.toString());
//       console.log("Referrer address:", referrerAddress);

//       // Calculate split amounts
//       let recipientLamports = lamports;
//       let referrerLamports = 0;

//       if (referrerAddress) {
//         referrerLamports = Math.floor(lamports * (REFERRAL_PERCENTAGE / 100));
//         recipientLamports = lamports - referrerLamports;
//         console.log("Split calculation:");
//         console.log("- Total amount:", lamports / LAMPORTS_PER_SOL, "SOL");
//         console.log(
//           "- Referrer will receive:",
//           referrerLamports / LAMPORTS_PER_SOL,
//           "SOL"
//         );
//         console.log(
//           "- Recipient will receive:",
//           recipientLamports / LAMPORTS_PER_SOL,
//           "SOL"
//         );
//       }

//       // Get latest blockhash
//       const { blockhash, lastValidBlockHeight } =
//         await connection.getLatestBlockhash("processed");
//       console.log("Got blockhash:", blockhash);

//       // Create transaction
//       const transaction = new Transaction();

//       // Add transfer to main recipient
//       transaction.add(
//         SystemProgram.transfer({
//           fromPubkey: publicKey,
//           toPubkey: new PublicKey(RECIPIENT_WALLET),
//           lamports: recipientLamports,
//         })
//       );

//       // Add transfer to referrer if exists
//       if (referrerAddress && referrerLamports > 0) {
//         console.log("Adding referrer transfer to transaction");
//         transaction.add(
//           SystemProgram.transfer({
//             fromPubkey: publicKey,
//             toPubkey: new PublicKey(referrerAddress),
//             lamports: referrerLamports,
//           })
//         );
//       }

//       transaction.recentBlockhash = blockhash;
//       transaction.feePayer = publicKey;

//       console.log("Transaction created");

//       // Sign transaction
//       const signed = await phantom.signTransaction(transaction);
//       console.log("Transaction signed");

//       // Send transaction
//       const signature = await connection.sendRawTransaction(signed.serialize());
//       console.log("Transaction sent with signature:", signature);

//       // Wait for confirmation
//       const confirmation = await connection.confirmTransaction({
//         signature,
//         blockhash,
//         lastValidBlockHeight,
//       });

//       if (confirmation.value.err) {
//         throw new Error(
//           `Transaction failed: ${JSON.stringify(confirmation.value.err)}`
//         );
//       }

//       console.log("Transaction confirmed");

//       // Record transaction in Firebase with correct amounts
//       await recordPumpTransaction(
//         publicKey.toString(),
//         solAmount // This is the total amount
//         // signature
//       );

//       setToast({
//         type: "success",
//         message: `Pump successful! Transaction: ${signature.slice(0, 8)}...`,
//       });

//       // Optional: Fetch and log the final balances to verify transfers
//       const finalBalance = await connection.getBalance(publicKey);
//       console.log("Final balance:", finalBalance / LAMPORTS_PER_SOL, "SOL");

//       if (referrerAddress) {
//         const referrerBalance = await connection.getBalance(
//           new PublicKey(referrerAddress)
//         );
//         console.log(
//           "Referrer final balance:",
//           referrerBalance / LAMPORTS_PER_SOL,
//           "SOL"
//         );
//       }
//     } catch (error: unknown) {
//       console.error("Detailed pump error:", error);

//       let errorMessage = "Failed to process pump. Please try again.";
//       if (error instanceof Error) {
//         if (error.message.includes("Insufficient balance")) {
//           errorMessage = error.message;
//         } else {
//           errorMessage = `Error: ${error.message}`;
//         }
//       } else if (typeof error === "object" && error !== null) {
//         const errorObj = error as { logs?: string[] };
//         if (errorObj.logs?.length) {
//           errorMessage = `Transaction failed: ${errorObj.logs[0]}`;
//         }
//       }

//       setToast({
//         type: "error",
//         message: errorMessage,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={pump}
//         disabled={loading}
//         className={`
//           relative px-12 py-6 text-lg font-semibold rounded-full
//           bg-gradient-to-r from-emerald-400 to-teal-400
//           hover:from-emerald-500 hover:to-teal-500
//           transform hover:scale-105 transition-all duration-200
//           shadow-lg hover:shadow-emerald-500/25 active:scale-95
//           uppercase tracking-wider
//           disabled:opacity-50 disabled:cursor-not-allowed
//           disabled:hover:scale-100 disabled:active:scale-100
//           flex items-center gap-2
//         `}
//       >
//         {loading && <Loader2 className="w-5 h-5 animate-spin" />}
//         {connected ? "Pump" : "Connect Wallet"}
//       </button>

//       {toast && (
//         <Toast
//           type={toast.type}
//           message={toast.message}
//           onClose={() => setToast(null)}
//         />
//       )}

//       <PhantomGuide
//         isOpen={showPhantomGuide}
//         onClose={() => setShowPhantomGuide(false)}
//         referralCode={searchParams.get("ref")}
//       />
//     </>
//   );
// }

// export function PumpButton() {
//   return (
//     <Suspense
//       fallback={
//         <button className="relative px-12 py-6 text-lg font-semibold rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-50 cursor-not-allowed">
//           <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
//           Loading...
//         </button>
//       }
//     >
//       <PumpButtonInner />
//     </Suspense>
//   );
// }
