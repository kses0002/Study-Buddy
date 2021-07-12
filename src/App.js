import React from 'react';
import './App.css';
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './NavigationBar';


import  Profile  from './Profile.js';
import { ViewStudents } from './ViewStudents.js';

function App() {
  return (
    <React.Fragment>
      <Router>
        <NavigationBar />
        <Switch>
          <Route exact path="/ViewProfile" component={Profile} />
          <Route path="/ViewStudents" component={ViewStudents} />
          {/* <Route component={Home} /> */}
        </Switch>
      </Router>
      
    </React.Fragment>

  );
}

//export default App;
export default withAuthenticator(App, true);
