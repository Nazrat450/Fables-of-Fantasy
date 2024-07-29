import React, { useState, useEffect } from 'react';
import './App.css';



function Wallet({ coins, addCoins}) {
  return (
    <div className="wallet">
      <h2>Wallet</h2>
      <p>Coins: {coins}</p>
      <button onClick={() => addCoins(50)}>Add Coins</button>
    </div>
  );
}

export default Wallet;
