"use client";

import { NavBar } from "@/modules";

const Dashboard = () => {
  return (
    <>
      <NavBar
        showLogo={true}
        pageName="Shared Files"
        pageURL="/shared-files"
      />
      <div>Secure File Share using Post-Quantum Cryptography</div>
    </>
  );
};

export default Dashboard;
