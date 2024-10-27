"use client";

import { NavBar } from "@/modules";
import receivedLogo from "../assets/received-logo.svg"
import sharedLogo from "../assets/shared-logo.svg"
import shareLogo from "../assets/share-logo.svg"
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import type { StaticImageData } from 'next/image';
import Activity from "./activity";

import "./Dashboard.css"

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
        pages={[]}
      />
      <div className="dashboardContainer">
        {/* All cards in a single flex container */}
        <div className="cardContainer">
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
        <Route path="/  " element={<SharedFiles />} />
      </Routes>
    </Router>
  );
};


// Card Component with Navigation
const Card: React.FC<CardProps> = ({ title, description, logo, route }) => {
  const navigate = useNavigate();

  return (
    <div className="card" onClick={() => navigate(route)}>
      <img src={logo.src} alt={`${title} logo`} className="cardLogo" /> {/* Use logo.src */}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};


// Dummy pages for each route
const ShareFile: React.FC = () => <div><h2>Share File Page</h2></div>;
const ReceivedFiles: React.FC = () => <div><h2>Received Files Page</h2></div>;
const SharedFiles: React.FC = () => <div><h2>Shared Files Page</h2></div>;

export default Dashboard;
