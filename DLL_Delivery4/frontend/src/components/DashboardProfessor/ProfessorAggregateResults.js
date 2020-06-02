import React from 'react'

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Icon from '@material-ui/core/Icon';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import TimelineRoundedIcon from '@material-ui/icons/TimelineRounded';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';




const ProfessorAggregateResults = props=>{
    let studentGrid;
    let teamsGrid;
    let assessmentName;
    if(props.students.length>0){
        studentGrid=props.students.map((e,i)=>(
            <Grid item xs={12} md={4} sm={6} key={e.id}>
                <Card>

                    <CardContent style={{display:'flex', alignItems:'flex-start', flexDirection:'column'}}>
                    <CardActions onClick={()=>props.selectStudent(i)}>
                        <Typography variant='h5' color='primary'> <b>{e.name}</b>
                            <Typography align='left' variant='subtitle2' style={{color:'#FF5B5C'}}>
                                {e.completed==true?"":"Didn't Complete"}
                            </Typography>
                        </Typography>
                        <Typography variant='subtitle1'> <b>Team: </b>{e.team}</Typography>
                        <Typography variant='subtitle1' style={e.completed==false?{color:'#FF5B5C'}:{color:'primary'}}> <b>Overall Grade:</b> {e.avg_score}/5 </Typography>
                    </CardActions>
                    <Button outlined color="primary" onClick={()=>props.studentRemind(i)}> {e.completed==true?"":"REMIND"} </Button>
                    </CardContent>
                </Card>
            </Grid>

        ))
    }

    if(props.students.length===0){
        studentGrid=props.students.map(e=>(
            <Grid item xs={12} md={4} sm={6}>


                <Typography variant='subtitle2'> No students created yet!</Typography>

            </Grid>

        ))
    }

    if(props.teams.length>0){
        teamsGrid=props.teams.map((e,i)=>(
            <Grid item xs={12} md={6} sm={6} key={e.id}>
                <Card>
                    <CardActions onClick={()=>props.selectTeam(i)}>
                    <CardContent style={{display:'flex', alignItems:'flex-start', flexDirection:'column'}}>
                        <Typography variant='h5' color='primary'> <b>{e.name}</b> </Typography>
                        <Typography variant='subtitle1' > <b>Members:</b> {e.members.map(name=><Typography variant='caption'>{name} </Typography>)} </Typography>
                        <Typography variant='subtitle1'> <b>Overall Grade:</b> {e.avg_score}/5 </Typography>

                    </CardContent>
                    </CardActions>

                </Card>
            </Grid>

        ))
    }
    if(props.teams.length===0){
        teamsGrid=props.teams.map(e=>(
            <Grid item xs={12} md={4} sm={6}>

                <Typography variant='subtitle2'> No teams created yet</Typography>

            </Grid>

        ))
    }
    if(props.selected!=null){
        assessmentName=(
            <Grid item sm={11}>
                    <Typography variant="h4">
                       Results for <b>{props.selected}</b>
                    </Typography>
            </Grid>
        )
    }
    else {
        assessmentName=(
            <Grid item sm={11}>
                    <Typography variant="h4">
                       Results for Assessment
                    </Typography>
            </Grid>
        )
    }

    return(
        <Grid container spacing={6}>

            <Grid item container sm={10} xs={10}>
                {assessmentName}
            </Grid>
            <Grid item container sm={10} xs={10}>
                    <Button variant='outlined' color='primary' onClick={props.releaseResults}>
                        Release Results
                    </Button>
                    <Button variant='outlined' color='primary'>
                        <a href={"/downloadresults/?email="+props.loggedInUser+"&type="+props.loggedInUserType+"&assessment="+props.selectedAssessment} style={{textDecoration:'none'}}>Download Results</a>
                    </Button>
            </Grid>

            <Grid item container sm={12} xs={12} spacing={6} style={{display:'flex',justifyContent:'space-between'}}>
                <Grid item sm={11}>
                    <Typography variant="h4">
                       Teams: (Click to see Detailed Results)
                    </Typography>
                </Grid>
                {teamsGrid}


            </Grid>

            <Grid item container sm={10} xs={10}>
                <Grid item sm={11}>
                    <Typography variant="h4">
                       Students: (Click to see Detailed Results)
                    </Typography>
                </Grid>
            </Grid>


            <Grid item container sm={12} xs={12} spacing={6} style={{display:'flex',justifyContent:'space-evenly'}}>

                {studentGrid}


            </Grid>


        </Grid>
    )
}

export default ProfessorAggregateResults