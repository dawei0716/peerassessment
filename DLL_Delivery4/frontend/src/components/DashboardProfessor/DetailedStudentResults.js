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
  let detailedStudentResults;

  if(props.info !==null){
    detailedStudentResults= (

        <React.Fragment>
            <Typography variant="h6" id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
            <b> {props.info.name}'s</b> Detailed Scores
            </Typography>
            <Typography id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
            (0=Lowest / 5=Best)
            </Typography>
              {
                props.detailedStudentResults.map(eMC=>(
                    <React.Fragment>

                        <Typography id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
                        <b>{eMC.question}</b>
                        </Typography>

                        {
                            eMC.grades.map(eOR=>(
                                <React.Fragment>

                                    <Typography id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
                                    {eOR.grader}: {eOR.score}
                                    </Typography>

                                </React.Fragment>
                            ))
                        }
                    </React.Fragment>
                ))
              }

              <Typography id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
                <b>Total Assessment Grade: {props.info.avg_score}</b>
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
            Detailed Results
          </DialogContentText>
         {detailedStudentResults}

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
