import { useState } from 'react'
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PrincipalNavbar from "./components/nav"
import imageHospital from "./images/hospital1.png"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="App">
          <Router>
            <PrincipalNavbar />
          </Router>
          <div className="container-fluid"> 
            <div className="row">
              <div className="col">
                <img src={imageHospital} alt="" className="initialImage" />
              </div>
              <div className="col">
                <div className="initialText">
                  <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi aspernatur ab natus dolorum fuga facilis optio voluptatibus accusamus fugit labore ea rem dignissimos asperiores voluptatem temporibus, cumque vero eveniet adipisci?</h2>
                </div>
              </div>
            </div> 
          </div>
        </div>
      
    );
  
}

export default App
