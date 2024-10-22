import React, { useState } from 'react';
import Healthcare from './Healthcare';
import Patient from './Patient';
import InsuranceCompany from './InsuranceCompany';
import './App.css';  // Importing the CSS

function App() {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleComponentSelection = (component) => {
    setSelectedComponent(component);
  };

  const goBack = () => {
    setSelectedComponent(null);
  };

  return (
    <div className="App">
      {!selectedComponent ? (
        <div className="button-container">
          <button onClick={() => handleComponentSelection('Healthcare')}>Healthcare App</button>
          <button onClick={() => handleComponentSelection('Patient')}>Patient App</button>
          <button onClick={() => handleComponentSelection('InsuranceCompany')}>Insurance Company App</button>
        </div>
      ) : (
        <div className="component-container">
          {selectedComponent === 'Healthcare' && <Healthcare goBack={goBack} />}
          {selectedComponent === 'Patient' && <Patient goBack={goBack} />}
          {selectedComponent === 'InsuranceCompany' && <InsuranceCompany goBack={goBack} />}
        </div>
      )}
    </div>
  );
}

export default App;
