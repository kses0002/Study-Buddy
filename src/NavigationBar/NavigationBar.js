import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
} from './NavBarElements';
import { AmplifySignOut } from "@aws-amplify/ui-react";

const Navigationbar = () => {
  return (
    <>
      <Nav>
        <NavLink to='/'>
         <h1>SB</h1>
        </NavLink>
        <Bars onClick={console.log("CLOCK")} />
        <NavMenu>
          <NavLink to='/ViewStudents' activeStyle>
            View Students
          </NavLink>
          <NavLink to='/ViewBuddies' activeStyle>
            Buddies
          </NavLink>
          <NavLink to='/FriendRequest' activeStyle>
            Buddy Requests
          </NavLink>
          <NavLink to='/ViewProfile' activeStyle>
            Profile
          </NavLink>
        </NavMenu>
        <NavBtn>
          <AmplifySignOut />
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navigationbar;

