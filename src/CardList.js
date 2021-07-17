import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default function CardList({ data }) {


    // console.log(data)

    // const newData=[]
    // for (var key in data) {
    //     if (data.hasOwnProperty(key)) {
    //         console.log(key);
    //         newData.push(data[key])
    //     }
    // }

    // console.log(newData)
    // data=newData

    console.log(data)

    const cardsArray = data.map(data => (
        <div>
      <Card>
        {/* name={data.line1}
        email={data.line2}
        key={data.id} */}

           <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {data.email}
        </Typography>
        <Typography variant="h5" component="h2">
          {data.units}
        </Typography>  
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
      </Card>

         </div>
    ));
        console.log("AAA")
    return (
        <div>
            {cardsArray}
        </div>
    );
};

// export default class CardList extends React.Component {
//     constructor(props) {
//         super(props);

//          this.studentData = []
//         for (var key in this.props.data) {
//             if (this.props.data.hasOwnProperty(key)) {
//                 // console.log(key);
//                 this.studentData.push(this.props.data[key])
//             }
//         }
//     }


//     render(props) {

//         console.log(this.props)
//         // const studentData = []
//         // for (var key in this.props.data) {
//         //     if (this.props.data.hasOwnProperty(key)) {
//         //         // console.log(key);
//         //         studentData.push(this.props.data[key])
//         //     }
//         // }
//         // console.log(studentData)

//         return (
//             <div>
//                 <Card>
//                     {/* name={data.line1}
//                         email={data.line2}
//                         key={data.id} */}

//                     <CardContent>
//                         <Typography color="textSecondary" gutterBottom>
//                             {this.studentData.email}
//                         </Typography>
//                         <Typography variant="h5" component="h2">
//                             {this.studentData.units}
//                         </Typography>
//                     </CardContent>
//                     <CardActions>
//                         <Button size="small">Learn More</Button>
//                     </CardActions>
//                 </Card>

//             </div>
//         )
//     }
// }