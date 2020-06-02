import React from 'react'

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActionArea';

import Typography from '@material-ui/core/Typography';

import Icon from '@material-ui/core/Icon';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import TimelineRoundedIcon from '@material-ui/icons/TimelineRounded';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';


import Moment from 'moment'



const StudentHome = props=>{



    let closedArr;


    if(props.completedArr.length>0){
        closedArr=props.completedArr.map((e,i)=>(
            <Grid item xs={12} md={6} sm={6} key={e.id}>
                <Card>
                    <CardActions onClick={()=>props.openModal(i)}>
                    <CardContent style={{display:'flex', alignItems:'flex-start', flexDirection:'column'}}>
                        <Typography variant='h5'> <b>{e.fields.assessment_name}</b> </Typography>
                        <Typography variant='subtitle1' > <b>Due date:</b> {Moment(e.fields.due_date).format('MMMM Do YYYY')}</Typography>
                        <Typography variant='subtitle2' > Click to see Aggregated Results </Typography>

                    </CardContent>
                    </CardActions>
                </Card>
            </Grid>
            
        ))
    }
    if(props.completedArr.length===0){
        closedArr=props.completedArr.map(e=>(
            <Grid item xs={12} md={4} sm={6}>
                
                <Typography variant='subtitle2'> No Assessments Completed!</Typography>
                
            </Grid>
            
        ))
    }


    return(
        <Grid container spacing={6}>

            <Grid item sm={10} xs={10}>
                <Typography variant="h4" style={{color:'#39DA8A'}}>
                    Released Results
                </Typography>
            </Grid>

            <Grid item container sm={12} xs={12} spacing={6} style={{display:'flex',justifyContent:'space-between'}}>
                
                {closedArr}                


            </Grid>


        </Grid>
    )
}

export default StudentHome