import React, { useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
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

const monashUnits = [
  { unit: "FIT2012: Introduction to python" },
  { unit: "FIT4124: Introduction to Java" },
  { unit: "FIT5232: Introduction to C" },
  { unit: "FIT6543: Introduction to AWS" },
  { unit: "FIT4123: Introduction to React" },
]

export default function ComboBox({ data, onChildClick }) {

  const classes = useStyles();
  
  const [units, setUnits] = useState([])
  // const [monashUnits, setMonashUnits] = useState([])
  

useEffect(()=>{

},)
  

  useState(() => {
    if (data != null) {
      const unitsSelected = []
      for (let i = 0; i < data.length; i++) {
        unitsSelected.push({
          unit: data[i]
        })


        for (let j = 0; j < monashUnits.length; j++) {
          if (monashUnits[j].unit == data[i]) {
            monashUnits.splice(j, 1)
          }
        }
      }
      setUnits(unitsSelected)
    }
  }, [])

  function onChange(event, value) {
    console.log(monashUnits)
    if (value.length < units.length){
      
      const deletedUnit =  units.filter(x => !value.includes(x)) ;
      console.log(deletedUnit)
      monashUnits.push(deletedUnit[0])
    }
    console.log(units)
    console.log(value)
    console.log(monashUnits)
    onChildClick(value)
  }


  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="tags-standard"
        popupIcon={<AddIcon />}
        // blurOnSelect={["FIT5232: Introduction to C","FIT6543: Introduction to AWS" ]}
        options={monashUnits}

        getOptionLabel={(option) => option.unit}
        defaultValue={units}
        onChange={(event, value) => { onChange(event, value) }}
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


