import Amplify, { API, Auth } from 'aws-amplify'
import React, { useEffect, useState, useRef } from 'react';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Button from '@material-ui/core/Button';
import Chat from './Chat'
import ChatHeader from './ChatHeader'
import './ViewBuddies.css'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import 'bootstrap/dist/css/bootstrap.min.css';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
import Icon from '@material-ui/core/Icon';
import { Scrollbars } from 'react-custom-scrollbars';
import CardActionArea from '@material-ui/core/CardActionArea';
import BuddyInfoDrawer from './BuddyInfoDrawer.js'
import { graphqlOperation } from '@aws-amplify/api';
import { onCreateMessage } from '../graphql/subscriptions'
import { ChatEngine, getOrCreateChat } from 'react-chat-engine';



function ViewBuddies() {
    const [currentUser, setCurrentUser] = useState([])
    const [userInfo, setUserInfo] = useState()
    const [myBuddies, setMyBuddies] = useState([])
    const [messageRecipient, setMessageRecipient] = useState(null)
    const [cardActive, setCardActive] = useState("")
    const [messageRecipientColor, setMessageRecipientColor] = useState("")
    const [buddyInfoClicked, setBuddyInfoClicked] = useState(false)
    const [currentBuddy, setCurrentBuddy] = useState(null)

    const cardColor = ["#00ABE1", "#E5B9A8", "#9CF6FB", "#1FC58E", "#F8DD2E", "#FAB162", "#FF6495"]

    useEffect(() => {
        Auth.currentUserInfo().then((userInfo) => {
            setUserInfo(userInfo)
            // console.log(userInfo)
            API.graphql({ query: queries.studentByEmail, variables: { email: userInfo.attributes.email } })
                .then((currentUserData) => {
                    const currentStudent = currentUserData.data.studentByEmail.items[0]
                    setCurrentUser(currentStudent)

                    if (currentStudent.buddies != null) {
                        for (let i = 0; i < currentStudent.buddies.length; i++) {
                            API.graphql({ query: queries.studentByEmail, variables: { email: currentStudent.buddies[i] } })
                                .then((buddyData) => {

                                    setMyBuddies(oldMyBuddies => [...oldMyBuddies, buddyData.data.studentByEmail.items[0]])
                                })
                        }
                    }

                })
        })
    }, [])

    function handleCardClick(buddy, cardId) {
        setMessageRecipient(buddy.email)
        setCardActive(cardId)
        setMessageRecipientColor(cardColor[cardId % cardColor.length])
        setCurrentBuddy(buddy)
    }

    function handleBuddyInfoButtonClick(buttonClick) {
        setBuddyInfoClicked(buttonClick)
    }

    useEffect(() => {
        Auth.currentUserInfo().then((userInfo) => {
            setUserInfo(userInfo)
        })
    }, [])

    // useEffect(() => {
    //     var axios = require('axios');

    //     API.graphql({ query: queries.listStudents } )
    //         .then((currentUserData) => {
    //             const user=currentUserData.data.listStudents.items
    //             for(let i=0;i<user.length;i++){
    //                 var data = {
    //                     "username": user[i].firstName,
    //                     "secret": user[i].id,
    //                     "email": user[i].email,
    //                     "first_name": user[i].firstName,
    //                     "last_name": ""
            
    //                 }
    //                 console.log(data)
    //                 var config = {
    //                     method: 'post',
    //                     url: 'https://api.chatengine.io/users/',
    //                     headers: {
    //                         'PRIVATE-KEY': '{{df197a36-c1e6-4c7e-b350-f8aa7620495b}}'
    //                     },
    //                     data: data
    //                 };
            
    //                 axios(config)
    //                     .then(function (response) {
    //                         console.log(JSON.stringify(response.data));
    //                     })
    //                     .catch(function (error) {
    //                         console.log(error);
    //                     });
    //             }
    //         })
        
    // }, [])

    // useEffect(() => {
    //     try{
    //         const subscription = API
    //         .graphql(graphqlOperation(onCreateMessage))
    //         .subscribe({
    //             next: (event) => {
    //                 if (event.value.data.onCreateMessage.recepient == "keshav.sesh@gmail.com") {
    //                     console.log(event.value.data.onCreateMessage.author)
    //                 }

    //             }
    //         });

    //         subscription.unsubscribe();

    // }catch(e){
    //     console.log(e)
    // }
    // }, );

    return (
       
        <div className="ChatEngine">
             {console.log(userInfo)}
            <ChatEngine
                height='90vh'
                projectID='fc520d87-fa5a-41f6-a875-47536dedc84f'
                userName="Keshav"
                userSecret="9bcbf03d-7d0c-4bca-bf9a-aa17ad711a8e"
                renderIceBreaker={(chat) => { }}
                renderNewChatForm={(creds) => {}}
                // renderChatList={(chatAppState) => {console.log(chatAppState)}}
            />
        </div>
        // <div className="splitscreen">
        //     <div className="leftList">
        //         <div className="middlepane">
        //             <Scrollbars>
        //                 {myBuddies.map((buddies, index) => (
        //                     <div>
        //                         <Grid container spacing={0} justifyContent="center" >
        //                             <Grid item xs={12}   >
        //                                 <Card className={cardActive === index ? "cardActive" : "BuddyCard"}>
        //                                     <CardHeader
        //                                         avatar={<Avatar aria-label="recipe" style={{
        //                                             color: 'white',
        //                                             borderRadius: "100%",
        //                                             border: "solid",
        //                                             borderWidth: "0.0px", borderColor: "black",
        //                                             backgroundColor: cardColor[index % cardColor.length]
        //                                         }}>
        //                                             {buddies.firstName[0]}
        //                                         </Avatar>}
        //                                     />
        //                                     <CardContent className="CardContent" onClick={() => handleCardClick(buddies, index)}>
        //                                         {buddies.firstName}
        //                                     </CardContent>
        //                                 </Card>
        //                             </Grid>
        //                         </Grid>
        //                     </div>
        //                 ))}
        //             </Scrollbars>
        //         </div>
        //     </div>
        //     <div className="rightChat">
        //         <div className="bottompane">
        //             {messageRecipient != null && messageRecipient != undefined
        //                 ? <ChatHeader buddy={currentBuddy} buddyColor={messageRecipientColor} handleBuddyInfoButtonClick={handleBuddyInfoButtonClick}></ChatHeader>
        //                 : <div></div>
        //             }

        //             {messageRecipient != null && messageRecipient != undefined
        //                 ? <Chat data={messageRecipient} currentUserEmail={currentUser.email} />
        //                 : <div></div>
        //             }

        //         </div>
        //         {buddyInfoClicked != false
        //             ? <BuddyInfoDrawer buddy={currentBuddy} buddyColor={messageRecipientColor} ></BuddyInfoDrawer>
        //             : <div></div>
        //         }
        //     </div>
        // </div>

    )

}

export default ViewBuddies