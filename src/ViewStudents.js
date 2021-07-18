import { API, Auth } from 'aws-amplify'
import React from 'react';
import * as queries from './graphql/queries';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


export default class ViewStudents extends React.Component {
    constructor() {
        super();
        this.similarStudents = {}
        this.state = {
            list: [],
            searchTerm: "",
            searchlist:[]
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
                        this.setState({...this.state, searchlist: this.state.list})
                    });
                    
                })
        })    
    }

    updateState() {
        this.setState({...this.state, searchlist:[]})
        this.state.list.filter(student => student.degree.includes(this.state.searchTerm) || 
        student.firstName.includes(this.state.searchTerm) || 
        student.units.find(value => value.includes(this.state.searchTerm)) ).
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
            <div>
                <div>
                    <input
                        type="text"
                        placeholder="Search"
                        value={this.state.searchTerm}
                        onChange={this.handleSearchQuery}
                    />
                </div>
                <div>
                    {console.log("SEARCH")}
                    {console.log(this.state.searchlist)}
                    {console.log("LIST")}
                    {console.log(this.state.list)}
                    {this.state.searchlist.map(card => (
                        // <li>{card.email}</li>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    {card.firstName}
                                    <br></br>
                                    {card.degree}
                                    <br></br>
                                    {card.email}
                                    <br></br>
                                    {card.units}
                                    <br></br>
                                    {card.studyMode}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Learn More</Button>
                            </CardActions>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }
}