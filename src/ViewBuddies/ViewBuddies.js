import Amplify, { API, Auth } from 'aws-amplify'
import React from 'react';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Button from '@material-ui/core/Button';
import Chat from './Chat'
import './ViewBuddies.css'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import 'bootstrap/dist/css/bootstrap.min.css';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Icon from '@material-ui/core/Icon';
import InfoIcon from '@material-ui/icons/Info';

class ViewBuddies extends React.Component {
    constructor() {
        super();
        this.state = {
            currentUser: [],
            myBuddies: [],
            anchorE1: null,
            expandedBuddy: "",
            messageRecipient: null
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCardClick = this.handleCardClick.bind(this);

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


    handleClick = (event, infoEmail) => {
        console.log(event.currentTarget)
        this.setState({ ...this.state, anchorE1: event.currentTarget, expandedBuddy: infoEmail });
        console.log(this.state)

    };

    handleClose = () => {
        this.setState({ ...this.state, anchorE1: null });
        this.setState({ ...this.state, expandedBuddy: null });
    };

    handleCardClick(reciepientEmail) {
        this.setState({ ...this.state, messageRecipient: reciepientEmail })
    }

    render(props) {

        return (
            <div className="splitscreen">
                <div className="leftList">
                    <div className="middlepane">
                        <h1>Friends</h1>
                        {this.state.myBuddies.map(buddies => (
                            <div>
                                <Grid container spacing={2} justifyContent="center" >
                                    <Grid item xs={12}   >
                                        <Card className="Card">
                                            <CardContent className="CardContent" onClick={() => this.handleCardClick(buddies.email)}>
                                                {buddies.firstName}
                                            </CardContent>
                                            <CardActions className="CardAction">
                                                <IconButton color="primary" onClick={(e) => this.handleClick(e, buddies.email)}>
                                                    <InfoIcon></InfoIcon>
                                                </IconButton>
                                                <Popover
                                                    getContentAnchorEl={null}
                                                    open={this.state.expandedBuddy == buddies.email}
                                                    anchorEl={this.state.anchorE1}
                                                    onClose={this.handleClose}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'center',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'center',
                                                    }}
                                                >
                                                    <div>
                                                        Units: {buddies.units.map((item) =>
                                                            <Typography gutterbottom="true" variant="body2" >{item}</Typography>)}
                                                        <br></br>
                                                        Study Mode: {buddies.studyMode.map((item) =>
                                                            <Typography gutterbottom="true" variant="body2" >{item}</Typography>)}
                                                        <br></br>
                                                        <Typography paragraph>
                                                            About me: {buddies.aboutMe}
                                                        </Typography>
                                                    </div>
                                                </Popover>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="rightChat">
                    <div className="bottompane">
                        {this.state.messageRecipient != null && this.state.messageRecipient != undefined
                            ? <Chat data={this.state.messageRecipient} currentUserEmail={this.state.currentUser.email} />
                            : <div></div>
                        }
                    </div>
                </div>
            </div>

        )
    }
}

export default ViewBuddies