import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel'

export default function Checkboxes({ data, onChildClick }) {
     if (data!=null ) {
        //  console.log(data.includes("On-Campus"))
        return (
            <div>
                <FormControlLabel
                    control={
                        <Checkbox
                            // defaultChecked={false}
                            defaultChecked={data.includes("On-Campus")}
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                            value="On-Campus"
                            onChange={(event, value) => { onChildClick(event, value) }}
                        />
                    }
                    label="On-Campus"

                />
                <FormControlLabel
                    control={
                        <Checkbox
                        defaultChecked={data.includes("Off-Campus")}
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                            value="Off-Campus"
                            onChange={(event, value) => { onChildClick(event, value) }}
                            label="Off-Campus"
                        />
                    }
                    label="Off-Campus"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                        defaultChecked={data.includes("Virtual")}
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                            value="Virtual"
                            onChange={(event, value) => { onChildClick(event, value) }}
                            label="Virtual"
                        />
                    }
                    label="Virtual"
                />
            </div>
        );
    }
    else{
        return(<div></div>)
    }
}
