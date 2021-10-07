import React, { useEffect, useState, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import './BuddySearch.css'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { withThemeCreator } from '@material-ui/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function BuddySearch({ currentUser, fetchData }) {

    const [units, setUnits] = useState([])
    const [studyMode, setStudyMode] = useState([])
    const [degree, setDegree] = useState('')

    function handleChangeDegree(event) {
        setDegree(event.target.value)
    }

    const handleChangeUnits = (event) => {
        const {
            target: { value },
        } = event;
        setUnits(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleChangeStudyMode = (event) => {
        const {
            target: { value },
        } = event;
        setStudyMode(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    function submitSearchTerms() {


        let filterArray = []

        if (units.length > 0) {
            for (let i = 0; i < units.length; i++) {
                if (studyMode.length == 0) {
                    filterArray.push({
                        units: { contains: units[i] },
                        degree: { contains: degree }
                    })
                }
                else {
                    for (let j = 0; j < studyMode.length; j++) {
                        filterArray.push({
                            units: { contains: units[i] },
                            studyMode: { contains: studyMode[j] },
                            degree: { contains: degree }
                        })

                    }
                }
            }
        }
        else if (studyMode.length > 0) {
            for (let j = 0; j < studyMode.length; j++) {
                filterArray.push({
                    studyMode: { contains: studyMode[j] },
                    degree: { contains: degree }
                })

            }
        }
        else {
            filterArray.push({
                degree: { contains: degree }
            })
        }

        let filter = { or: filterArray }


        fetchData(filter)
        // let filter = {
        //     or: [
        //         {
        //             degree: { contains: "mech" },
        //             units: { contains: "FIT4123: Introduction to React" }
        //         },
        //         {
        //             units: { contains: "FIT6543: Introduction to AWS" }
        //         },
        //         {
        //             units: { contains: "FIT2012: Introduction to python" }
        //         }
        //     ]
        // };
    }

    return (
        <Paper style={{
            height: "12rem",
            marginTop: "2rem",
            marginBottom: "7rem",
            // width: "70rem",
            backgroundColor: "#9da8b2"
            // backgroundColor: "#1273de"
        }}>
            <Grid container spacing={0} justifyContent="flex-start" alignItems="flex-end"  >
                <div style={{
                    marginLeft: "1rem",
                    marginTop: "1.5rem"
                }}> <Typography style={{ color: "white" }} variant="h5" >Search for a Buddy</Typography></div>
            </Grid>
            <Grid container spacing={0} justifyContent="flex-start" alignItems="center" direction="row" >
                <input
                    type="text"
                    id="SearchBarDegree"
                    placeholder="Enter Degree"
                    // value={this.state.searchTerm}
                    onChange={handleChangeDegree}
                    className="searchBar"
                />

                <Select
                    id="SearchBarStudyMode"
                    menuPlacement="bottom"
                    value={studyMode}
                    multiple
                    displayEmpty
                    className="searchBar"
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <em>Select Study Mode</em>;
                        }

                        return selected.join(', ');
                    }}
                    MenuProps={MenuProps}
                    onChange={handleChangeStudyMode}
                    style={{
                        background: "white",
                    }}

                >
                    <MenuItem disabled value="">
                        <em>Select Study Mode</em>
                    </MenuItem>
                    {currentUser.studyMode.map((studentStudyMode) => (
                        <MenuItem value={studentStudyMode}>
                            <Checkbox checked={studyMode.indexOf(studentStudyMode) > -1} />
                            <ListItemText primary={<Typography style={{ color: "black" }} variant="caption" > {studentStudyMode}</Typography>} />
                        </MenuItem>
                    ))}
                </Select>


                <Select
                    id="SearchBarUnitCodes"
                    menuPlacement="bottom"
                    value={units}
                    multiple
                    displayEmpty
                    className="searchBar"
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <em>Select Units</em>;
                        }

                        return selected.join(', ');
                    }}
                    MenuProps={MenuProps}
                    onChange={handleChangeUnits}
                    style={{
                        background: "white",
                    }}

                >
                    <MenuItem disabled value="">
                        <em>Select Units</em>
                    </MenuItem>
                    {currentUser.units.map((unit) => (
                        <MenuItem value={unit}>
                            <Checkbox checked={units.indexOf(unit) > -1} />
                            <ListItemText primary={<Typography style={{ color: "black" }} variant="caption" > {unit}</Typography>} />
                        </MenuItem>
                    ))}
                </Select>

                <Button variant="contained" style={{
                    backgroundColor: "#1273de",
                    color: 'white',
                    marginLeft: "66rem",
                    marginBottom: "4.5rem"
                }} className="searchButton" size="small" onClick={() => submitSearchTerms()}>SEARCH</Button>

            </Grid>
        </Paper >
        // </Grid>
    )
};






