"use client";



import { NavBar } from "@/modules";
import receivedLogo from "../assets/received-logo.png"
import sharedLogo from "../assets/shared-logo.png"
import shareLogo from "../assets/share-logo.png"
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import type { StaticImageData } from 'next/image';

interface CardProps {
  title: string;
  description: string;
  logo: StaticImageData;
  route: string;
}

const Dashboard: React.FC = () => {
  return (
    <Router>
      <NavBar
        showLogo={true}
        pages={[
          { name: "Shared Files", path: "/shared-files" },
          { name: "Received Files", path: "/received-files" },
        ]}
      />
      <div style={styles.dashboardContainer}>
        {/* All cards in a single flex container */}
        <div style={styles.cardContainer}>
          <Card title="Share File" description="Securely share your files" logo={shareLogo} route="/share-file" />
          <Card title="Received Files" description="View files you've received" logo={receivedLogo} route="/received-files" />
          <Card title="Shared Files" description="Manage your shared files" logo={sharedLogo} route="/shared-files" />
        </div>
        <Activity />
      </div>

      {/* Define Routes */}
      <Routes>
        <Route path="/share-file" element={<ShareFile />} />
        <Route path="/received-files" element={<ReceivedFiles />} />
        <Route path="/shared-files" element={<SharedFiles />} />
      </Routes>
    </Router>
  );
};

// Navbar Component
const Navbar: React.FC = () => {
  return (
    <div style={styles.navbar}>
      <h2 style={styles.navTitle}>Secure File Share</h2>
      <button style={styles.logoutButton}>Logout</button>
    </div>
  );
};

// Card Component with Navigation
const Card: React.FC<CardProps> = ({ title, description, logo, route }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.card} onClick={() => navigate(route)}>
      <img src={logo.src} alt={`${title} logo`} style={styles.cardLogo} /> {/* Use logo.src */}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

// Activity Component for notifications
const Activity: React.FC = () => {
  const notifications = [
    "Received a file from abc@gmail.com (NEW)",
    "Sent a file to xyz.com successfully",
    "File abc123.pdf has been downloaded 2 times",
  ];

  return (
    <div style={styles.activityCard}>
      <h3>Activity</h3>
      <ul>
        {notifications.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
};

// Dummy pages for each route
const ShareFile: React.FC = () => <div><h2>Share File Page</h2></div>;
const ReceivedFiles: React.FC = () => <div><h2>Received Files Page</h2></div>;
const SharedFiles: React.FC = () => <div><h2>Shared Files Page</h2></div>;

// Inline styles
const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#282c34',
    color: 'white',
  },
  navTitle: {
    margin: 0,
  },
  logoutButton: {
    backgroundColor: '#ff4b5c',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  dashboardContainer: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center all elements in the container
  },
  cardContainer: {
    display: 'flex', // Align cards in a single row
    justifyContent: 'space-between', // Space them evenly
    width: '100%', // Full width for the card container
    maxWidth: '1200px', // Optional: limit the max width
    marginBottom: '20px',
  },
  card: {
    flex: 1, // Allow cards to grow and fill space evenly
    padding: '20px',
    margin: '0 10px', // Optional: add space between cards
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    textAlign: 'center' as 'center',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  cardLogo: {
    width: '40px',
    height: '40px',
    marginBottom: '10px',
  },
  activityCard: {
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: 'white',
    width: '100%', // Full width for the activity card
  },
};

export default Dashboard;
