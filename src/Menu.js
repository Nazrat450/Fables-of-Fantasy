import React, { useState, useRef, useEffect } from 'react';
import Job from './Job';

export default function Menu({ onShopClick, onDiceClick, onJobClick, onSocialClick, onCharacterSheetClick, onTownClick, disabled, isMobile }) {
  const [showOptions, setShowOptions] = useState(false);
  const drawerRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }
    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  return (
    <div style={{ display: 'inline-block', marginLeft: '10px', position: 'relative' }}>
      <button
        className="menu-button"
        onClick={() => setShowOptions(true)}
        disabled={disabled}
      >
        Menu
      </button>
      {showOptions && (
        <>
          <div
            ref={drawerRef}
            className={`menu-drawer${showOptions ? ' open' : ''}`}
          >
            <span className="menu-drawer-close" onClick={() => setShowOptions(false)}>&times;</span>
            <h3 className="menu-title">Game Menu</h3>
            <button className="menu-option" onClick={() => { onTownClick(); setShowOptions(false); }} disabled={disabled}>Town</button>
            <button className="menu-option" onClick={() => { onDiceClick(); setShowOptions(false); }} disabled={disabled}>Dice Roll</button>
            <button className="menu-option" disabled>Train</button>
            <button className="menu-option" disabled>Quest</button>
            <button className="menu-option" onClick={() => { onJobClick(); setShowOptions(false); }} disabled={disabled}>Job</button>
            <button className="menu-option" onClick={() => { onSocialClick(); setShowOptions(false); }} disabled={disabled}>Social</button>
            {isMobile && (
              <button className="menu-option" onClick={() => { onCharacterSheetClick(); setShowOptions(false); }} disabled={disabled}>Character Sheet</button>
            )}
          </div>
          <div className="menu-drawer-backdrop" onClick={() => setShowOptions(false)} />
        </>
      )}
    </div>
  );
};