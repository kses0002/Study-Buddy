import { API, Auth } from 'aws-amplify'
import React from 'react';
import * as queries from './graphql/queries';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import 'bootstrap/dist/css/bootstrap.min.css';
import CardHeader from '@material-ui/core/CardHeader';
import './ViewStudents.css';

export default class ViewStudents extends React.Component {
    constructor() {
        super();
        this.similarStudents = {}
        this.state = {
            list: [],
            searchTerm: "",
            searchlist: []
        }
        this.handleSearchQuery = this.handleSearchQuery.bind(this);
        this.updateState = this.updateState.bind(this);

    }

    componentWillMount() {
        Auth.currentAuthenticatedUser().then((user) => {

            API.graphql({ query: queries.studentByEmail, variables: { email: user.attributes.email } })
                .then((currentUserData) => {
                    const currentStudent = currentUserData.data.studentByEmail.items[0]

                    API.graphql({ query: queries.listStudents }).then((studentData) => {
                        const allStudents = studentData.data.listStudents.items

                        for (let i = 0; i < allStudents.length; i++) {
                            for (let j = 0; j < currentStudent.units.length; j++) {
                                if (allStudents[i].units != null && allStudents[i].email != currentStudent.email
                                    && allStudents[i].units.includes(currentStudent.units[j])) {
                                    if (allStudents[i].email in this.similarStudents) {
                                        this.similarStudents[allStudents[i].email].units.push(currentStudent.units[j])
                                    }
                                    else {
                                        const newObject = ({ ...allStudents[i], units: [currentStudent.units[j]] })

                                        this.similarStudents[allStudents[i].email] = newObject
                                    }

                                }
                            }
                        }

                        for (var key in this.similarStudents) {
                            if (this.similarStudents.hasOwnProperty(key)) {
                                this.setState(state => {
                                    const list = [...state.list, this.similarStudents[key]];
                                    return {
                                        list,
                                        //searchTerm
                                    }
                                })
                            }

                        }
                        this.setState({ ...this.state, searchlist: this.state.list })
                    });

                })
        })
    }

    updateState() {
        this.setState({ ...this.state, searchlist: [] })
        this.state.list.filter(student => student.degree.includes(this.state.searchTerm) ||
            student.firstName.includes(this.state.searchTerm) ||
            student.units.find(value => value.includes(this.state.searchTerm)) ||
            student.studyMode.find(value => value.includes(this.state.searchTerm))).
            map(filteredStudents => (
                console.log("FILTER"),
                console.log(filteredStudents),
                this.setState
                    (state => {
                        const searchlist = [...state.searchlist, filteredStudents];
                        return {
                            searchlist,
                        }
                    }
                    )))
    }

    handleSearchQuery(event) {
        this.setState(
            { ...this.state, searchTerm: event.target.value }, () => this.updateState())
    }

    render(props) {

        return (
            <div className="root">
                <div>
                    <input
                        type="text"
                        placeholder="Search"
                        value={this.state.searchTerm}
                        onChange={this.handleSearchQuery}
                    />
                </div>

                <br></br>
                <br></br>
                {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}> */}
                <Grid container spacing={4} justifyContent="center">
                    {this.state.searchlist.map(card => (
                        // <li>{card.email}</li>
                        // <Grid container spacing={5}>

                        <Grid item xs={12} sm={6} md={3} >
                            <Card className="card">
                                <CardHeader
                                    title={card.firstName}
                                    subheader={card.degree}
                                    avatar={
                                        <Avatar aria-label="recipe" >
                                            {card.firstName[0]}
                                        </Avatar>
                                    }
                                //   titleTypographyProps={{fontSize:"20px"}}
                                />
                                <CardContent>
                                    {/* <Typography display="inline" gutterbottom="true" variant="body2"> */}
                                    Units: {card.units.map((item) =>
                                        <Typography  gutterbottom="true" variant="body2">{item}</Typography>)}
                                    <br></br>
                                    Study Mode: {card.studyMode.map((item) =>
                                        <Typography gutterbottom="true" variant="body2">{item}</Typography>)}
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Add</Button>
                                    <Button size="small">Dismiss</Button>
                                </CardActions>
                                {/* <Collapse in={true} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <Typography paragraph>Method:</Typography>
                                        <Typography paragraph>
                                            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                                            minutes.
                                        </Typography>
                                    </CardContent>
                                </Collapse> */}
                            </Card>
                        </Grid>
                    ))
                    }
                </Grid>
            </div >


        )
    }
}