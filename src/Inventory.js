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
    return (
      <div className="inventory-modal">
        <span className="inventory-modal-close" onClick={props.closeModal}>&times;</span>
        <h2>Your Inventory</h2>
        <ul>
          {inventory.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };