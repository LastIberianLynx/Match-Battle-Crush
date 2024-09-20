import React, { useState, useEffect } from 'react';

const MessageComponent = ({ message, trigger }) => {
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    // Show the message when 'trigger' changes
    setShowMessage(true);
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 4000);

    return () => clearTimeout(timer); // Cleanup the timeout when the component unmounts
  }, [trigger]); // Reset message visibility when 'trigger' changes

  return (
    <>
      {showMessage && (
        <div className="message" style={styles.message}>
          {message}
        </div>
      )}
    </>
  );
};

// Updated styles with your requested properties
const styles = {
  message: {
    position: 'fixed',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',

    padding: '10px 20px',
    borderRadius: '5px',
    zIndex: 1000,
    fontWeight: 'bold',

    /* Your requested styles */
    backgroundColor: '#ffdc9b',
    border: '8px solid #3d1900',      // Border styling
    color: '#3d1900',                 // Text color matching the border
    fontFamily: "'Press Start 2P', cursive", // Font family
    boxShadow: '0 4px 8px rgb(109, 109, 109)', // Box shadow for a slight depth
    imageRendering: 'pixelated',      // Ensures images are rendered pixelated (if images were used)
  },
};

export default MessageComponent;
