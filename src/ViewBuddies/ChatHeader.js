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
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';



function ChatHeader({ buddy, buddyColor, handleBuddyInfoButtonClick }) {

    const [BuddyInfoButton, setBuddyInfoButton] = useState(false)
    // console.log(handleBuddyInfoButtonClick)

    const showBuddyInfo = (buddyInfoButtonValue) => {
        setBuddyInfoButton(buddyInfoButtonValue)
        // console.log(handleBuddyInfoButtonClick)
        handleBuddyInfoButtonClick(buddyInfoButtonValue)
    }


    return (
        <div>
            <Card className="chat-header" elevation={1} disabled={true}>
                <Grid container spacing={0} justifyContent="center" >
                    <Grid item xs={11}>
                        <CardHeader
                            className="chat-header-content"
                            title={<Typography variant="h6" style={{ color: "black" }}>{buddy.firstName}</Typography>}
                            avatar={<Avatar aria-label="recipe" style={{
                                color: 'white',
                                borderRadius: "100%",
                                border: "solid",
                                borderWidth: "0.0px", borderColor: "black",
                                backgroundColor: buddyColor
                            }}>
                                {buddy.firstName[0]}
                            </Avatar>}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <CardActions className="chat-action-content">
                            <IconButton color="primary" onClick={() => showBuddyInfo(!BuddyInfoButton)}>
                                <InfoIcon></InfoIcon>
                            </IconButton>
                            {/* <Button size="small" onClick={() => showBuddyInfo(!BuddyInfoButton)}>
                                <Typography variant="h4" style={{ color: "black" }}>...</Typography>
                            </Button> */}
                        </CardActions>
                    </Grid>
                </Grid>
            </Card>

        </div>

    );
};

export default ChatHeader;

