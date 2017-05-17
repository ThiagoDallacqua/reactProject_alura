import React, { Component } from 'react';
import HomeBox from './Home';
import AutorBox from './Autor';
import LivroBox from './Livro';
import {Link,   Route,  BrowserRouter as Router, Switch} from 'react-router-dom';
import './css/pure-min.css';
import './css/side-menu.css'

class App extends Component {
  render() {
    return (
    <Router>
      <div id="layout">
          <a href="#menu" id="menuLink" className="menu-link">
              <span></span>
          </a>

          <div id="menu">
              <div className="pure-menu">
                  <a className="pure-menu-heading" href="#">Company</a>

                  <ul className="pure-menu-list">
                      <li className="pure-menu-item"><Link to="/" className="pure-menu-link">Home</Link></li>
                      <li className="pure-menu-item"><Link to="/autor" className="pure-menu-link">Autor</Link></li>
                      <li className="pure-menu-item"><Link to="/livro" className="pure-menu-link">Livro</Link></li>
                  </ul>
              </div>
          </div>

          <div id="main">
            <Switch>
            <Route path="/" exact component={ HomeBox }/>
            <Route path="/autor" component={ AutorBox }/>
            <Route path="/livro" component={ LivroBox }/>
            // <Route component={HomeBox} /> {/* No match path */}
            </Switch>
          </div>
      </div>
    </Router>
    );
  }
}

export default App;
