import React from 'react';
import Amplify, { API, graphqlOperation, Auth } from 'aws-amplify'
import awsExports from "./aws-exports";
Amplify.configure(awsExports);


class Profile extends React.Component{
    constructor() {
        super();
    
        this.state = {
          email: ''
        }
      }
    
      componentDidMount() {
        Auth.currentAuthenticatedUser().then((user)=>{
            this.setState({email: user.attributes.email})   
     })

      }

    render(props){
        console.log(this.state)
        return(
            <h1>{this.state.email}</h1>
        )
        }
}
export default Profile