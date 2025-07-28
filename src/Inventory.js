import CharacterGen from './CharacterGen';
import './App.css';
import React from 'react';



export const inventory = [];

export const addItemToInventory = (item) => {
  inventory.push(item);
}

export const removeItemFromInventory = (item) => {
  const index = inventory.indexOf(item);
  if (index > -1) {
    inventory.splice(index, 1);
  }
}



export const InventoryComponent = (props) => {
  const { inventory = [], closeModal, coins } = props;
  return (
    <div className="inventory-modal">
      <span className="inventory-modal-close" onClick={closeModal}>&times;</span>
      <h2>Your Inventory</h2>
      <div className="mobile-wallet-display">
        <h3>Coins: {coins || 0}</h3>
      </div>
      <div className="inventory-grid">
        {inventory.length === 0 ? (
          <p>Your inventory is empty.</p>
        ) : (
          inventory.map((item, index) => (
            <div className="inventory-item" key={index}>
              {item.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
};