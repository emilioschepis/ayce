import React from "react";

import Footer from "./Footer";
import Header from "./Header";

type Props = {
  children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      <Header />
      <main className="flex-1 overflow-y-scroll p-4">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
