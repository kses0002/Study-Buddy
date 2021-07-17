import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default function CardList ({data})  {
    
    const cardsArray = data.map(data => (
        <div>
      <Card>
        {/* name={data.line1}
        email={data.line2}
        key={data.id} */}

           <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {data.name}
        </Typography>
        <Typography variant="h5" component="h2">
          {data.Degree}
        </Typography>  
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
      </Card>
         
         </div>
    ));
  
    return (
      <div>
        {cardsArray}
      </div>
    );
  };