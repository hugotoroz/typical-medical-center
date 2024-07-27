import { useState } from 'react'
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PrincipalNavbar from "./components/nav"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
    const [count, setCount] = useState(0);

    return (
      <Router>
        <div className="App">
          
          <PrincipalNavbar />
          <h2>Hola</h2>
        </div>
      </Router>
    );
  
}

export default App
