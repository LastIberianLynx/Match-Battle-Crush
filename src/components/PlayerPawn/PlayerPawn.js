import React, { useState, useEffect } from 'react';
import './PlayerPawn.css';
import ImageScrollBox from '../ImageScrollBox/ImageScrollBox';

const PlayerPawn = ({ position, swipes, reinforcements, level, addSwipe, addUnit, attack, restartGame, images, timer, attacksPerTurn, changeFirstImage }) => {
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
    addUnit({ name: unitName, xp: unitXP });
    setUnitName('');
    setUnitXP(1);
  };


  return (
    <div className="player-pawn" style={style}>
      <h2>Match Battle</h2>
      
      <div>Timer: {timer}</div>
      <div>Swipes: {swipes}</div>
      <div>Reinforcements: {reinforcements}</div>
      <div>Level: {level}</div>
      <div>Attacks per Turn: {attacksPerTurn}</div>
      {/* <button onClick={addSwipe}>Decrease Swipe</button> */}
      <div>
        {/* <input
          type="text"
          placeholder="Unit Name"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
        /> */}
        {/* <input
          type="number"
          placeholder="Health"
          value={unitHealth}
          onChange={(e) => setUnitHealth(Number(e.target.value))}
        /> */}
        {/* <button onClick={handleAddUnit}>Add Unit</button> */}
      </div>
      <div className="center-button">
        <button onClick={attack}>Start Battle</button>
      </div>
      <div className="center-button">
        <button onClick={restartGame}>Restart Game</button>
      </div>
      {/* <button onClick={changeFirstImage}>Change First Image</button> */}
      <ImageScrollBox images={images} />
    </div>
  );
};

export default PlayerPawn;
