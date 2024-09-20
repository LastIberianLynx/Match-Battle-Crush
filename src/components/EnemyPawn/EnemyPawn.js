import React, { useState, useEffect } from 'react';
import './EnemyPawn.css';
import ImageScrollBox from '../ImageScrollBox/ImageScrollBox';

const EnemyPawn = ({ position, swipes, addSwipe, addEnemy, attack, images, changeFirstImage }) => {
  const [unitName, setUnitName] = useState('');
  const [unitXP, setUnitXP] = useState(1);
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (position === 'right') {
      setStyle({ right: '10%' });
    // } else if (position === 'left') {
    } else {
      setStyle({ left: '10%' });
    }
  }, [position]);

  const handleAddUnit = () => {
    addEnemy({ name: unitName, xp: unitXP });
    setUnitName('');
    setUnitXP(1);
  };

  return (
    <div className="player-pawn" style={style}>
      <h2>Enemy Army</h2>
      {/* <div>Swipes: {swipes}</div>
      <button onClick={addSwipe}>Decrease Swipe</button> */}
      {/* <div>
        <input
          type="text"
          placeholder="Unit Name"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Health"
          value={unitHealth}
          onChange={(e) => setUnitHealth(Number(e.target.value))}
        />
        <button onClick={handleAddUnit}>Add Unit</button>
      </div> */}
      {/* <button onClick={attack}>Attack</button>
      <button onClick={changeFirstImage}>Change First Image</button> */}
      <ImageScrollBox images={images} />
    </div>
  );
};

export default EnemyPawn;
