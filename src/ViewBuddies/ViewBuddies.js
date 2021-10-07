import Amplify, { API, Auth } from 'aws-amplify'
import React, { useEffect, useRef, useState } from 'react';
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
import { onCreateLatestMessage, onUpdateLatestMessage } from '../graphql/subscriptions'


export default function ViewBuddies() {
    const [currentUser, setCurrentUser] = useState([])
    const [myBuddies, setMyBuddies] = useState([])
    const [messageRecipient, setMessageRecipient] = useState(null)
    const [cardActive, setCardActive] = useState("")
    const [messageRecipientColor, setMessageRecipientColor] = useState("")
    const [buddyInfoClicked, setBuddyInfoClicked] = useState(false)
    const [currentBuddy, setCurrentBuddy] = useState("")
    const [userInfo, setUserInfo] = useState(null)
    const [latestMessages, setLatestMessages] = useState(null)
    const [subscriptionData, setSubscrptionData] = useState(null)


    const cardColor = ["#00ABE1", "#E5B9A8", "#9CF6FB", "#1FC58E", "#F8DD2E", "#FAB162", "#FF6495"]

    useEffect(() => {
        Auth.currentUserInfo().then((userInfo) => {
            setUserInfo(userInfo)
        })
    }, [])


    useEffect(() => {
        Auth.currentAuthenticatedUser().then((user) => {
            API.graphql({ query: queries.studentByEmail, variables: { email: user.attributes.email } })
                .then((currentUserData) => {
                    const currentStudent = currentUserData.data.studentByEmail.items[0]
                    setCurrentUser(currentStudent)


                    API.graphql(graphqlOperation(queries.latestMessageByBuddyPair, {
                        recepient: user.attributes.email
                    }
                    )).then((recievedMessagesData) => {
                        const latestMessageObject = {}
                        const recievedMessages = recievedMessagesData.data.latestMessageByBuddyPair.items

                        for (let j = 0; j < recievedMessages.length; j++) {
                            latestMessageObject[recievedMessages[j].author] = recievedMessages[j]
                        }

                        if (currentStudent.buddies != null) {
                            for (let i = 0; i < currentStudent.buddies.length; i++) {

                                API.graphql({ query: queries.studentByEmail, variables: { email: currentStudent.buddies[i] } })
                                    .then((buddyData) => {
                                        const buddy = buddyData.data.studentByEmail.items[0]
                                        if (!(buddy.email in latestMessageObject)) {
                                            latestMessageObject[buddy.email] = { body: "" }
                                        }

                                        setMyBuddies(oldArray => [...oldArray, buddyData.data.studentByEmail.items[0]])
                                    })
                            }
                            setLatestMessages(latestMessageObject)
                        }
                    })

                })
        })
    }, [])


    useEffect(() => {
        if (userInfo != null) {
            try {
                const subscription = API
                    .graphql(graphqlOperation(onUpdateLatestMessage))
                    .subscribe({
                        next: (event) => {
                            const data = event.value.data.onUpdateLatestMessage
                            if (data.recepient == userInfo.attributes.email  && !(data.seen=="true" && data.body.substr(0,4) =="You:")) {
                                setSubscrptionData(data)
                            }
                        }
                    });
            }
            catch (error) {
                console.log(error)
            }

            try {
                const subscription = API
                    .graphql(graphqlOperation(onCreateLatestMessage))
                    .subscribe({
                        next: (event) => {
                            const data = event.value.data.onCreateLatestMessage
                            if (data.author == userInfo.attributes.email) {
                                setSubscrptionData(data)
                            }
                        }
                    });
            }
            catch (error) {
                console.log(error)
            }
        }
    }, [userInfo]);

    useEffect(() => {
        if (subscriptionData != null) {
            let newData = null
            let keyToChange = null

            if (subscriptionData.author in latestMessages) {
                keyToChange = subscriptionData.author
                newData = latestMessages[keyToChange]
                newData.body = subscriptionData.body
                newData.seen = subscriptionData.seen


                if (newData.author == currentBuddy.email) {
                    newData.seen = "true"
                }

                setLatestMessages(oldData => ({
                    ...oldData, [subscriptionData.author]: newData
                }))

            }
            else {
                keyToChange = subscriptionData.recepient
                newData = subscriptionData


                if (newData.author == currentBuddy.email) {
                    newData.seen = "true"
                }

                setLatestMessages(oldData => ({
                    ...oldData, [subscriptionData.recepient]: newData
                }))
            }
            // const newData = { ...latestMessages[keyToChange], seen: subscriptionData.seen, body:subscriptionData.body } 
            // API.graphql({ query: mutations.updateLatestMessage, variables: { input: newData } });
        }
    }, [subscriptionData])


    function handleCardClick(buddy, cardId) {
        setMessageRecipient(buddy.email)
        setCardActive(cardId)
        setCurrentBuddy(buddy)
        setMessageRecipientColor(cardColor[cardId % cardColor.length])

        // latestMessages[buddy.email].seen = "true"

        const keyToChange = buddy.email

        // const newData = latestMessages[keyToChange]
        // newData.seen = "true"

        const newData = { ...latestMessages[keyToChange], seen: "true" }
        setLatestMessages(oldData => ({
            ...oldData, [buddy.email]: newData
        }))

        API.graphql({ query: mutations.updateLatestMessage, variables: { input: newData } });

    }

    function handleBuddyInfoButtonClick(buttonClick) {
        setBuddyInfoClicked(buttonClick)
    }

    function removeBuddy(buddyToRemove){
        for (let i=0; i<myBuddies.length;i++){
            if(myBuddies[i].email==buddyToRemove.email){
                setMyBuddies(myBuddies.filter(item => item.email !== buddyToRemove.email));
                setMessageRecipient(null)
                setBuddyInfoClicked(false)
            }
        }
    }

    function handleCurrentMessage(currentMessage) {
        if (currentMessage.author == userInfo.attributes.email) {

            const keyToChange = currentMessage.recepient

            // const newData = latestMessages[keyToChange]
            // newData.seen = "true"
            // newData.body = "You: " + currentMessage.body

            const newData = { ...latestMessages[keyToChange], seen: "true", body: "You: " + currentMessage.body }

            setLatestMessages(oldData => ({
                ...oldData, [currentMessage.recepient]: newData
            }))

            API.graphql({ query: mutations.updateLatestMessage, variables: { input: newData } });

        }
    }

    return (
        <div className="splitscreen">
            <div className="leftList">
                <div className="middlepane">
                    <Scrollbars>
                        {myBuddies.map((buddies, index) => (
                            <div>
                                <Grid container spacing={0} justifyContent="center" >
                                    <Grid item xs={12}   >
                                        <Card className={cardActive === index ? "cardActive" : "BuddyCard"}>
                                            <CardHeader
                                                avatar={<Avatar aria-label="recipe" style={{
                                                    color: 'white',
                                                    borderRadius: "100%",
                                                    border: "solid",
                                                    borderWidth: "0.0px", borderColor: "black",
                                                    backgroundColor: cardColor[index % cardColor.length]
                                                }}>
                                                    {buddies.firstName[0]}

                                                </Avatar>}
                                            />
                                            <CardContent className="CardContent" onClick={() => handleCardClick(buddies, index)}>
                                                <Grid container spacing={0} justifyContent="center">
                                                    <Grid item xs={12}>
                                                        {buddies.firstName}
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        {latestMessages[buddies.email].seen == "false"
                                                            ? <Typography style={{ color: "black", fontWeight: "990" }}>{latestMessages[buddies.email].body}</Typography>
                                                            : <Typography style={{ color: "black" }}>{latestMessages[buddies.email].body}</Typography>}

                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </div>
                        ))}
                    </Scrollbars>
                </div>
            </div>
            <div className="rightChat">
                <div className="bottompane">
                    {messageRecipient != null && messageRecipient != undefined
                        ? <ChatHeader buddy={currentBuddy} buddyColor={messageRecipientColor} handleBuddyInfoButtonClick={handleBuddyInfoButtonClick}></ChatHeader>
                        : <div></div>
                    }

                    {messageRecipient != null && messageRecipient != undefined
                        ? <Chat data={messageRecipient} currentUserEmail={currentUser.email} handleCurrentMessage={handleCurrentMessage} />
                        : <div></div>
                    }

                </div>
                {buddyInfoClicked != false
                    ? <BuddyInfoDrawer buddy={currentBuddy} buddyColor={messageRecipientColor} removeBuddy={removeBuddy}></BuddyInfoDrawer>
                    : <div></div>
                }
            </div>
        </div>

    )
}

