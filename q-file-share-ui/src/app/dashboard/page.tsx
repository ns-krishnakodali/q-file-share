import { NavBar } from "@/modules";

const Dashboard = () => {
  return (
    <>
      <NavBar
        showLogo={true}
        pages={[
          { name: "Shared Files", path: "/shared-files" },
          { name: "Received Files", path: "/received-files" },
        ]}
      />
      <div>Secure File Share using Post-Quantum Cryptography</div>
    </>
  );
};

export default Dashboard;
