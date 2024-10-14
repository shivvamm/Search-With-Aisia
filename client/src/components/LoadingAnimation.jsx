import React from "react"; // Create a CSS file for the animation styles

const LoadingAnimation = ({ onClick }) => {
  return (
    <div className="loading-animation" onClick={onClick}>
      <div className="spinner"></div>
      <p>Click to Start Chat</p>
    </div>
  );
};

export default LoadingAnimation;
