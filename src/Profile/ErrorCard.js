import React, { useEffect, useRef, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import './ErrorCard.css'


export default function ErrorCard(errorField) {
    console.log(errorField.errorField)

    return (
        <div>
            {errorField != null ?
                <Paper elevation={0} className="error-paper" style={{ 
                    color: "red",
                    backgroundColor: "whitesmoke"
                    
                    }} >
                    <Typography style={{color: "red",  fontWeight: "990"}}>Error: {errorField.errorField} cannot be empty!</Typography>
                </Paper> :
                <div></div>
            }
        </div>

    )
}

