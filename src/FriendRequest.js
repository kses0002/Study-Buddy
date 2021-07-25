import Amplify, { API, Auth } from 'aws-amplify'
import React from 'react';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import 'bootstrap/dist/css/bootstrap.min.css';
import CardHeader from '@material-ui/core/CardHeader';


class FriendRequest extends React.Component {
    constructor() {
        super();
        this.state = {
            potentialBuddies: [],
            currentUser: [],
        }
    }

    componentWillMount() {
        Auth.currentAuthenticatedUser().then((user) => {

            API.graphql({ query: queries.studentByEmail, variables: { email: user.attributes.email } })
                .then((currentUserData) => {
                    const currentStudent = currentUserData.data.studentByEmail.items[0]
                    this.setState({ ...this.state, currentUser: currentStudent })


                    for (let i = 0; i < currentStudent.notifiedUsers.length; i++) {
                        API.graphql({ query: queries.studentByEmail, variables: { email: currentStudent.notifiedUsers[i] } })
                            .then((notifiedUserData) => {
                                this.setState
                                    (state => {
                                        const potentialBuddies = [...state.potentialBuddies, notifiedUserData.data.studentByEmail.items[0]];
                                        return {
                                            potentialBuddies,
                                        }
                                    }
                                    )
                            })
                    }


                })
        })
    }

    handleAcceptBuddy(acceptedBuddyEmail) {

        delete this.state.currentUser.createdAt
        delete this.state.currentUser.updatedAt


        API.graphql({ query: queries.studentByEmail, variables: { email: acceptedBuddyEmail } })
            .then((studentData) => {

                const acceptedBuddy = studentData.data.studentByEmail.items[0]

                delete acceptedBuddy.createdAt
                delete acceptedBuddy.updatedAt



                if (!(this.state.currentUser.hasOwnProperty("buddies")) || this.state.currentUser.buddies == null ||
                    this.state.currentUser.buddies.length == 0) {
                    this.state.currentUser.buddies = [acceptedBuddy.email]
                    this.setState({ ...this.state, myBuddies: [acceptedBuddy.email] })

                }
                else if (!(this.state.currentUser.buddies.includes(acceptedBuddy.email))) {
                    this.state.currentUser.buddies.push(acceptedBuddy.email)
                    this.setState
                        (state => {
                            const myBuddies = [...state.myBuddies, acceptedBuddy.email];
                            return {
                                myBuddies,
                            }
                        }
                        )
                }

                const tempArray = [...this.state.potentialBuddies]
                const index = tempArray.indexOf(acceptedBuddy.email)
                if (index != -1) {
                    tempArray.splice(index, 1)
                    this.state.currentUser.notifiedUsers = tempArray
                    this.setState({ ...this.state, potentialBuddies: tempArray })
                }

                if (!(acceptedBuddy.hasOwnProperty("buddies")) || acceptedBuddy.buddies == null) {
                    acceptedBuddy.buddies = [this.state.currentUser.email]
                }
                else if (!(acceptedBuddy.buddies.includes(this.state.currentUser.email))) {
                    acceptedBuddy.buddies.push(this.state.currentUser.email)
                }

                // this.state.currentUser.buddies=[]
                API.graphql({ query: mutations.updateStudent, variables: { input: acceptedBuddy } });
                API.graphql({ query: mutations.updateStudent, variables: { input: this.state.currentUser } });
            })
    }

    render(props) {


        return (
            <div className="splitscreen">
                <div className="leftList">
                    <div className="toppane">
                        <h1>Requests</h1>
                        {this.state.potentialBuddies.map(buddies => (
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={12}   >
                                    <Card>
                                        <CardHeader
                                            title={buddies.firstName}
                                            subheader={buddies.degree}
                                        />
                                        <CardContent>
                                            Units: {buddies.units.map((item) =>
                                                <Typography gutterbottom="true" variant="body2">{item}</Typography>)}
                                            <br></br>
                                            Study Mode: {buddies.studyMode.map((item) =>
                                                <Typography gutterbottom="true" variant="body2">{item}</Typography>)}
                                        </CardContent>
                                        <CardActions>
                                            <Button  onClick={() => this.handleAcceptBuddy(buddies.email)}>Accept</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            </Grid>
                        ))}

                    </div>
                </div>
            </div>

        )
    }
}

export default FriendRequest


