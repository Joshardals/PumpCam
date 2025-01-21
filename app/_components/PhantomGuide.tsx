import React, { useEffect, useState } from "react";
import { X, Download, ExternalLink, Smartphone, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PhantomGuideProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string | null;
}

interface GuideSectionProps {
  title: string;
  steps: string[];
}

const GuideSection: React.FC<GuideSectionProps> = ({ title, steps }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={index} className="flex gap-4">
          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
            {index + 1}
          </span>
          <p className="text-zinc-300 mt-1">{step}</p>
        </li>
      ))}
    </ol>
  </div>
);

export const PhantomGuide: React.FC<PhantomGuideProps> = ({
  isOpen,
  onClose,
  referralCode,
}) => {
  const [showLearnMore, setShowLearnMore] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = (): boolean => {
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

  const handlePhantomClick = (): void => {
    if (isMobile) {
      const currentUrl = window.location.href;
      const referralParam = referralCode ? `?ref=${referralCode}` : "";
      const fullUrl = `${currentUrl}${referralParam}`;

      const phantomBrowseLink = `https://phantom.app/ul/browse/${encodeURIComponent(
        fullUrl
      )}?ref=${encodeURIComponent(window.location.origin)}`;

      window.location.href = phantomBrowseLink;

      setTimeout(() => {
        const storeLink = /iPhone|iPad|iPod/i.test(navigator.userAgent)
          ? phantomStoreLinks.ios
          : phantomStoreLinks.android;
        window.location.href = storeLink;
      }, 1500);
    } else {
      window.open(phantomStoreLinks.chrome, "_blank");
    }
  };

  const LearnMoreContent: React.FC = () => (
    <div className="space-y-8">
      <button
        onClick={() => setShowLearnMore(false)}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <GuideSection
        title="How PumpCam Works"
        steps={[
          "Create Your First Pump - To unlock PumpCam features and generate a unique referral link, start by creating your first pump.",
          "Share Your Pump Links - Distribute your referral links to others. When users create a pump using your referral ID, all deposits made by those users will be credited directly to your address.",
          "Earn Pumps for Life - Once users create pumps under your referral ID, you will continue to receive all their pumps for life, ensuring ongoing benefits.",
        ]}
      />

      <GuideSection
        title="How to use PumpCam"
        steps={[
          "Download and Install Phantom Wallet - Begin by downloading and installing the Phantom Wallet application on your device.",
          "Set Up a Wallet - Follow the prompts to set up your wallet within the Phantom Wallet application.",
          'Access PumpCam Through Phantom Wallet - Select the  "Open in Phantom Wallet" option to integrate PumpCam with your wallet.',
          "Activate PumpCam Features - Click on the pump icon to access PumpCam's features and generate a referral ID for sharing pumps.",
        ]}
      />

      <p className="text-zinc-400 text-sm italic">
        This streamlined process ensures seamless usage and sharing of PumpCam
        capabilities.
      </p>
    </div>
  );

  const MainContent: React.FC = () => (
    <>
      <div className="flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-full mb-6 mx-auto">
        <Smartphone className="w-8 h-8 text-emerald-400" />
      </div>

      <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
        Open Dapp in Phantom
      </h2>

      <p className="text-zinc-400 text-center mb-8">
        Open Dapp in phantom to join pumps
      </p>

      <div className="space-y-4">
        <button
          onClick={handlePhantomClick}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
        >
          <Download className="w-5 h-5" />
          Open in Phantom Wallet
        </button>

        <button
          onClick={() => setShowLearnMore(true)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-all duration-200"
        >
          <ExternalLink className="w-5 h-5" />
          Learn More
        </button>
      </div>
    </>
  );

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
            className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <button
              title="close"
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 max-h-[80vh] overflow-y-auto">
              {showLearnMore ? <LearnMoreContent /> : <MainContent />}

              <p className="text-xs text-zinc-500 text-center mt-6">
                PumpCam ™
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PhantomGuide;
