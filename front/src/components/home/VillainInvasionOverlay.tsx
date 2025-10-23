"use client";

import React from 'react';

interface VillainInvasionOverlayProps {
  isActive: boolean;
}

export const VillainInvasionOverlay: React.FC<VillainInvasionOverlayProps> = ({ 
  isActive 
}) => {
  if (!isActive) return null;

  return (
    <div className="villain-invasion-overlay" role="alert" aria-live="assertive">
      <div className="villain-invasion-bubble">
        <h2 className="villain-invasion-text">
          Achou que era só sobre os &apos;mocinhos&apos;?
        </h2>
      </div>
    </div>
  );
};
