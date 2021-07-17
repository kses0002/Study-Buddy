import Amplify, { API, Auth } from 'aws-amplify'
import awsExports from "./aws-exports";
import React, { useState } from 'react';
import * as queries from './graphql/queries';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardList from './CardList.js'

// export default function ViewStudents() {
//     const similarStudents = {}
//     const studentData = []

//     async function getStudentData() {
//         const user = await Auth.currentAuthenticatedUser()
//         const currentUserData = await API.graphql({
//             query: queries.studentByEmail,
//             variables: { email: user.attributes.email }
//         })

//         const currentStudent = currentUserData.data.studentByEmail.items[0]

//         let allStudents = await API.graphql({ query: queries.listStudents })
//         allStudents = allStudents.data.listStudents.items



//         for (let i = 0; i < allStudents.length; i++) {
//             for (let j = 0; j < currentStudent.units.length; j++) {
//                 if (allStudents[i].units != null && allStudents[i].email != currentStudent.email
//                     && allStudents[i].units.includes(currentStudent.units[j])) {
//                     if (allStudents[i].email in similarStudents) {
//                         similarStudents[allStudents[i].email].units.push(currentStudent.units[j])
//                     }
//                     else {
//                         const newObject = ({ ...allStudents[i], units: [currentStudent.units[j]] })

//                         similarStudents[allStudents[i].email] = newObject
//                     }
//                 }



//             }
//         }


//         for (var key in similarStudents) {
//             if (similarStudents.hasOwnProperty(key)) {
//                 // console.log(key);
//                 studentData.push(similarStudents[key])
//             }
//         }

//         console.log(studentData)
//     }

//     getStudentData()

//     if (studentData.length != 0) {
//         return (
//             <div>
//                 {/* {getStudentData()} */}
//                 <h1>{studentData}</h1></div>
//         )
//     }
//     else{
//         return(<div></div>)
//     }

// }



export default class ViewStudents extends React.Component {

    constructor() {
        super();
        this.similarStudents = {}
        this.state = {
            list: []
        }
    }


    componentWillMount() {
        Auth.currentAuthenticatedUser().then((user) => {

            API.graphql({ query: queries.studentByEmail, variables: { email: user.attributes.email } })
                .then((currentUserData) => {
                    const currentStudent = currentUserData.data.studentByEmail.items[0]
                    // console.log(currentStudent)

                    API.graphql({ query: queries.listStudents }).then((studentData) => {
                        const allStudents = studentData.data.listStudents.items
                        // console.log(allStudents)

                        for (let i = 0; i < allStudents.length; i++) {
                            for (let j = 0; j < currentStudent.units.length; j++) {
                                if (allStudents[i].units != null && allStudents[i].email != currentStudent.email
                                    && allStudents[i].units.includes(currentStudent.units[j])) {
                                    if (allStudents[i].email in this.similarStudents) {
                                        this.similarStudents[allStudents[i].email].units.push(currentStudent.units[j])
                                    }
                                    else {
                                        const newObject = ({ ...allStudents[i], units: [currentStudent.units[j]] })

                                        this.similarStudents[allStudents[i].email] = newObject
                                    }

                                }
                            }
                        }
                        console.log(this.similarStudents)

                        for (var key in this.similarStudents) {
                            if (this.similarStudents.hasOwnProperty(key)) {
                                // console.log(key);
                                // this.state.push(this.similarStudents[key])

                                this.setState(state => {
                                    console.log(state)
                                    const list = [...state.list, this.similarStudents[key]];

                                    return {
                                        list
                                    }


                                })
                            }
                        }





                        console.log(this.state.list)


                    });
                })
        })
    }

    render(props) {
        const data = [
            {
                name: "Keshav",
                Degree: "Eng",
                Bio: "I am indian",
                StudyMode: "Virtual",
                units: "FIT#$@, FIT$@@"
            },

            {
                name: "Keshav",
                Degree: "Eng",
                Bio: "I am indian",
                StudyMode: "Virtual",
                units: "FIT#$@, FIT$@@"
            },

            {
                name: "Keshav",
                Degree: "Eng",
                Bio: "I am indian",
                StudyMode: "Virtual",
                units: "FIT#$@, FIT$@@"
            },
        ]

        // return (
        //     <div>
        //         <CardList data={this.similarStudents} />
        //     </div>
        // );

        // const studentData = []
        // console.log(this.similarStudents)
        // for (var key in this.similarStudents) {
        //     if (this.props.data.hasOwnProperty(key)) {
        //         // console.log(key);
        //         studentData.push(this.similarStudents[key])
        //     }
        // }

        //         return (
        //     <div>
        //         <CardList data={this.s} />
        //     </div>
        // );


        return (

            <div>
                {/* <div>
                  {console.log(this.state)}
                 <CardList data={this.state} />
            </div> */}
                {/* <Card>

                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            {this.state.list.map((data)=>data.email)}
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {this.state.units}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card> */}
                {/* <Card.Group> */}
                    {this.state.list.map((card) => (
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    {card.firstName}
                                    <br></br>
                                    {card.degree}
                                    <br></br>
                                    {card.email}
                                    <br></br>
                                    {card.units}
                                    <br></br>
                                    {card.studyMode}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Learn More</Button>
                            </CardActions>
                        </Card>

                    ))}
                {/* </Card.Group> */}
            </div>

        )
    }


}