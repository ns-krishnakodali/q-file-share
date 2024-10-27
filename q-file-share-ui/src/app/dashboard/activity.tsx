
import { NavBar } from "@/modules";
import receivedLogo from "../assets/received-logo.png"
import sharedLogo from "../assets/shared-logo.png"
import shareLogo from "../assets/share-logo.png"
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import type { StaticImageData } from 'next/image';
import "./Dashboard.css"


const Activity: React.FC = () => {
    const notifications = [
      "Received a file from abc@gmail.com (NEW)",
      "Sent a file to xyz.com successfully",
      "File abc123.pdf has been downloaded 2 times",
    ];
  
    return (
      <div className="activity-card">
        <h3>Activity</h3>
        <ul>
          {notifications.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    );
  };

  
  export default Activity;
  