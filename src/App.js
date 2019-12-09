import React from 'react';
import Transactions from './components/Transactions';

function App() {
  return (
    <div>
      <div className="container">
        <header className="App-header">
          <h1 className="text-center mb-4 mt-4">Rewards Application</h1>
        </header>
        <Transactions />
      </div>
    </div>
  );
}

export default App;
