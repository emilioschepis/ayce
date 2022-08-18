import React from "react";

import Header from "./Header";

type Props = {
  children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-screen bg-gray-200">
      <Header />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default MainLayout;
