import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar, Landing, Register, Login } from './components/index';
import './App.css';

const App = () => {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path='/' component={Landing} />
        <section className='container'>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
        </section>
      </Fragment>
    </Router>
  );
};

export default App;
