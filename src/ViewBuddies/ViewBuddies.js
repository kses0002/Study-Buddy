import Amplify, { API, Auth } from 'aws-amplify'
import React from 'react';
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



class ViewBuddies extends React.Component {
    constructor() {
        super();
        this.state = {
            currentUser: [],
            myBuddies: [],
            messageRecipient: null,
            cardActive: "",
            messageRecipientColor: "",
            buddyInfoClicked:false
        }

        
        this.handleCardClick = this.handleCardClick.bind(this);
        this.handleBuddyInfoButtonClick = this.handleBuddyInfoButtonClick.bind(this);

        this.cardColor = ["#00ABE1", "#E5B9A8", "#9CF6FB", "#1FC58E", "#F8DD2E", "#FAB162", "#FF6495"]
    }

    componentWillMount() {

        Auth.currentAuthenticatedUser().then((user) => {

            API.graphql({ query: queries.studentByEmail, variables: { email: user.attributes.email } })
                .then((currentUserData) => {
                    const currentStudent = currentUserData.data.studentByEmail.items[0]
                    this.setState({ ...this.state, currentUser: currentStudent })

                    if (currentStudent.buddies != null) {
                        for (let i = 0; i < currentStudent.buddies.length; i++) {
                            API.graphql({ query: queries.studentByEmail, variables: { email: currentStudent.buddies[i] } })
                                .then((buddyData) => {
                                    this.setState
                                        (state => {
                                            const myBuddies = [...state.myBuddies, buddyData.data.studentByEmail.items[0]];
                                            return {
                                                myBuddies,
                                            }
                                        }
                                        )
                                })
                        }
                    }

                })
        })
    }


    handleCardClick(buddy, cardId) {
        this.setState({
            ...this.state, messageRecipient: buddy.email,
            cardActive: cardId,
            currentBuddy :buddy, 
            messageRecipientColor: this.cardColor[cardId % this.cardColor.length]
        })
    }

    handleBuddyInfoButtonClick(buttonClick){
        // console.log(buttonClick)
        this.setState({...this.state, buddyInfoClicked:buttonClick})
    }

    render(props) {

        return (
            <div className="splitscreen">
                <div className="leftList">
                    <div className="middlepane">
                        <Scrollbars>
                            {this.state.myBuddies.map((buddies, index) => (
                                <div>
                                    <Grid container spacing={0} justifyContent="center" >
                                        <Grid item xs={12}   >
                                            <Card className={this.state.cardActive === index ? "cardActive" : "BuddyCard"}>
                                                <CardHeader
                                                    avatar={<Avatar aria-label="recipe" style={{
                                                        color: 'white',
                                                        borderRadius: "100%",
                                                        border: "solid",
                                                        borderWidth: "0.0px", borderColor: "black",
                                                        backgroundColor: this.cardColor[index % this.cardColor.length]
                                                    }}>
                                                        {buddies.firstName[0]}
                                                    </Avatar>}
                                                />
                                                <CardContent className="CardContent" onClick={() => this.handleCardClick(buddies, index)}>
                                                    {buddies.firstName}
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
                        {this.state.messageRecipient != null && this.state.messageRecipient != undefined
                            ? <ChatHeader buddy={this.state.currentBuddy} buddyColor={this.state.messageRecipientColor} handleBuddyInfoButtonClick={this.handleBuddyInfoButtonClick}></ChatHeader>
                            : <div></div>
                        }

                        {this.state.messageRecipient != null && this.state.messageRecipient != undefined
                            ? <Chat data={this.state.messageRecipient} currentUserEmail={this.state.currentUser.email} />
                            : <div></div>
                        }

                    </div>
                    {this.state.buddyInfoClicked!= false 
                    ? <BuddyInfoDrawer buddy={this.state.currentBuddy} buddyColor={this.state.messageRecipientColor} ></BuddyInfoDrawer>
                    : <div></div>
                }
                    </div>
            </div>

        )
    }
}

export default ViewBuddies