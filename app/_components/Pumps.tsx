"use client";
import { useEffect, useState } from "react";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useWalletStore } from "@/lib/store";

interface PumpData {
  userWallet: string;
  amount: number;
  timestamp: Timestamp;
}

interface UserData {
  hasPumped: boolean;
  referrals: Record<string, { totalAmount: number; lastUpdated: Timestamp }>;
}

export function Pumps() {
  const { walletAddress } = useWalletStore();
  const [showCopied, setShowCopied] = useState(false);
  const [referralData, setReferralData] = useState<PumpData[]>([]);
  const [referralLink, setReferralLink] = useState<string>();
  const [hasPumped, setHasPumped] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    setReferralLink(`${window.location.origin}?ref=${walletAddress}`);

    // Set up real-time listener for user data
    const unsubscribe = onSnapshot(
      doc(db, "users", walletAddress),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data() as UserData;
          setHasPumped(userData.hasPumped);

          // Transform referrals data
          const referralsArray = Object.entries(userData.referrals || {}).map(
            ([userWallet, data]) => ({
              userWallet,
              amount: data.totalAmount,
              timestamp: data.lastUpdated,
            })
          );
          setReferralData(referralsArray);
        }
      },
      (error) => {
        console.error("Error fetching user data:", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [walletAddress]);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink || "");
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  if (!walletAddress || !hasPumped) return null;

  return (
    <div className="w-full max-w-3xl space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-emerald-400">
          Your Referral Link
        </h2>
        <div className="relative flex items-center">
          <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 pr-24 font-mono text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
            {referralLink}
          </div>
          <div className="absolute right-2 flex space-x-2">
            <button
              onClick={copyReferralLink}
              className="p-2 hover:bg-zinc-800 rounded-md transition-colors relative"
            >
              <FiCopy className="w-5 h-5 text-emerald-400" />
              <span
                className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-xs px-2 py-1 rounded transition-opacity ${
                  showCopied ? "opacity-100" : "opacity-0"
                }`}
              >
                Copied!
              </span>
            </button>
            <a
              href={referralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-zinc-800 rounded-md transition-colors"
            >
              <FiExternalLink className="w-5 h-5 text-emerald-400" />
            </a>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-emerald-400 mb-6">
          Referral Earnings
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-4 px-6 text-zinc-400 font-medium">
                  Address
                </th>
                <th className="text-right py-4 px-6 text-zinc-400 font-medium">
                  Pumps
                </th>
                <th className="text-right py-4 px-6 text-zinc-400 font-medium">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {referralData.map((referral) => (
                <tr
                  key={referral.userWallet}
                  className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors"
                >
                  <td className="py-4 px-6 font-mono text-sm">
                    {referral.userWallet.slice(0, 4)}...
                    {referral.userWallet.slice(-4)}
                  </td>
                  <td className="py-4 px-6 text-right text-emerald-400">
                    {referral.amount.toFixed(6)} SOL
                  </td>
                  <td className="py-4 px-6 text-right text-zinc-400 text-sm">
                    {new Date(
                      referral.timestamp.seconds * 1000
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
