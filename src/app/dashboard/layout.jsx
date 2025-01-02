import React from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";

function DashboardLayout({ children }) {
  return (
    <div className=" grid grid-cols-12">
      <div className=" col-span-2">
        <Sidebar />
      </div>
      <div className=" col-span-10">
        <Header />
        <div className="p-10">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
