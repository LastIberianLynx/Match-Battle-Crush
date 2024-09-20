import React from 'react';
import './ImageScrollBox.css';

const ImageScrollBox = ({ images, changeFirstImage }) => {


  return (
    <div>
      <div className="scroll-box">
        {images.map((src, index) => (
          <div key={index} className="image-container">
            <img src={src} alt={`game cover ${index}`} className="scroll-image" />
          </div>
        ))}
      </div>

      {/* <button onClick={changeFirstImage}>Change First Image</button> */}
    </div>
  );
};

export default ImageScrollBox;
