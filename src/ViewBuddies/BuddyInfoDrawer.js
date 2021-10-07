import React, { useEffect, useState, useRef } from 'react';
import { Auth, API } from 'aws-amplify'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import './ChatHeader.css'
import './BuddyInfoDrawer.css'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';


function BuddyInfoDrawer({ buddy, buddyColor, removeBuddy }) {

    const [userInfo, setUserInfo] = useState(null)

    useEffect(() => {
        Auth.currentUserInfo().then((userInfo) => {
            setUserInfo(userInfo)
        })
    }, [])

    function handleDeleteBuddy(event) {
        const buddyToDelete = buddy.email
        const currentUserEmail = userInfo.attributes.email

        API.graphql({ query: queries.studentByEmail, variables: { email: currentUserEmail } })
            .then((currentUserData) => {
                const currentStudent = currentUserData.data.studentByEmail.items[0]

                console.log(currentStudent)
                const buddyIndex = currentStudent.buddies.indexOf(buddyToDelete);
                const notifiedUserIndex = currentStudent.notifiedUsers.indexOf(buddyToDelete)
                if (buddyIndex > -1) {
                    currentStudent.buddies.splice(buddyIndex, 1);
                }
                if (notifiedUserIndex > -1) {
                    currentStudent.notifiedUsers.splice(notifiedUserIndex, 1);
                }
                console.log(currentStudent)

                removeBuddy(buddy)
                delete currentStudent.createdAt
                delete currentStudent.updatedAt
                API.graphql({ query: mutations.updateStudent, variables: { input: currentStudent } });
            })


    }
    return (
        <div>
            <Card elevation={1} disabled={true}>
                <Grid container spacing={0} justifyContent="center" alignItems="center" >
                    <Grid item xs={11} className="buddy-info-card">
                        <Grid container spacing={0} justifyContent="center" alignItems="center" >
                            <CardHeader
                                //     className="chat-header-content"
                                // title={<Typography variant="h6" style={{ color: "black" }}>User Info</Typography>}
                                avatar={<Avatar aria-label="recipe" sizes="large" style={{
                                    color: 'white',
                                    height: "6rem",
                                    width: "6rem",
                                    display: "flex",
                                    fontSize: "3rem",
                                    borderRadius: "100%",
                                    border: "solid",
                                    borderWidth: "0.0px", borderColor: "black",
                                    backgroundColor: buddyColor
                                }}>
                                    {buddy.firstName[0]}
                                </Avatar>}
                            />
                        </Grid>

                        <CardContent className="buddy-info-card-content">
                            <Grid container justifyContent="center">
                                <Grid container justifyContent="center">
                                    <Typography variant="h5" style={{
                                        marginBottom:"3rem"
                                    }}>{buddy.firstName}</Typography>
                                </Grid>
                            </Grid>
                            <Accordion className="buddy-info-accordian">
                                <AccordionSummary
                                    className="buddy-info-header"
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"

                                >
                                    <Typography >Units</Typography>
                                </AccordionSummary>
                                <AccordionDetails >
                                    <Typography>
                                        {buddy.units.map((item) =>
                                            <Typography gutterbottom="true" variant="body1">{item}</Typography>)}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion >
                            <Accordion className="buddy-info-accordian">
                                <AccordionSummary
                                    className="buddy-info-header"
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                >
                                    <Typography>Study Mode</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {buddy.studyMode.map((item) =>
                                            <Typography gutterbottom="true" variant="body1">{item}</Typography>)}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className="buddy-info-accordian">
                                <AccordionSummary
                                    className="buddy-info-header"
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3a-content"
                                    id="panel3a-header"
                                >
                                    <Typography>About Me</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {buddy.aboutMe}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Grid container spacing={0} justifyContent="center" alignItems="center" >
                                <Button onClick={handleDeleteBuddy} style={{ marginTop: "2rem", backgroundColor: "#b80000", color: "white" }}>Delete Buddy</Button>
                            </Grid>

                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </div>

    );
};

export default BuddyInfoDrawer;