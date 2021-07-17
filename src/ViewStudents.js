import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardList from './CardList.js'

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function ViewStudents() {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const data = [
        {
            name: "Keshav",
            Degree: "Eng",
            Bio: "I am indian",
            StudyMode:"Virtual",
            units:"FIT#$@, FIT$@@"
        },

        {
            name: "Keshav",
            Degree: "Eng",
            Bio: "I am indian",
            StudyMode:"Virtual",
            units:"FIT#$@, FIT$@@"
        },

        {
            name: "Keshav",
            Degree: "Eng",
            Bio: "I am indian",
            StudyMode:"Virtual",
            units:"FIT#$@, FIT$@@"
        },
    ]

    return (
            <div>
            <CardList data={data} />
          </div>
        // <div>
        //     <Card className={classes.root}>
        //         <CardContent>
        //             <Typography className={classes.title} color="textSecondary" gutterBottom>
        //                 Word of the Day
        //             </Typography>
        //             <Typography variant="h5" component="h2">
        //                 be{bull}nev{bull}o{bull}lent
        //             </Typography>
        //         </CardContent>
        //         <CardActions>
        //             <Button size="small">Learn More</Button>
        //         </CardActions>
        //     </Card>
        //     <Card className={classes.root}>
        //         <CardContent>
        //             <Typography className={classes.title} color="textSecondary" gutterBottom>
        //                 Word of the Day
        //             </Typography>
        //             <Typography variant="h5" component="h2">
        //                 be{bull}nev{bull}o{bull}lent
        //             </Typography>
        //         </CardContent>
        //         <CardActions>
        //             <Button size="small">Learn More</Button>
        //         </CardActions>
        //     </Card>
        // </div>


    );
}

// const CardList = ({ data }) => {

//     const cardsArray = data.map(data => (
//         <div>
//       <Card>
//         name={data.line1}
//         email={data.line2}
//         key={data.id}

//            <CardContent>
//         <Typography color="textSecondary" gutterBottom>
//           Word of the Day
//         </Typography>
//         <Typography variant="h5" component="h2">
//           benevolent
//         </Typography>  
//       </CardContent>
//       <CardActions>
//         <Button size="small">Learn More</Button>
//       </CardActions>
//       </Card>

//          </div>
//     ));

//     return (
//       <div>
//         {cardsArray}
//       </div>
//     );
//   };