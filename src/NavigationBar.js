// import { React, Container} from 'react';
// import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
// import styled from 'styled-components';
// import Icon from '@material-ui/core/Icon';
// import { AmplifySignOut } from "@aws-amplify/ui-react";
// // import './NavigationBar.css';


// const Styles = styled.div`
//   .navbar { background-color: #1C1C19; }

//   a, .navbar-nav, .navbar-light .nav-link {
//     display:flex-end;
//     color: #FFC003;
//     font-size: 1.1em;
//     padding-left:17px;
//     padding-right:17px;
//     &:hover { color: #BE2F29; }
//   }
//   .navbar-brand {
//     font-size: 1.4em;
//     color: #000000;
//     &:hover { color: #BE2F29; }
//   }
//   .form-center {
//     position: absolute !important;
//     left: 25%;
//     right: 25%;
//   }
// `;

// export function NavigationBar() {
//   return (
//     <Styles>
//       <Navbar sticky="top" expand="lg">
//       {/* <Container> */}
//         {/* <Navbar.Brand href="/">Study Buddy</Navbar.Brand> */}
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">

//           <Nav className="ml-auto">
//             <Nav.Item ><Nav.Link  href="/ViewStudents">View Students</Nav.Link></Nav.Item>
//             <Nav.Item><Nav.Link href="/ViewBuddies">Buddies</Nav.Link></Nav.Item>
//             <Nav.Item ><Nav.Link href="/FriendRequest">Buddy Requests</Nav.Link></Nav.Item>
//             <Nav.Item ><Nav.Link href="/ViewProfile">Profile</Nav.Link></Nav.Item>
//             {/* <NavDropdown  title=",," id="dropdown-menu-right">
//               <NavDropdown.Item href="/ViewProfile">Profile</NavDropdown.Item>
//               <NavDropdown.Divider />
//               <NavDropdown.Item><AmplifySignOut /></NavDropdown.Item>
//             </NavDropdown> */}
//           </Nav>
//           {/* <Nav.Item><AmplifySignOut /></Nav.Item> */}
//         </Navbar.Collapse>
//         {/* </Container> */}
//       </Navbar>
//     </Styles>
//   )
// }

import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
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
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        <NavBtn>
          {/* <NavBtnLink to='/signin'>Sign In</NavBtnLink> */}
          <AmplifySignOut />
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navigationbar;

// import React , {useEffect} from 'react'
// import './NavigationBar.css';
// import { NavLink } from 'react-router-dom';
// import $ from 'jquery';
// import { AmplifySignOut } from "@aws-amplify/ui-react";

// const NavigationBar = () => {

//   function animation(){
//     var tabsNewAnim = $('#navbarSupportedContent');
//     var activeItemNewAnim = tabsNewAnim.find('.active');
//     var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
//     var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
//     var itemPosNewAnimTop = activeItemNewAnim.position();
//     var itemPosNewAnimLeft = activeItemNewAnim.position();
//     $(".hori-selector").css({
//       "top":itemPosNewAnimTop.top + "px", 
//       "left":itemPosNewAnimLeft.left + "px",
//       "height": activeWidthNewAnimHeight + "px",
//       "width": activeWidthNewAnimWidth + "px"
//     });
//     $("#navbarSupportedContent").on("click","li",function(e){
//       $('#navbarSupportedContent ul li').removeClass("active");
//       $(this).addClass('active');
//       var activeWidthNewAnimHeight = $(this).innerHeight();
//       var activeWidthNewAnimWidth = $(this).innerWidth();
//       var itemPosNewAnimTop = $(this).position();
//       var itemPosNewAnimLeft = $(this).position();
//       $(".hori-selector").css({
//         "top":itemPosNewAnimTop.top + "px", 
//         "left":itemPosNewAnimLeft.left + "px",
//         "height": activeWidthNewAnimHeight + "px",
//         "width": activeWidthNewAnimWidth + "px"
//       });
//     });
//   }

//   useEffect(() => {

//     animation();
//     $(window).on('resize', function(){
//       setTimeout(function(){ animation(); }, 500);
//     });

//   }, []);

//   return (
//   <nav className="navbar navbar-expand-lg navbar-mainbg">

//       <NavLink className="navbar-brand navbar-logo" to="/" exact>
//         Study Buddy
//       </NavLink>


//       <button 
//         className="navbar-toggler"
//         onClick={ function(){
//           setTimeout(function(){ animation(); });
//         }}
//         type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//         <i className="fas fa-bars text-white"></i>
//       </button>

//       <div 
//         className="collapse navbar-collapse" id="navbarSupportedContent">
//         <ul className="navbar-nav ml-auto">

//             <div className="hori-selector">
//               <div className="left"></div>
//               <div className="right"></div>
//             </div>


//             <li className="nav-item active">
//               <NavLink className="nav-link" to="/ViewProfile" exact>
//                 <i 
//                 className="far fa-address-book">
//                 </i>Profile
//               </NavLink> 
//             </li>

//             <li className="nav-item">
//               <NavLink className="nav-link" to="/ViewStudents" exact>
//                 <i 
//                 className="far fa-clone">
//                 </i>View Students
//               </NavLink>
//             </li>
//             <li className="nav-item">
//               <NavLink className="nav-link" to="/ViewBuddies" exact>
//                 <i 
//                 className="far fa-chart-bar">
//                 </i>Budddies
//               </NavLink>
//             </li>
//             <li className="nav-item">
//               <NavLink className="nav-link" to="/FriendRequest" exact>
//                 <i 
//                 className="far fa-copy">
//                 </i> Buddy Requests
//               </NavLink>
//             </li>
//             <li className="signOutButton">
//               <AmplifySignOut></AmplifySignOut>
//             </li>
//         </ul>
//       </div>
//   </nav>
//   )
// }
// export default NavigationBar;

// import React, { Component } from "react";
// import { MenuItems } from './MenuItems'
// import './NavigationBar.css'

// class NavigationBar extends Component {
// state={ clicked: false}

// handleClick = () =>{
//   this.setState({clicked: !this.state.clicked})
// }


//   render() {
//     return (
//       <nav className="NavbarItems">
//         <h1 className="navbar-logo">React<i className="fab fa-react"></i></h1>
//         <div className="menu-icon" onClick={this.handleClick}>
//         <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
//         </div>
//         <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
//           {MenuItems.map((item, index) => {
//             return (
//             // {console.log(item)}
//             <li key={index}>
//               <a className={item.cName} href={item.url}>
//                 {item.title}
//               </a>
//             </li>
//           )
//           })}
//         </ul>
//       </nav>
//     )
//   }
// }

// export default NavigationBar;