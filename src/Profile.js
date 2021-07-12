
import Amplify, { API, graphqlOperation, Auth } from 'aws-amplify'
import awsExports from "./aws-exports";
import React, { useState, useEffect } from 'react';




import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';


import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { spacing } from '@material-ui/system';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Box from '@material-ui/core/Box';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { findRenderedDOMComponentWithClass } from 'react-dom/cjs/react-dom-test-utils.production.min';
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
    }

    componentDidMount() {
        Auth.currentAuthenticatedUser().then((user) => {
            this.setState({ email: user.attributes.email })

            API.graphql({ query: queries.studentByEmail, variables: { email: user.attributes.email } }).then((data) => {
                // console.log(data)
                if (data.data.studentByEmail.items.length == 0) {
                
                    API.graphql({ query: mutations.createStudent, variables: { input: {email:user.attributes.email}} });
                     console.log("New student created")

                }
                this.setState({
                    ...this.setState, firstName: user.attributes.firstName,
                    lastName: user.attributes.lastName,
                    degree: user.attributes.degree
                })
                console.log(this.state)
            });

        })


    }

    render(props) {


        return (
            // <div>
            //  <h1>{this.state.email}</h1>

            // <form>
            //     <label>
            //         Email:
            //         <input type="text" value={this.state.email} name="name" />
            //     </label>
            //      <label> 
            //         Name:
            //         <input type="text" value={this.state.firstName} name="name" />
            //     </label> 
            //     <input value={this.state.email} type="submit" value="Submit" /> 
            // </form>
            // </div>



            <Container component="main" maxWidth="xs">
                {/* <CssBaseline /> */}

                <Typography component="h1" variant="h5" align="center">
                    Profile
                </Typography>
                <form>
                    <Box pb={3} width={500} pt={3}>

                        <TextField
                            autoComplete="fname"
                            name="firstName"

                            variant="outlined"
                            fullWidth
                            id="firstName"
                            label="First Name"
                            autoFocus
                        />

                    </Box>

                    <Box pb={3} width={500}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="lname"
                        />

                    </Box>
                    <Box pb={3}>

                        <TextField
                            variant="outlined"
                            fullWidth
                            id="degree"
                            label="Degree"
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
                    <Button
                        type="submit"

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

