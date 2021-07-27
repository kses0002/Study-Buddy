import React from 'react';
import './App.css';
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './NavigationBar';


import  Profile  from './Profile//Profile.js';
import  ViewStudents  from './View Students/ViewStudents.js';
import ViewBuddies from './ViewBuddies/ViewBuddies.js'
import FriendRequest from './Friend Requests/FriendRequest.js'

function App() {
  return (
    <React.Fragment>
      <Router>
        <NavigationBar />
        <Switch>
          <Route exact path="/ViewProfile" component={Profile} />
          <Route path="/ViewStudents" component={ViewStudents} />
          <Route path="/ViewBuddies" component={ViewBuddies} />
          <Route path="/FriendRequest" component={FriendRequest} />
          {/* <Route component={Home} /> */}
        </Switch>
      </Router>
      
    </React.Fragment>

  );
}

//export default App;
export default withAuthenticator(App, true);
