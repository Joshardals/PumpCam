import { IoRadioButtonOn } from "react-icons/io5";

export function Header() {
  return (
    <>
      <header className="border-b border-zinc-800 backdrop-blur-sm fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <IoRadioButtonOn className="h-8 w-8 text-emerald-400" />
              <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-300 text-transparent bg-clip-text">
                PumpCam
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
