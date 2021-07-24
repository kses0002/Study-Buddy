import Amplify, { API, Auth } from 'aws-amplify'
import React from 'react';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Button from '@material-ui/core/Button';
import Chat from './Chat'



class ViewBuddies extends React.Component {
    constructor() {
        super();
        this.state = {
            potentialBuddies: [],
            currentUser: [],
            myBuddies: [],
            a: []
        }
        this.handleAcceptBuddy = this.handleAcceptBuddy.bind(this);

    }

    componentWillMount() {
        Auth.currentAuthenticatedUser().then((user) => {

            API.graphql({ query: queries.studentByEmail, variables: { email: user.attributes.email } })
                .then((currentUserData) => {
                    const currentStudent = currentUserData.data.studentByEmail.items[0]
                    this.setState({ ...this.state, currentUser: currentStudent })
                    this.setState({ ...this.state, potentialBuddies: currentStudent.notifiedUsers })
                    this.setState({ ...this.state, myBuddies: currentStudent.buddies })

                })
        })
    }

    handleAcceptBuddy(acceptedBuddyEmail) {

        delete this.state.currentUser.createdAt
        delete this.state.currentUser.updatedAt


        API.graphql({ query: queries.studentByEmail, variables: { email: acceptedBuddyEmail } })
            .then((studentData) => {

                const acceptedBuddy = studentData.data.studentByEmail.items[0]

                console.log(this.state)
                console.log(acceptedBuddy)

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

                console.log(this.state)
                console.log(acceptedBuddy)

                // this.state.currentUser.buddies=[]
                API.graphql({ query: mutations.updateStudent, variables: { input: acceptedBuddy } });
                API.graphql({ query: mutations.updateStudent, variables: { input: this.state.currentUser } });
            })
    }

    render(props) {


        return (
            <div>
                <h1>Requests</h1>
                <div>
                    {this.state.potentialBuddies.map(buddies => (
                        <div>
                            <p>{buddies}</p>
                            <Button size="small" onClick={() => this.handleAcceptBuddy(buddies)}>Accept</Button>
                        </div>

                    ))}
                </div>
                <h1>Friends</h1>
                <div>

                    {/* {this.state.myBuddies.map(buddies => ( */}
                    <div>
                        <p>{this.state.currentUser.buddies}</p>
                    </div>

                    {/* ))} */}
                </div>
                <div>
                    <Chat></Chat>
                </div>
            </div>

        )
    }
}

export default ViewBuddies



