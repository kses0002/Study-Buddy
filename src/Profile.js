import Amplify, { API, graphqlOperation, Auth } from 'aws-amplify'
import awsExports from "./aws-exports";
import React, { useState, useEffect } from 'react';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';


import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { spacing } from '@material-ui/system';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Box from '@material-ui/core/Box'; import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Container from '@material-ui/core/Container';
import { findRenderedDOMComponentWithClass } from 'react-dom/cjs/react-dom-test-utils.production.min';
import ComboBox from './ComboBox';
Amplify.configure(awsExports);

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            id: '',
            firstName: '',
            email: '',
            lastName: '',
            degree: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange({ target: { id, value } }) {
        this.setState({
            ...this.setState, [id]: value
        })
    }

    handleSubmit() {
        console.log(this.state)
        API.graphql({ query: mutations.updateStudent, variables: { input: this.state } });
        alert("SUBMIT")
    }

    componentDidMount() {
        Auth.currentAuthenticatedUser().then((user) => {
            this.setState({ email: user.attributes.email })

            API.graphql({ query: queries.studentByEmail, variables: { email: user.attributes.email } }).then((data) => {
                // console.log(data)
                if (data.data.studentByEmail.items.length == 0) {

                    API.graphql({ query: mutations.createStudent, variables: { input: { email: user.attributes.email } } })
                        .then((newStudentData) => {
                            console.log(newStudentData.data.createStudent.id)
                            this.setState({
                                ...this.setState, id: newStudentData.data.createStudent.id,
                            })
                        });

                    // console.log(user.attributes.email )

                    // API.graphql({ query: queries.studentByEmail, variables: { email: user.attributes.email } }).then((newStudent) => {
                    //     console.log(newStudent)
                    // })

                }
                else {
                    // console.log(data.data.studentByEmail.items)
                    if (data.data.studentByEmail.items[0].firstName != null) {
                        this.setState({
                            ...this.setState, firstName: data.data.studentByEmail.items[0].firstName,

                        })
                    }
                    if (data.data.studentByEmail.items[0].lastName != null) {
                        this.setState({
                            ...this.setState,
                            lastName: data.data.studentByEmail.items[0].lastName,

                        })
                    }

                    if (data.data.studentByEmail.items[0].degree != null) {
                        this.setState({
                            ...this.setState, degree: data.data.studentByEmail.items[0].degree
                        })
                    }
                    if (data.data.studentByEmail.items[0].id != null) {
                        this.setState({
                            ...this.setState, id: data.data.studentByEmail.items[0].id
                        })
                    }

                }

            });
        })
    }

    render(props) {
        return (
            <Container component="main" maxWidth="xs">
                {/* <CssBaseline /> */}

                <Typography component="h1" variant="h5" align="center">
                    Profile
                </Typography>
                <form >
                    <Box pb={3} width={500} pt={3}>

                        <TextField
                            autoComplete="fname"
                            name="firstName"
                            value={this.state.firstName}
                            // variant="outlined"
                            onChange={this.handleChange}
                            // placeholder="First Name"
                            fullWidth
                            id="firstName"
                            label="First Name"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            autoFocus
                        />
                    </Box>
                    <Box pb={3} width={500}>
                        <TextField
                            // variant="outlined"
                            fullWidth
                            id="lastName"
                            onChange={this.handleChange}
                            value={this.state.lastName}
                            // placeholder="Last Name"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            label="Last Name"
                            name="lastName"
                            autoComplete="lname"
                        />
                    </Box>
                    <Box pb={3} width={500}>
                        <TextField
                            // variant="outlined"
                            fullWidth
                            id="degree"
                            value={this.state.degree}
                            // placeholder="Degree"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            label="Degree"
                            onChange={this.handleChange}
                            name="degree"
                        />
                    </Box>
                    <Box pb={3} width={500}>
                        <TextareaAutosize
                            variant="outlined"
                            placeholder="Enter Bio"
                            maxRows={5}
                            style={{ width: "100%" }}
                            minRows={5}

                            label="Bio"
                            id="bio"
                            name="bio"
                        />
                    </Box>
                    <ComboBox/>
                    <Button
                        onClick={this.handleSubmit}
                        variant="contained"
                        color="primary"
                    >
                        Update Profile
                    </Button>
                    
                </form>
            </Container>
        )
    }
}

export default Profile

