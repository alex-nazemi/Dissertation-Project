import React from 'react';

const Stage = ({ stageData, onGuess }) => {
  return (
    <div>
      <div>
        {/* Here, you can render the Furhat robot's emotion using the stageData.correct value */}
      </div>
      {stageData.options.map((option, index) => (
        <button key={index} onClick={() => onGuess(option)}>
          {option}
        </button>
      ))}
    </div>
  );
};

export default Stage;
