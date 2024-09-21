import React, { useEffect, useState, useRef } from 'react';
import ScoreBoard from './components/ScoreBoard';
import BluePotion from './RPG Items/blue-potion.png';
import GoldDiamond from './RPG Items/gold-diamond.png'; //should give swipes
import GreenApple from './RPG Items/green-apple.png'; //should allow reinforcements.
// import RedPotion from './RPG Items/red-potion.png';
// import SilverCoin from './RPG Items/silver-coin.png';
import Sword from './RPG Items/sword.png';
import Swordsman from './RPG Items/assets/images/64 heavy infantry - elite8.png';
import Knight from './RPG Items/assets/images/64 cavalry - heavy1.png';
import Archer from './RPG Items/assets/images/64 light infantry3.png';
import Spearman from './RPG Items/assets/images/64 heavy infantry1.png';
import Blank from './RPG Items/blank.png';
import PlayerPawn from './components/PlayerPawn/PlayerPawn';
import EnemyPawn from './components/EnemyPawn/EnemyPawn';
import MessageComponent from './components/Message/Message';
import './App.css';

const width = 8;
const candyColors = [
  BluePotion,
  // GreenApple,
  // GoldDiamond,
  // SilverCoin,
  // RedPotion,
  Sword,
  GoldDiamond,
  GreenApple,
  Spearman,
  Knight,
  Archer,
  Swordsman
];

const reverseImageMap = {
  [BluePotion]: 'BluePotion',
  [GoldDiamond]: 'GoldDiamond',
  [GreenApple]: 'GreenApple',
  [Sword]: 'Sword',
  [Swordsman]: 'Swordsman',
  [Knight]: 'Knight',
  [Archer]: 'Archer',
  [Spearman]: 'Spearman'
};

const nameToObjectMap = Object.entries(reverseImageMap).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

const resourceTypes = [
  GoldDiamond,
  GreenApple,
  BluePotion,
  Sword

];

const unitTypes = [
  Swordsman,
  Knight,
  Archer,
  Spearman
];

class Unit {
  constructor(name, xp) {
    this.name = name;
    this.xp = xp;
  }

  displayInfo() {
    console.log(`${this.name} has ${this.xp} xp.`);
  }
}

const units_arr = [
  new Unit("Knight", 2)
];

const enemyUnits_arr = [
  new Unit("Archer", 1)
];

let g_Level = 0;
let maximumTime = 40;
let Swipes = 4;
let moves = 3;
let g_Reinforcements = 1;
const levelIncreaseNum = 3;



function loadStorageStats() {
        let levelStored = localStorage.getItem('level');
        //level is increased in battle to prevent cheating by just reloading.
        g_Level = levelStored ? parseInt(levelStored, 10) : 0;  
        localStorage.setItem('level', g_Level.toString());

        let timeStored = localStorage.getItem('maximumTime');
        let timeNum = timeStored ? parseInt(timeStored, 10) : 40;
        maximumTime = Math.max(timeNum - (10 + g_Level), 40);
        
        let reinforcementsStored = localStorage.getItem('reinforcements');
        let reinforcementsNum = reinforcementsStored ? parseInt(reinforcementsStored, 10) : 0;
        g_Reinforcements = Math.max(reinforcementsNum, 2);
  
        let movesStored = localStorage.getItem('moves');
        let movesNum = movesStored ? parseInt(movesStored, 10) : 2;
        moves = Math.max(movesNum, 2);

        if(g_Level == 0) {
          maximumTime = 40;
          moves = 2;
          g_Reinforcements = 2;

        }
        if (g_Level % levelIncreaseNum === 0) {
          const numToDecrease = Math.min(Math.ceil(g_Level / levelIncreaseNum), 5);
          g_Reinforcements = Math.max(g_Reinforcements - numToDecrease, 1);
          moves = Math.max(moves - numToDecrease, 1);
        }

        localStorage.setItem('maximumTime', maximumTime.toString());
        localStorage.setItem('reinforcements', g_Reinforcements.toString());
        localStorage.setItem('moves', moves.toString());


}

