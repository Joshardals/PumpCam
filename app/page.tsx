import { PumpButton } from "./_components/PumpButton";
// import { Pumps } from "./_components/Pumps";
import { Header } from "./_components/shared/Header";
import Decorations from "./_components/ui/Decorations";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-24 max-w-7xl mx-auto w-full gap-12">
        <PumpButton />
        {/* <Pumps /> */}
      </main>

      {/* Decorative Elements */}
      <Decorations />
    </div>
  );
}
