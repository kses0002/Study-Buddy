import React from 'react';
import PropagateLoader from "react-spinners/PropagateLoader";
import { css } from "@emotion/react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default function Loader() {

    const color = "#2ccce4"
    const override = css`
  display: block;
  margin: 0 auto;
  border-color: red`;

    return (
        <div>
            <Grid container justifyContent="center">
                <PropagateLoader color={color} loading={true} css={override} size={15} />
            </Grid>
            <Grid container justifyContent="center">
                <Typography gutterbottom="true" variant="h5" style={{marginTop:"2rem", color: "#2ccce4"}}>Loading</Typography>
        </Grid>
        </div >
    )
}