loadStorageStats();

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [swipes, setSwipes] = useState(4+g_Level);
  const [reinforcements, setReinforcements] = useState(g_Reinforcements);
  const [level, setLevel] = useState(0);
  const [units, setUnits] = useState(units_arr);
  const [enemyUnits, setEnemyUnits] = useState(enemyUnits_arr);
  const [timer, setTimer] = useState(maximumTime); 
  const [attacksPerTurn, setAttacksPerTurn] = useState(moves); 
  const [message, setMessage] = useState();
  const [trigger, setTrigger] = useState(false); // Additional state to force message display
  const gameRef = useRef(null);

  // Function to set a new message and trigger it to display
  const displayNewMessage = (newMessage) => {
    setMessage(newMessage);
    setTrigger(prev => !prev); // Toggle trigger to reset the display
  };


  useEffect(() => {
    // Dynamically change the message after 1 second (1000 ms)
    setTimeout(() => {

      if(g_Level % levelIncreaseNum === 0 && g_Level != 0) {

        displayNewMessage("New stage. Stats reduced.");
        
      } else {
        displayNewMessage("Build your army, Sire!");

      }
    }, 500);
  }, []);

  let initialImages = [
      Spearman
  ];

  const unitsDataOur = localStorage.getItem('ourUnits');
  let UnitsStorageOur = [];
  
  if (unitsDataOur) {
    const parsedUnits = JSON.parse(unitsDataOur);
    UnitsStorageOur = parsedUnits.map(data => {
      const unitType = nameToObjectMap[data.name];  // Map the string back to the object
      return unitType;  // Create the Unit instance
    });
  }
  initialImages = UnitsStorageOur;
  const initialEnemyImages = [
    Swordsman

  ];

  let newImage = 'https://upload.wikimedia.org/wikipedia/commons/6/6a/PNG_Test.png';
  const [images, setImages] = useState(initialImages);
  const [enemyImages, setEnemyImages] = useState([]);

  const changeFirstImage = () => {
    setImages([newImage, ...images.slice(1)]);
  };

  const addReinforcements = (Qty) => {
    setReinforcements(prevReinforcements => {
      const newReinforcements = Math.max(prevReinforcements + Qty, 0);
      return newReinforcements;
    }); //alternatively can useEffect()
  };

  const changeLevel = (Qty) => {
    setLevel(prevLevel => {
      const newLevel = Math.max(prevLevel + Qty, 0);
      return newLevel;
    }); //alternatively can useEffect()
  };


  const addSwipe = (Qty) => {
    setSwipes(prevSwipes => {
      const newSwipes = Math.max(prevSwipes + Qty, 0);
      if (newSwipes === 0) {
        startBattle(); // Call startBattle if swipes are 0
      }
      return newSwipes;
    }); //alternatively can useEffect()
  };

  const addUnit = (unit) => {
    setUnits(prevUnits => [...prevUnits, unit]);
  };

  const addEnemy = (unit) => {
    setEnemyUnits(prevUnits => [...prevUnits, unit]);
  };

  const attack = () => {
    startBattle();
  };

  
  const restartGame = () => {
    // alert("yoyo");
    const resetLevel = 0;
    setLevel(resetLevel);
    localStorage.setItem('maximumTime', resetLevel.toString());
    localStorage.setItem('level', resetLevel.toString());
    localStorage.setItem('moves', resetLevel.toString());
    localStorage.setItem('reinforcements', resetLevel.toString());

    localStorage.setItem('ourUnits', JSON.stringify([])); //reset
    window.location.reload();
  };

  function handleTileKeyDown(e) {
    e.preventDefault();
    console.log("key down");
    if (e.code === "Space") {
      startBattle();
    }
  }

  function startBattle() {

    displayNewMessage("Battle starting !");

    setTimeout(() => {
      console.log("space");
      saveUnits(units);
      localStorage.setItem('reinforcements', reinforcements.toString());
      localStorage.setItem('moves', attacksPerTurn.toString());
      window.location.href = '../test/index.html';
    }, 2000);

    
  }

  function loadLevel() {
    const level = localStorage.getItem('level');
    setLevel(prevLevel => {
      const newLevel = Math.max(prevLevel + level, 0);
      return newLevel;
    });
    //if no level then = 0?

  }
  
  function saveUnits(units) {
    units = [];
    units = enemyImages;
    const unitsData = units.map(unit => ({
      name: reverseImageMap[unit], // Convert image path to its name
      xp: unit.xp
    }));
    localStorage.setItem('enemyUnits', JSON.stringify(unitsData));
    const ourUnitsImages = images;
    const unitsData2 = ourUnitsImages.map(unit => ({
      name: reverseImageMap[unit], // Convert image path to its name
      xp: unit.xp
    }));
    localStorage.setItem('ourUnits', JSON.stringify(unitsData2));
  }

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === Blank;

      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay(score => score + 4);
        columnOfFour.forEach(square => (currentColorArrangement[square] = Blank));
        addSwipe(1);
        addReinforcements(+1);
        setTimer(prevTimer => prevTimer + 5);
        // maximumTime += 5;
        // localStorage.setItem('maximumTime', maximumTime.toString());
        return true;
      }
    }
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64
      ];
      const isBlank = currentColorArrangement[i] === Blank;

      if (notValid.includes(i)) continue;

      if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        rowOfFour.forEach(square => (currentColorArrangement[square] = Blank));
        setScoreDisplay(score => score + 4);
        addSwipe(2);
        addReinforcements(+1);
        setTimer(prevTimer => prevTimer + 5);
        // maximumTime += 5;
        // localStorage.setItem('maximumTime', maximumTime.toString());
        return true;
      }
    }
  };

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === Blank;

      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        columnOfThree.forEach(square => (currentColorArrangement[square] = Blank));
        setScoreDisplay(score => score + 3);
        return true;
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64
      ];
      const isBlank = currentColorArrangement[i] === Blank;

      if (notValid.includes(i)) continue;

      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        rowOfThree.forEach(square => (currentColorArrangement[square] = Blank));
        setScoreDisplay(score => score + 3);
        return true;
      }
    }
  };

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentColorArrangement[i] === Blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length);
        currentColorArrangement[i] = candyColors[randomNumber];
      }

      if (currentColorArrangement[i + width] === Blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = Blank;
      }
    }
  };

  const dragStart = e => {
    setSquareBeingDragged(e.target);
    console.log("drag start");
  };

  const dragDrop = e => {
    setSquareBeingReplaced(e.target);
  };

  const dragEnd = e => {
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));
    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
    ];
    const validMove = validMoves.includes(squareBeingReplacedId);
    if(!validMove)
      return;

    const item = squareBeingDragged.getAttribute('src');

    addSwipe(-1);
    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src');
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src');

    const isAColumnOfFour = checkForColumnOfFour();
    const isARowOfFour = checkForRowOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfThree = checkForRowOfThree();

    if(isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree)
    {
      if(resourceTypes.includes(item)) {
        if(item == GreenApple)
        addSwipe(+3);
        else if(item == GoldDiamond)
          addReinforcements(+1);
        else if (item == BluePotion) {
          setTimer(prevTimer => prevTimer + 15);
          maximumTime += 2;
          localStorage.setItem('maximumTime', maximumTime.toString());
        }
        else if (item == Sword)
          setAttacksPerTurn(prevAttacksPerTurn => prevAttacksPerTurn + 1);
      }
      else
      images.push(squareBeingDragged.getAttribute('src'));
      // addEnemies(BluePotion, 1);
      // images.push("https://www.iconsdb.com/icons/preview/blue/square-xxl.png");
      // images.push(newImage);

    }

    if (
      squareBeingReplacedId 
      // && validMove &&
      // (isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree)
    ) {
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } else {
      // Restore colors to what they were originally
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src');
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src');
      setCurrentColorArrangement([...currentColorArrangement]);

    }
  };



  useEffect(() => {
    loadLevel();
  }, []);

  useEffect(() => {
    addEnemies(Spearman, g_Level);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const timerInterval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
  
      return () => clearInterval(timerInterval);
    } else {
      // Timer reached 0, start the battle
      startBattle();
    }
  }, [timer]);

  const addEnemies = (mainEnemyUnit, level =3) => {
    if(level < 1)
      level = 1;

    const modifier = 4;
    let numEnemies = level * modifier;
    for (let i = 0; i < numEnemies; ++i) {
      // Generate a random number between 0 and 1
      const isMainEnemy = Math.random() < 0.5; // 50% chance of getting mainEnemyUnit  
      let enemyToAdd;
      if (isMainEnemy) {
        // Add the mainEnemyUnit
        enemyToAdd = mainEnemyUnit;
      } else {
        // Add a random enemy from candyColors
        const randomIndex = Math.floor(Math.random() * unitTypes.length);
        enemyToAdd = unitTypes[randomIndex];
      }
  
      // Add the selected enemy to the enemyImages array
      enemyImages.push(enemyToAdd);
    }
  }

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomNumber = Math.floor(Math.random() * candyColors.length);
      const randomColor = candyColors[randomNumber];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  };

  useEffect(() => {

    createBoard();

  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 300);
    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForColumnOfThree,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentColorArrangement
  ]);

  useEffect(() => {
    const handleKeyDown = e => handleTileKeyDown(e);
    const gameElement = gameRef.current;
    gameElement.tabIndex = 0;
    gameElement.addEventListener('keydown', handleKeyDown);
    gameElement.focus();

    return () => {
      gameElement.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const MyComponent = ({ condition }) => {
    const style = { right: condition ? "30px" : "50px" };
  }
  return (
    <div className="app">
      <div className="game" ref={gameRef}>
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      {/* <ScoreBoard score={scoreDisplay} /> */}
      <div>
        <PlayerPawn
        position = "left"
          swipes={swipes}
          reinforcements={reinforcements}
          level={level}
          addSwipe={addSwipe}
          // addUnit={addUnit}
          attack={attack}
          restartGame={restartGame}
          images={images} 
          timer={timer}
          attacksPerTurn={attacksPerTurn}
          // changeFirstImage={changeFirstImage}
        />
        {/* Add other components and logic */}
      </div>

      <div>
        <EnemyPawn
          position = "right"
          swipes={swipes}
          addSwipe={addSwipe}
          addEnemy={addEnemy}
          attack={attack}
          images={enemyImages} changeFirstImage={changeFirstImage}
        />
        {/* Add other components and logic */}
      </div>

    <div className="App">
    <MessageComponent message={message} trigger={trigger} />
    </div>
    </div>
  );
};

export default App;
