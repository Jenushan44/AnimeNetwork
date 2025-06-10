import React from 'react';

function Popup({ message, onClose }) {
  return (
    <div className="popup-container">
      <div className="popup-message">
        {message}
        <button onClick={onClose}>×</button>
      </div>
    </div>
  );
}

export default Popup;