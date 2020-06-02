import React from 'react'

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button'

import Typography from '@material-ui/core/Typography';








const StudentHome = props=>{


    let studentGrid;
    let teamsGrid;

    if(props.students.length>0){
        studentGrid=props.students.map((e,i)=>(
            <Grid item xs={12} md={4} sm={6} key={e.id}>
                <Card>

                    <CardContent style={{display:'flex', alignItems:'flex-start', flexDirection:'column'}}>
                        <Typography variant='h5' color='primary'> <b>{e.name}</b> </Typography>
                        <Typography variant='subtitle1'> <b>Team: </b>{e.team}</Typography>
                        <Typography variant='subtitle1'> <b>Overall Grade:</b> 5/5 </Typography>
                        <Button outlined color="primary" onClick={()=>props.studentDelete(i)}> Delete </Button>
                    </CardContent>

                </Card>
            </Grid>

        ))
    }
//    }f(props.students.length>0){
//        studentGrid=props.students.map((e,i)=>(
//            <Grid item xs={12} md={4} sm={6} key={e.id}>
//                <Card>
//
//                    <CardContent style={{display:'flex', alignItems:'flex-start', flexDirection:'column'}}>
//                        <Typography variant='h5' color='primary'> <b>{e.fields.first_name} {e.fields.last_name}</b> </Typography>
//                        <Typography variant='subtitle1'> <b>Team:</b> 1</Typography>
//                        <Typography variant='subtitle1'> <b>Overall Grade:</b> 5/5 </Typography>
//                        <Button outlined color="primary" onClick={()=>props.studentDelete(i)}> Delete </Button>
//                    </CardContent>
//
//                </Card>
//            </Grid>
//
//        ))
//    }
    if(props.students.length===0){
        studentGrid=props.students.map(e=>(
            <Grid item xs={12} md={4} sm={6}>


                <Typography variant='subtitle2'> No students created yet!</Typography>

            </Grid>

        ))
    }

//    if(propsps.teams.length>0){
//        teamsGrid=props.teams.map((e,i)=>(
//            <Grid item xs={12} md={6} sm={6} key={e.id}>
//                <Card>
//
//                    <CardContent style={{display:'flex', alignItems:'flex-start', flexDirection:'column'}}>
//                        <Typography variant='h5' color='primary'> <b>{e.fields.group_name}</b> </Typography>
//                        <Typography variant='subtitle2' > <b>Overall Grade: </b> 5/5 </Typography>
//
//                    </CardContent>
//
//                </Card>
//            </Grid>
//
//        ))
//    }
    if(props.teams.length>0){
        teamsGrid=props.teams.map((e,i)=>(
            <Grid item xs={12} md={6} sm={6} key={e.id}>
                <Card>

                    <CardContent style={{display:'flex', alignItems:'flex-start', flexDirection:'column'}}>
                        <Typography variant='h5' color='primary'> <b>{e.name}</b> </Typography>
                        <Typography variant='subtitle1' > <b>Members:</b> {e.members.map(name=><Typography variant='caption'>{name} </Typography>)} </Typography>

                    </CardContent>

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


    return(
        <Grid container spacing={6}>

            <Grid item container sm={10} xs={10}>
                <Grid item sm={11}>
                    <Typography variant="h4">
                       All Teams
                    </Typography>
                </Grid>
            </Grid>

            <Grid item container sm={12} xs={12} spacing={6} style={{display:'flex',justifyContent:'space-between'}}>

                {teamsGrid}


            </Grid>

            <Grid item container sm={10} xs={10}>
                <Grid item sm={11}>
                    <Typography variant="h4">
                       Students
                    </Typography>
                </Grid>
            </Grid>


            <Grid item container sm={12} xs={12} spacing={6} style={{display:'flex',justifyContent:'space-evenly'}}>

                {studentGrid}


            </Grid>


        </Grid>
    )
}

export default StudentHome
