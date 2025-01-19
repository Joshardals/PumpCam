import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

interface ReferralData {
  [walletAddress: string]: {
    totalAmount: number;
    lastUpdated: Timestamp;
  };
}

interface UserData {
  referredBy?: string;
  totalEarnings: number;
  referrals: ReferralData;
}

export async function createOrUpdateUser(
  walletAddress: string,
  referrerAddress?: string
) {
  const userRef = doc(db, "users", walletAddress);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      referredBy: referrerAddress || null,
      totalEarnings: 0,
      referrals: {},
    });
  }
}

export async function recordPumpTransaction(
  fromWallet: string,
  amount: number,
  txHash: string
) {
  const userRef = doc(db, "users", fromWallet);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data() as UserData;

  if (userData?.referredBy) {
    const referrerRef = doc(db, "users", userData.referredBy);
    const referrerSnap = await getDoc(referrerRef);
    const referrerData = referrerSnap.data() as UserData;

    const referralAmount = amount / 2; // Half of pump amount goes to referrer
    const existingReferral = referrerData.referrals?.[fromWallet];

    await updateDoc(referrerRef, {
      [`referrals.${fromWallet}`]: {
        totalAmount: (existingReferral?.totalAmount || 0) + referralAmount,
        lastUpdated: Timestamp.now(),
      },
      totalEarnings: (referrerData.totalEarnings || 0) + referralAmount,
    });
  }
}

export async function getReferrerAddress(walletAddress: string) {
  const userRef = doc(db, "users", walletAddress);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data() as UserData;

  return userData?.referredBy || null;
}

export async function getReferralData(walletAddress: string) {
  const userRef = doc(db, "users", walletAddress);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data() as UserData;

  // Convert the referrals object to an array format for the UI
  return Object.entries(userData?.referrals || {}).map(
    ([userWallet, data]) => ({
      userWallet,
      amount: data.totalAmount,
      timestamp: data.lastUpdated,
    })
  );
}
