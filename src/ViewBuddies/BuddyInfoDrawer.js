import React, { useEffect, useState, useRef } from 'react';
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


function BuddyInfoDrawer({ buddy, buddyColor }) {

    return (
        <div>
        {/* <CardActions>
            <Button>x</Button>
        </CardActions>
        <Card>
        <CardHeader title={"User Info"}/>
        </Card> */}
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

                    <br></br>
                    <CardContent className="buddy-info-card-content">
                        <Grid container spacing={1} justifyContent="center" item xs={11}>
                            Units
                        </Grid>
                        <Grid item xs={11} >
                            {buddy.units.map((item) =>
                                <Typography gutterbottom="true" variant="body1">{item}</Typography>)}
                        </Grid>
                        <br></br>
                        <br></br>
                        <Grid container spacing={1} justifyContent="center" item xs={11}>
                            Study Mode
                        </Grid>
                        <Grid item xs={11} >
                            {buddy.studyMode.map((item) =>
                                <Typography gutterbottom="true" variant="body1">{item}</Typography>)}
                        </Grid>
                        <br></br>
                        <br></br>
                        <Grid container spacing={1} justifyContent="center" item xs={11}>
                            About
                        </Grid>
                        <Grid item xs={11} >
                            <Typography gutterbottom="true" variant="body1">{buddy.aboutMe}</Typography>
                        </Grid>
                    </CardContent>
                </Grid>
            </Grid>
        </Card>
        </div>

    );
};

export default BuddyInfoDrawer;

