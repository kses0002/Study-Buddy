import React, { useEffect, useState, useRef } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';


function ChatHeader({ buddyName, buddyColor }) {

    return (
        <Card className="chat-header" elevation={0} disabled={true}>
            <CardHeader
                className="chat-header-content"
                title={<Typography variant="h6" style={{ color: "black" }}>{buddyName}</Typography>}
                avatar={<Avatar aria-label="recipe" style={{
                    color: 'white',
                    borderRadius: "100%",
                    border: "solid",
                    borderWidth: "0.0px", borderColor: "black",
                    backgroundColor: buddyColor
                }}>
                    {buddyName[0]}
                </Avatar>}
            />
        </Card>

    );
};

export default ChatHeader;

