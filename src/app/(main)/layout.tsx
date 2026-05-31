import Footer from "@/components/layout/Footer";
import NavBar from "@/components/layout/NavBar";
import type { MainLayoutProps } from "@/lib/types";

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
