import React, { useEffect, useState } from "react";
import { X, Download, ExternalLink, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PhantomGuideProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string | null;
}

export function PhantomGuide({
  isOpen = false,
  onClose,
  referralCode,
}: PhantomGuideProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = window.navigator.userAgent || window.navigator.vendor;
      return /android|iPad|iPhone|iPod/i.test(userAgent);
    };
    setIsMobile(checkMobile());
  }, []);

  const phantomStoreLinks = {
    ios: "https://apps.apple.com/us/app/phantom-solana-wallet/id1598432977",
    android: "https://play.google.com/store/apps/details?id=app.phantom",
    chrome:
      "https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa",
  };

  // const handlePhantomClick = () => {
  //   const baseUrl = "https://phantom.app/ul/browse";
  //   const currentUrl = window.location.href;
  //   const referralParam = referralCode ? `?ref=${referralCode}` : "";
  //   const encodedUrl = encodeURIComponent(`${currentUrl}${referralParam}`);
  //   const phantomUrl = `${baseUrl}/${encodedUrl}`;

  //   if (isMobile) {
  //     window.location.href = phantomUrl;
  //     setTimeout(() => {
  //       const storeLink = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  //         ? phantomStoreLinks.ios
  //         : phantomStoreLinks.android;
  //       window.location.href = storeLink;
  //     }, 1000);
  //   } else {
  //     window.open(phantomStoreLinks.chrome, "_blank");
  //   }
  // };

  const handlePhantomClick = () => {
    if (isMobile) {
      // Using Phantom's deep linking format for mobile
      const currentUrl = window.location.href;
      const referralParam = referralCode ? `?ref=${referralCode}` : "";
      const fullUrl = `${currentUrl}${referralParam}`;

      // Phantom deep link format
      const phantomUrl = `phantom://browse/${encodeURIComponent(fullUrl)}`;

      // Try opening Phantom first
      window.location.href = phantomUrl;

      // Fallback to store after a delay if Phantom isn't installed
      setTimeout(() => {
        const storeLink = /iPhone|iPad|iPod/i.test(navigator.userAgent)
          ? phantomStoreLinks.ios
          : phantomStoreLinks.android;
        window.location.href = storeLink;
      }, 1000);
    } else {
      window.open(phantomStoreLinks.chrome, "_blank");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800/50 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-full mb-6 mx-auto">
                <Smartphone className="w-8 h-8 text-emerald-400" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
                Get Started with Phantom
              </h2>

              <p className="text-zinc-400 text-center mb-8">
                To participate in pumps and earn rewards, you&apos;ll need to
                install the Phantom wallet first.
              </p>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handlePhantomClick}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <Download className="w-5 h-5" />
                  Install Phantom Wallet
                </button>

                <a
                  href="https://phantom.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-all duration-200"
                >
                  <ExternalLink className="w-5 h-5" />
                  Learn More
                </a>
              </div>

              <p className="text-xs text-zinc-500 text-center mt-6">
                Phantom is a secure crypto wallet built for Solana and other
                blockchains
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
