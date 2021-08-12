import React, {useState, useEffect} from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';



const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}));



export default function ComboBox({data, onChildClick}) {
  const classes = useStyles();
  const unitsSelected=[]


  if(data!=null){
    for(let i=0;i<data.length;i++){
      unitsSelected.push({
        unit: data[i]
      })
    }
  }
  

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="tags-standard"
        options={monashUnits}
        getOptionLabel={(option) => option.unit}
        // {...console.log(unitsSelected)}
        defaultValue={unitsSelected}
        onChange={(event, value) => {onChildClick(value)}}
        renderInput={(params) => ( 
          <TextField
            {...params}
            variant="standard"
            label="Units"
            placeholder="Add Units"
          />
        )}
      />
    </div>
  );
}

const monashUnits = [
  { unit: "FIT2012: Introduction to python" },
  { unit: "FIT4124: Introduction to Java" },
  { unit: "FIT5232: Introduction to C" },
  { unit: "FIT6543: Introduction to AWS" },
  { unit: "FIT4123: Introduction to React" },
]

const monashUnitsA = [
  { unit: "FIT6543: Introduction to AWS" },
  { unit: "FIT4123: Introduction to React" }
]