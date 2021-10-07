import { API, Auth } from 'aws-amplify'
import awsExports from "../aws-exports";
import React, { useState, useReact, useEffect } from 'react';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Container from '@material-ui/core/Container';
import ComboBox from './ComboBox';
import CheckBox from './CheckBox'
import ErrorCard from './ErrorCard'
import Grid from '@material-ui/core/Grid';
import ProfileDialog from './ProfileDialog'



export default function Profile() {

    const [firstRender, setFirstRender] = useState(false)
    // let firstRender = false;
    const [hasSubmiited, setHasSubmiited] = useState(false)
    const [id, setId] = useState('')
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [aboutMe, setAboutMe] = useState('')
    const [degree, setDegree] = useState('')
    const [units, setUnits] = useState(null)
    const [studyMode, setStudyMode] = useState([])

    const [updateFirstName, setUpdateFirstName] = useState(false)
    const [updateUnits, setUpdateUnits] = useState(false)
    const [updateDegree, setUpdateDegree] = useState(false)
    const [updateStudyMode, setUpdateStudyMode] = useState(false)

    function handleChange({ target: { id, value } }) {
        if (id == "firstName") {
            setUpdateFirstName(false)
            setFirstName(value)
        }
        else if (id == "email") {
            setEmail(value)
        }
        else if (id == "aboutMe") {
            setAboutMe(value)
        }
        else if (id == "degree") {
            setUpdateDegree(false)
            setDegree(value)
        }
        else if (id == "units") {
            setUpdateUnits(false)
            setUnits(value)
        }
        else if (id == "studyMode") {
            setUpdateStudyMode(false)
            setStudyMode(value)
        }

    }

    function handleValueFromComboBox(item) {
        const studentUnits = []
        for (let i = 0; i < item.length; i++) {
            studentUnits.push(item[i].unit)
        }
        setUnits(studentUnits)
    }

    function handleValueFromCheckBox(event, isChecked) {
        if (studyMode == null) {
            setStudyMode([])
        }

        if (isChecked) {
            studyMode.push(event.target.value)
        }
        else {
            if (studyMode.includes(event.target.value)) {
                const index = studyMode.indexOf(event.target.value);
                if (index > -1) {
                    studyMode.splice(index, 1);
                }
            }
        }
    }

    function handleSubmit() {
        try {
            console.log(updateFirstName)
            console.log(updateDegree)
            // if ((new Set(units)).size !== units.length) {
            //     alert("too many units chosen")
            // }
            if (degree.length == 0 || degree == null) {
                setUpdateDegree(true)

            }
            if (firstName.length == 0 || firstName == null) {
                setUpdateFirstName(true)
            }

            if (units == null || units.length == 0) {
                setUpdateUnits(true)
            }
            else {
                setUpdateUnits(false)
            }

            if (studyMode.length == 0 || studyMode == null) {
                setUpdateStudyMode(true)
            }
            else {
                setUpdateStudyMode(false)
            }
            if (degree.length > 0 && firstName.length > 0 && units.length > 0 && studyMode.length > 0) {


                // for (let i = 250; i < 350; i++) {
                //     const temp = {
                //         firstName: "test" + i.toString(),
                //         email: "test" + i.toString() + "@gmaail.com",
                //         aboutMe: "test" + i.toString() + "about me",
                //         degree:"test"+i.toString() + "degree",
                //         units: ["FIT4123: Introduction to React"],
                //         studyMode: ["Virtual"]
                //     }
                //     API.graphql({ query: mutations.createStudent, variables: { input: temp } })

                // }

                const graphqlObject = {
                    id: id,
                    firstName: firstName,
                    email: email,
                    aboutMe: aboutMe,
                    degree: degree,
                    units: units,
                    studyMode: studyMode
                }
                API.graphql({ query: mutations.updateStudent, variables: { input: graphqlObject } });
                setHasSubmiited(true)
            }
        } catch (e) { console.log(e) }
    }

    useEffect(() => {

        Auth.currentAuthenticatedUser().then((user) => {
            setEmail(user.attributes.email)

            API.graphql({ query: queries.studentByEmail, variables: { email: user.attributes.email } }).then((data) => {
                if (data.data.studentByEmail.items.length == 0) {
                    // firstRender = true
                    setFirstRender(true)
                    API.graphql({ query: mutations.createStudent, variables: { input: { email: user.attributes.email } } })
                        .then((newStudentData) => {
                            setId(newStudentData.data.createStudent.id)
                        });
                }
                else {
                    if (data.data.studentByEmail.items[0].firstName == undefined && data.data.studentByEmail.items[0].lastName == undefined && data.data.studentByEmail.items[0].degree == undefined &&
                        data.data.studentByEmail.items[0].units == undefined) {
                        // firstRender = true
                        setFirstRender(true)
                    }

                    if (data.data.studentByEmail.items[0].firstName != null) {
                        setFirstName(data.data.studentByEmail.items[0].firstName)
                    }

                    if (data.data.studentByEmail.items[0].aboutMe != null) {
                        setAboutMe(data.data.studentByEmail.items[0].aboutMe)
                    }

                    if (data.data.studentByEmail.items[0].degree != null) {
                        setDegree(data.data.studentByEmail.items[0].degree)
                    }
                    if (data.data.studentByEmail.items[0].id != null) {
                        setId(data.data.studentByEmail.items[0].id)
                    }
                    if (data.data.studentByEmail.items[0].units != null) {
                        setUnits(data.data.studentByEmail.items[0].units)
                    }

                    if (data.data.studentByEmail.items[0].studyMode != null) {
                        setStudyMode(data.data.studentByEmail.items[0].studyMode)
                    }
                }
            });
        })
    }, [])


    function handleDialogClose() {
        setHasSubmiited(false)
    }

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
                            required={true}
                            autoComplete="fname"
                            name="firstName"
                            value={firstName}
                            variant="filled"
                            onChange={handleChange}
                            placeholder="Enter Name or Nickname"
                            fullWidth
                            id="firstName"
                            // label="Name or Nickname"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            autoFocus
                        />{updateFirstName ?
                            < ErrorCard errorField="Name"></ErrorCard>
                            : <div />
                        }
                    </Grid>
                    <Grid item xs={4} >
                        Current Degree:
                    </Grid>
                    <Grid item xs={5}  >
                        <TextField
                            variant="filled"
                            fullWidth
                            id="degree"
                            value={degree}
                            placeholder="Enter Degree"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            // label="Degree"
                            onChange={handleChange}
                            name="degree"
                        />{updateDegree ?
                            < ErrorCard errorField="Degree"></ErrorCard>
                            : <div />
                        }
                    </Grid>
                    <Grid item xs={4} >
                        About Me:
                    </Grid>
                    <Grid item xs={5}  >
                        <TextareaAutosize
                            variant="outlined"
                            value={aboutMe}
                            placeholder="Let other students know a bit about yourself. You could include hobbies, interests, things you like doing etc."
                            maxRows={5}
                            style={{ width: "100%" }}
                            minRows={5}
                            label="Bio"
                            onChange={handleChange}
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
                                if (studyMode != null && studyMode.length != 0) {
                                    return <CheckBox data={studyMode}
                                        onChildClick={handleValueFromCheckBox} />
                                }
                                else if (firstRender || updateStudyMode) {
                                    console.log(studyMode)

                                    return <CheckBox data={[]}
                                        onChildClick={handleValueFromCheckBox} />
                                }

                            })()}
                        </div>
                    </Grid>
                    {updateStudyMode ?
                        <Grid container justifyContent="flex-end">
                            {/* <Grid item xs={8}><div>sffds</div></Grid> */}
                            <Grid item xs={6}>
                                < ErrorCard errorField="Study Mode"></ErrorCard>
                            </Grid>
                        </Grid>
                        : <div />
                    }
                    <Grid item xs={4} >
                        Select Units:
                    </Grid>
                    <Grid item xs={5}  >
                        <div>
                            {(() => {
                                if (units != null) {
                                    return <ComboBox
                                        data={units} onChildClick={handleValueFromComboBox}
                                    />;
                                }
                                else if (firstRender) {
                                    return <ComboBox
                                        data={[]} onChildClick={handleValueFromComboBox}
                                    />;
                                }

                            })()}
                        </div>
                    </Grid>
                    {updateUnits ?
                        <Grid container justifyContent="flex-end">
                            <Grid item xs={6}>
                                < ErrorCard errorField="Units"></ErrorCard>
                            </Grid>
                        </Grid>
                        : <div />
                    }
                    <Grid item xs={8}></Grid>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Grid item xs={3}>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                        >
                            Update Profile
                        </Button>
                    </Grid>
                    {hasSubmiited
                        ? <ProfileDialog handleDialogClose={handleDialogClose}
                            dialogContent={"Profile Successfully Updated"}></ProfileDialog>
                        : <div></div>
                    }
                </Grid>
            </form>


        </Container >
    )
}


