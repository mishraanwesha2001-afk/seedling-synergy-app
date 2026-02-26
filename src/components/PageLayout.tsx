import { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const PageLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background">
    <NavBar />
    <main className="pt-16">{children}</main>
    <Footer />
  </div>
);

export default PageLayout;
