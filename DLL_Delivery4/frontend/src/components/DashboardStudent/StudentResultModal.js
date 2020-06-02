import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';


export default function FormDialog(props) {
  let aggregatedStudentResults;

  if(props.info !==null){
    aggregatedStudentResults= (

        <React.Fragment>
            <Typography variant="h6" id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
            <b> {props.name}'s</b> Average Scores
            </Typography>
            <Typography id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
            (0=Lowest / 5=Best)
            </Typography>
              {
                props.questionsMC.map(eMC=>(
                    <React.Fragment>

                        <Typography id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
                        {eMC.question}
                        </Typography>
                        <Typography>
                        Average: {eMC.grade}
                        </Typography>

                    </React.Fragment>
                ))
              }

              {
                props.questionsOR.map(eOR=>(
                    <React.Fragment>

                        <Typography id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
                        {eOR.question}
                        </Typography>
                        <Typography>
                        Average: {eOR.grade}
                        </Typography>

                    </React.Fragment>
                ))
              }

              <Typography id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
                <b>Total Assessment Average: {props.totalScore}</b>
              </Typography>

        </React.Fragment>

    )

  }

  return (
    <div>
      <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title" >
        <DialogTitle id="form-dialog-title">{props.info?props.info.name:null}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Aggregated Results
          </DialogContentText>
         {aggregatedStudentResults}

        </DialogContent>
        <DialogActions>
          <Button onClick={props.close} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
