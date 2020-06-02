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




const ProfQuestionsTemplate = props=>{

    let questionsGrid;
    console.log("questions")
    console.log(props.questions)
    if(props.questions.length>0){
        console.log("length>1")
        questionsGrid=props.questions.map((e,i)=>(
            <Grid item xs={12} md={6} sm={6} key={e.id}>
                <Card>
                    <CardContent style={{display:'flex', alignItems:'flex-start', flexDirection:'column'}}>
                        <Typography variant='subtitle1'> <b>Question: </b>{e.fields.question} </Typography>
                        <Typography variant='subtitle2'> <b>Type: </b> {e.fields.type}</Typography>
                    </CardContent>

                </Card>
            </Grid>
        ))
    }
    if(props.questions.length===0){
        questionsGrid=(
            <Grid item xs={12} md={4} sm={6}>


                <Typography variant='subtitle1' > There are no questions</Typography>

            </Grid>

        )
    }

//
    return(
        <Grid container spacing={6}>

            <Grid item sm={10} xs={10}>
                <Typography variant="h4">
                    Questions
                </Typography>
            </Grid>
            <Grid item sm={1}>

                <Button variant='outlined' color='primary' onClick={props.openCreate}>
                    Create Question
                </Button>
            </Grid>
            <Grid item container sm={12} xs={12} spacing={6} style={{display:'flex',justifyContent:'space-between'}}>

                {questionsGrid}

            </Grid>


        </Grid>
    )
}

export default ProfQuestionsTemplate