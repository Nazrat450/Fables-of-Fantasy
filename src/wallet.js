import React, { useState, useEffect } from 'react';
import './App.css';



function Wallet({ coins }) {
  return (
    <div className="wallet">
      <h2>Wallet</h2>
      <p>Coins: {coins}</p>
    </div>
  );
}

export default Wallet;
