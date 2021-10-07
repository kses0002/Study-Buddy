// import React from 'react';
// import {
//   Nav,
//   NavLink,
//   Bars,
//   NavMenu,
//   NavBtn,
// } from './NavBarElements';
// import { AmplifySignOut } from "@aws-amplify/ui-react";

// const Navigationbar = () => {
//   return (
//     <>
//       <Nav>
//         <NavLink to='/'>
//          <h1>SB</h1>
//         </NavLink>
//         <Bars  />
//         <NavMenu>
//           <NavLink to='/ViewStudents' activeStyle>
//             Find Buddies
//           </NavLink>
//           <NavLink to='/ViewBuddies' activeStyle>
//             Chat
//           </NavLink>
//           <NavLink to='/FriendRequest' activeStyle>
//             Buddy Requests
//           </NavLink>
//           <NavLink to='/ViewProfile' activeStyle>
//             Profile
//           </NavLink>
//         </NavMenu>
//         <NavBtn>
//           <AmplifySignOut />
//         </NavBtn>
//       </Nav>
//     </>
//   );
// };

// export default Navigationbar;

import './NavigationBar.css'
import { Navbar, Container } from 'react-bootstrap'
import { NavDropdown } from 'react-bootstrap'
import { Nav } from 'react-bootstrap'


import React from 'react';
import { AmplifySignOut } from "@aws-amplify/ui-react";

const Navigationbar = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top" >

      <Navbar.Brand href="/ViewStudents">Study Buddy</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/ViewStudents">Find Buddies</Nav.
          Link>
          <Nav.Link href="/FriendRequest">Buddy Requests</Nav.Link>
          <Nav.Link href="/ViewBuddies">Chat</Nav.Link>
          
          {/* <NavDropdown  title="Settings" id="collasible-nav-dropdown" drop="left" >
            <NavDropdown.Item href="/ViewProfile" >Profile</NavDropdown.Item>
            <NavDropdown.Item > <AmplifySignOut /></NavDropdown.Item>
          </NavDropdown> */}
        </Nav>
        {/* <Nav className="nav-dropdown-menu"> */}
        <Nav >

        <NavDropdown  title="Settings" id="collasible-nav-dropdown" drop="left" className="nav-dropdown-menu">
            <NavDropdown.Item href="/ViewProfile" >Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item > <AmplifySignOut /></NavDropdown.Item>
          </NavDropdown>

        </Nav>
      </Navbar.Collapse>

    </Navbar>
  );
};

export default Navigationbar;