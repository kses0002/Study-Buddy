import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { withAuthenticator } from "@aws-amplify/ui-react";

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import  {NavigationBar}  from './NavigationBar';
import NavigationBar from './NavigationBar/NavigationBar';
import Button from '@material-ui/core/Button';
import * as queries from './graphql/queries';

import Profile from './Profile//Profile.js';
import ViewStudents from './View Students/ViewStudents.js';
import ViewBuddies from './ViewBuddies/ViewBuddies.js'
import FriendRequest from './Friend Requests/FriendRequest.js'
import { Hub, Auth, API } from 'aws-amplify'

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // get user
  async function getUser() {
    try {
      // let token=""
      // token = await Auth.currentAuthenticatedUser().then(()=>{
      //   setUser(token);
      // });
      const token = await Auth.currentAuthenticatedUser()
      setUser(true)
      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }
  //listen for sign in + out events, if neither are happening check if user exists 
  useEffect(() => {
    Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signIn') {
        return getUser();
      }
      if (payload.event === 'signOut') {
        setUser(null);
        return setLoading(false);
      }
    });
    getUser();
  }, []);


  // if (user!=false && user!=null) {
  //   console.log(user)
  //   return (
  //     API.graphql({ query: queries.studentByEmail, variables: { email: user.attributes.email } }).then((data) => {
  //       let checkProfileExists=true
  //       if (data.data.studentByEmail.items.length == 0) {
  //         checkProfileExists=false
  //       }

  //       <React.Fragment>
  //           <Router>
  //             <NavigationBar />
  //             <Switch>
  //               <Route exact path="/ViewProfile" component={Profile} />
  //               <Route path="/ViewStudents" component={ViewStudents} />
  //               <Route path="/ViewBuddies" component={ViewBuddies} />
  //               <Route path="/FriendRequest" component={FriendRequest} />
  //               <Route component={checkProfileExists ? ViewStudents : Profile} />
  //             </Switch>
  //           </Router>

  //         </React.Fragment>
  //     })

  //   )
  // }
  if (user) {
    // console.log(user)
    return (
      <React.Fragment>
        <Router>
          <NavigationBar />
          <Switch>
            <Route exact path="/ViewProfile" component={Profile} />
            <Route path="/ViewStudents" component={ViewStudents} />
            <Route path="/ViewBuddies" component={ViewBuddies} />
            <Route path="/FriendRequest" component={FriendRequest} />
            <Route component={ViewStudents } />
          </Switch>
        </Router>

      </React.Fragment>
    )
  }
  else {
    return (
      <button onClick={() => {
        Auth.federatedSignIn({ provider: 'Google' })
      }}> Google Sign In
      </button>

    )
  }
}

export default App;
// export default withAuthenticator(App, true);

