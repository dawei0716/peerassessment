import React from 'react'

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActionArea';

import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';



import Moment from 'moment'



const StudentHome = props=>{


    let closedAssessments;
    let assessmentsGrid;

    if(props.assessments.length>0){
        assessmentsGrid=props.assessments.map((e,i)=>(
            <Grid item xs={12} md={6} sm={6} key={e.id}>
                <Card>
                    <CardActions onClick={()=>props.openModal(i)}>
                    <CardContent style={{display:'flex', alignItems:'flex-start', flexDirection:'column'}}>
                        <Typography variant='h5'> <b>{e.fields.assessment_name}</b> </Typography>
                        <Typography variant='subtitle1' > <b>Start date:</b> {Moment(e.fields.start_date).format('MMMM Do YYYY')}</Typography>
                        <Typography variant='subtitle1' > <b>Due date:</b> {Moment(e.fields.due_date).format('MMMM Do YYYY')}</Typography>

                    </CardContent>
                    </CardActions>

                </Card>
            </Grid>

        ))
    }
    if(props.assessments.length===0){
        assessmentsGrid=props.assessments.map(e=>(
            <Grid item xs={12} md={4} sm={6}>

                <Typography variant='subtitle2'> No Ongoing Assessments</Typography>

            </Grid>

        ))
    }


    if(props.closedAssessments.length>0){
        closedAssessments=props.closedAssessments.map((e,i)=>(
            <Grid item xs={12} md={6} sm={6} key={e.id}>
                <Card>
                    <CardActions onClick={()=>props.selectAssessment(i)}>
                    <CardContent style={{display:'flex', alignItems:'flex-start', flexDirection:'column'}}>
                        <Typography align='left' variant='h5'> <b>{e.fields.assessment_name}</b> <Typography align='left' variant='subtitle2' style={{color:'#FF5B5C'}}>(closed)</Typography> </Typography>
                        <Typography variant='subtitle1' > <b>Start date:</b> {Moment(e.fields.start_date).format('MMMM Do YYYY')}</Typography>
                        <Typography variant='subtitle1' > <b>Due date:</b> {Moment(e.fields.due_date).format('MMMM Do YYYY')}</Typography>
                       <Typography variant='subtitle2'> Click to View Results </Typography>
                    </CardContent>
                    </CardActions>
                </Card>
            </Grid>
            
        ))
    }
//    }if(props.closedAssessments.length>0){
//        closedAssessments=props.closedAssessments.map((e,i)=>(
//            <Grid item xs={12} md={6} sm={6} key={e.id}>
//                <Card>
//                    <CardActions onClick={()=>props.openModal(i)}>
//                    <CardContent style={{display:'flex', alignItems:'flex-start', flexDirection:'column'}}>
//                        <Typography variant='h5'> <b>{e.fields.assessment_name}</b> </Typography>
//                        <Typography variant='subtitle1'> <b>Team:</b> {e.team}</Typography>
//                        <Typography variant='subtitle1'> <b>Assessment:</b> {e.assessment} </Typography>
//                        <Typography variant='subtitle1'> <b>Overall Grade:</b> {e.overallGrade}/5 </Typography>
//                        <Typography variant='subtitle2'> Click to Grade </Typography>
//                    </CardContent>
//                    </CardActions>
//
//                </Card>
//            </Grid>
//
//        ))
//    }
    if(props.closedAssessments.length===0){
        closedAssessments=(
            <Grid item xs={12} md={4} sm={6}>
                
                
                <Typography variant='subtitle1' > No Assessments Cosed!</Typography>
                
            </Grid>
            
        )
    }




    return(
        <Grid container spacing={6}>

            <Grid item container sm={10} xs={10}>
                <Grid item sm={12}>
                    <Typography variant="h4" color='primary'>
                        All Assessments
                    </Typography>
                </Grid>
            </Grid>
            <Grid item sm={1}>

                <Button variant='outlined' color='primary' onClick={props.openCreate}>
                    Create Assessment
                </Button>
            </Grid>
            <Grid item container sm={12} xs={12} spacing={6} style={{display:'flex',justifyContent:'space-between'}}>
                
                {assessmentsGrid}


            </Grid>

            <Grid item container sm={10} xs={10}>
                <Grid item sm={11}>
                    <Typography variant="h4" color='primary'>
                       Closed Assessments
                    </Typography>
                </Grid>
            </Grid>

            <Grid item container sm={12} xs={12} spacing={6} style={{display:'flex',justifyContent:'space-between'}}>
                
                {closedAssessments}


            </Grid>


        </Grid>
    )
}

export default StudentHome