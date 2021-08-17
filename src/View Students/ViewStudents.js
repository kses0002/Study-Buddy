import { API, Auth } from 'aws-amplify'
import React from 'react';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import 'bootstrap/dist/css/bootstrap.min.css';
import CardHeader from '@material-ui/core/CardHeader';
import './ViewStudents.css';
import IconButton from '@material-ui/core/IconButton';
import Pagination from '@material-ui/lab/Pagination';
// import { MuiThemeProvider, createMuiTheme } from '@material-ui/styles'

// const redTheme = createMuiTheme({ palette: { primary: 'red' } })

export default class ViewStudents extends React.Component {
    constructor() {
        super();
        this.similarStudents = {}
        this.state = {
            list: [],
            searchTerm: "",
            searchlist: [],
            expandEmail: "",
            currentUser: "",
            pageNumber: 0
        }

        this.usersPerPage = 10
        this.pageCount = 0;
        this.pagesVisited = 0;

        this.cardHeader = ["cardHeader1", "cardHeader2", "cardHeader3", "cardHeader4", "cardHeader5", "cardHeader6", "cardHeader7"]
        this.cardColor = ["#00ABE1", "#E5B9A8", "#9CF6FB", "#1FC58E", "#F8DD2E", "#FAB162", "#FF6495"]

        this.handleSearchQuery = this.handleSearchQuery.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleExpandClick = this.handleExpandClick.bind(this);
        this.handleAddBuddy = this.handleAddBuddy.bind(this);
        this.changePage = this.changePage.bind(this);

    }

    changePage(event) {
        this.setState({ ...this.state, pageNumber: parseInt(event.target.innerText) });
    };

    handleExpandClick(cardEmail) {
        if (cardEmail == this.state.expandEmail) {
            this.setState({ ...this.state, expandEmail: '' });
        }
        else {
            this.setState({ ...this.state, expandEmail: cardEmail });
        }
    };

    componentWillMount() {
        Auth.currentAuthenticatedUser().then((user) => {

            API.graphql({ query: queries.studentByEmail, variables: { email: user.attributes.email } })
                .then((currentUserData) => {
                    const currentStudent = currentUserData.data.studentByEmail.items[0]
                    this.setState({ ...this.state, currentUser: currentStudent })

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


                        this.pageCount = Math.ceil(Object.keys(this.similarStudents).length / this.usersPerPage);


                        for (var key in this.similarStudents) {
                            if (this.similarStudents.hasOwnProperty(key)) {
                                this.setState(state => {
                                    const list = [...state.list, this.similarStudents[key]];
                                    return {
                                        list,
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

    handleAddBuddy(addedBuddy) {

        const currentUser = this.state.currentUser

        delete currentUser.createdAt
        delete currentUser.updatedAt
        delete addedBuddy.createdAt
        delete addedBuddy.updatedAt

        if (!(currentUser.hasOwnProperty("notifiedUsers")) || currentUser.notifiedUsers == null) {
            currentUser.notifiedUsers = [addedBuddy.email]
        }
        else if (!(currentUser.notifiedUsers.includes(addedBuddy.email))) {
            currentUser.notifiedUsers.push(addedBuddy.email)
        }

        if (!(addedBuddy.hasOwnProperty("recievedRequests")) || addedBuddy.recievedRequests == null) {
            addedBuddy.recievedRequests = [currentUser.email]
        }
        else if (!(addedBuddy.recievedRequests.includes(currentUser.email))) {
            addedBuddy.recievedRequests.push(currentUser.email)
        }

        API.graphql({ query: mutations.updateStudent, variables: { input: currentUser } });
        API.graphql({ query: mutations.updateStudent, variables: { input: addedBuddy } });
    }

    render(props) {
        this.pagesVisited = (this.state.pageNumber - 1) * this.usersPerPage

        if (this.pagesVisited < 0) {
            this.pagesVisited = 0
        }


        return (
            <div className="root">
                <Grid container spacing={1} justifyContent="center" alignItems="center" direction="row" >
                        <input
                            type="text"
                            placeholder="Search"
                            value={this.state.searchTerm}
                            onChange={this.handleSearchQuery}
                            className="searchBar"
                        />
                </Grid> 
                <br></br>
                <br></br>
                <Grid container spacing={4} justifyContent="center" >
                    {console.log(this.state.searchlist)}
                    {this.state.searchlist.slice(this.pagesVisited, this.pagesVisited + this.usersPerPage).map((card, index) => (
                        <Grid item xs={12} sm={6} md={3}  >
                            <Card className="card" >
                                <CardHeader
                                    // className="cardHeader"
                                    // title={<Typography variant="h6" style={{ color: "white" }}>{card.firstName}</Typography>}
                                    // subheader={<Typography style={{ color: "white" }} variant="body2" >{card.degree}</Typography>}
                                    className={this.cardHeader[index % this.cardHeader.length]}
                                    title={<Typography variant="h6" style={{ color: "black" }}>{card.firstName}</Typography>}
                                    subheader={<Typography style={{ color: "black" }} variant="body2" >{card.degree}</Typography>}
                                    avatar={
                                        <Avatar aria-label="recipe" style={{
                                            color: this.cardColor[index % this.cardColor.length],
                                            borderRadius: "100%",
                                            border: "solid",
                                            borderWidth: "0.0px", borderColor: "black", backgroundColor: "white"
                                        }}>
                                            {card.firstName[0]}
                                        </Avatar>
                                    }
                                />
                                <CardContent className="cardContent">
                                    Units: {card.units.map((item) =>
                                        <Typography gutterbottom="true" variant="body2">{item}</Typography>)}
                                </CardContent>
                                <CardContent>
                                    Study Mode: {card.studyMode.map((item) =>
                                        <Typography gutterbottom="true" variant="body2">{item}</Typography>)}
                                </CardContent>
                                {/* <Grid container spacing={3} justifyContent="flex-start" > */}
                                <CardActions>
                                    {/* <Grid item xs={12} sm={6} md={6} alignItems="flex-end"> */}
                                    <Button variant="contained" style={{
                                        backgroundColor: "#0C1115",
                                        color: 'white'
                                    }} size="small" onClick={() => this.handleAddBuddy(card)}>Add</Button>
                                    <Button size="small" style={{
                                        backgroundColor: "#BE2F29",
                                        color: 'white'
                                    }}>Dismiss</Button>
                                    {/* </Grid> */}
                                    {/* <Grid item xs={12} sm={6} md={12} alignItems="flex-end"> */}
                                    <IconButton
                                        onClick={() => this.handleExpandClick(card.email)}
                                        aria-expanded={this.state.expanded}
                                        aria-label="show more"
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                                    {/* </Grid> */}
                                </CardActions>

                                {/* </Grid> */}
                                <Collapse in={card.email == this.state.expandEmail} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <Typography paragraph>About {card.firstName}:</Typography>
                                        <Typography paragraph>
                                            {card.aboutMe}
                                        </Typography>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Grid>
                    ))
                    }
                </Grid>
                <Pagination
                    count={this.pageCount}
                    onChange={this.changePage} />
            </div >


        )
    }
}

/*
Tom
ERin
Olivia

Keshav
Momo Adam

*/