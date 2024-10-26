import { NavBar } from "@/modules";

const Dashboard = () => {
  return (
    <>
      <NavBar showLogo={true} currentPage="dashboard" />
      <div>Secure File Share using Post-Quantum Cryptography</div>
    </>
  );
};

export default Dashboard;
