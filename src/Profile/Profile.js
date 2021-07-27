import Amplify, { API, Auth } from 'aws-amplify'
import awsExports from "../aws-exports";
import React from 'react';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Box from '@material-ui/core/Box'; import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import ComboBox from './ComboBox';
import CheckBox from './CheckBox'
import Grid from '@material-ui/core/Grid';
Amplify.configure(awsExports);

class Profile extends React.Component {
    constructor() {
        super();
        this.firstRender = false;
        this.state = {
            id: '',
            firstName: '',
            email: '',
            lastName: '',
            aboutMe: '',
            degree: '',
            units: null,
            studyMode: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValueFromComboBox = this.handleValueFromComboBox.bind(this);
        this.handleValueFromCheckBox = this.handleValueFromCheckBox.bind(this);
    }

    handleChange({ target: { id, value } }) {
        this.setState({
            ...this.setState, [id]: value
        })
    }

    handleValueFromComboBox(item) {
        const studentUnits = []
        for (let i = 0; i < item.length; i++) {
            studentUnits.push(item[i].unit)
        }
        console.log(studentUnits)
        this.setState({
            ...this.setState, units: studentUnits
        }
        )
    }

    handleValueFromCheckBox(event, isChecked) {
        if (this.state.studyMode == null) {
            this.state.studyMode = []
        }
        if (isChecked) {
            this.state.studyMode.push(event.target.value)
        }
        else {
            if (this.state.studyMode.includes(event.target.value)) {
                const index = this.state.studyMode.indexOf(event.target.value);
                if (index > -1) {
                    this.state.studyMode.splice(index, 1);
                }
            }
        }

        console.log(this.state.studyMode)
    }

    handleSubmit() {
        console.log(this.state)
        try {
            if ((new Set(this.state.units)).size !== this.state.units.length) {
                alert("too many units chosen")
            } else {
                API.graphql({ query: mutations.updateStudent, variables: { input: this.state } });
                alert("SUBMIT")
            }
        } catch (e) { console.log(e) }
    }

    componentDidMount() {
        Auth.currentAuthenticatedUser().then((user) => {
            this.setState({ email: user.attributes.email })

            API.graphql({ query: queries.studentByEmail, variables: { email: user.attributes.email } }).then((data) => {
                // console.log(data)
                if (data.data.studentByEmail.items.length == 0) {
                    this.firstRender = true
                    API.graphql({ query: mutations.createStudent, variables: { input: { email: user.attributes.email } } })
                        .then((newStudentData) => {
                            console.log(newStudentData.data.createStudent.id)
                            this.setState({
                                ...this.setState, id: newStudentData.data.createStudent.id,
                            })
                        });
                }
                else {
                    if (data.data.studentByEmail.items[0].firstName == undefined && data.data.studentByEmail.items[0].lastName == undefined && data.data.studentByEmail.items[0].degree == undefined &&
                        data.data.studentByEmail.items[0].units == undefined) {
                        this.firstRender = true
                    }

                    if (data.data.studentByEmail.items[0].firstName != null) {
                        this.setState({
                            ...this.setState, firstName: data.data.studentByEmail.items[0].firstName,
                        })
                    }

                    if (data.data.studentByEmail.items[0].aboutMe != null) {
                        this.setState({
                            ...this.setState, aboutMe: data.data.studentByEmail.items[0].aboutMe,
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
                    if (data.data.studentByEmail.items[0].units != null) {
                        this.setState({
                            ...this.setState, units: data.data.studentByEmail.items[0].units,
                        })
                    }

                    if (data.data.studentByEmail.items[0].studyMode != null) {
                        this.setState({
                            ...this.setState, studyMode: data.data.studentByEmail.items[0].studyMode,
                        })
                    }
                }
            });
        })
    }



    render(props) {
        const monashUnits = [
            { unit: "FIT2012: Introduction to python" },
            { unit: "FIT4124: Introduction to Java" },
            { unit: "FIT5232: Introduction to C" },
            { unit: "FIT6543: Introduction to AWS" },
            { unit: "FIT4123: Introduction to React" },
        ]

        return (
            <Container component="main" >
                <br></br>
                <br></br>
                <br></br>
                <form>
                    <Grid container spacing={3} alignItems="center" justifyContent="center"  >
                        <Grid item xs={4} >
                            Name or Nickname:
                        </Grid>
                        <Grid item xs={5}  >
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                value={this.state.firstName}
                                variant="filled"
                                onChange={this.handleChange}
                                placeholder="Enter Name or Nickname"
                                fullWidth
                                id="firstName"
                                // label="Name or Nickname"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={4} >
                            Current Degree:
                        </Grid>
                        <Grid item xs={5}  >
                            <TextField
                                variant="filled"
                                fullWidth
                                id="degree"
                                value={this.state.degree}
                                placeholder="Enter Degree"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                // label="Degree"
                                onChange={this.handleChange}
                                name="degree"
                            />
                        </Grid>
                        <Grid item xs={4} >
                            About Me:
                        </Grid>
                        <Grid item xs={5}  >
                            <TextareaAutosize
                                variant="outlined"
                                value={this.state.aboutMe}
                                placeholder="Let other students know a bit about yourself. You could include hobbies, interests, things you like doing etc."
                                maxRows={5}
                                style={{ width: "100%" }}
                                minRows={5}
                                label="Bio"
                                onChange={this.handleChange}
                                id="aboutMe"
                                name="aboutMe"
                            />
                        </Grid>
                        <Grid item xs={4} >
                            Study Mode:
                        </Grid>
                        <Grid item xs={5}  >
                            <div>
                                {(() => {
                                    if (this.state.studyMode != null) {
                                        return <CheckBox data={this.state.studyMode}
                                            onChildClick={this.handleValueFromCheckBox} />
                                    }
                                    else if (this.firstRender) {

                                        return <CheckBox data={[]}
                                            onChildClick={this.handleValueFromCheckBox} />
                                    }

                                })()}
                            </div>
                        </Grid>
                        <Grid item xs={4} >
                            Select Units:
                        </Grid>
                        <Grid item xs={5}  >
                            <div>
                                {(() => {
                                    if (this.state.units != null) {
                                        return <ComboBox
                                            data={this.state.units} onChildClick={this.handleValueFromComboBox}
                                        />;
                                    }
                                    else if (this.firstRender) {
                                        return <ComboBox
                                            data={[]} onChildClick={this.handleValueFromComboBox}
                                        />;
                                    }

                                })()}
                            </div>
                        </Grid>
                        <Grid item xs={8}></Grid>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <Grid item xs={3}>
                        <Button
                            onClick={this.handleSubmit}
                            variant="contained"
                            color="primary"
                        >
                            Update Profile
                        </Button>
                        </Grid>
                    </Grid>
                </form>
               

            </Container >
        )
    }
}

export default Profile



