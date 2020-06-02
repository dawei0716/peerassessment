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
  let detailedTeamResults;

  if(props.info !==null){
    detailedTeamResults= (

        <React.Fragment>
            <Typography variant="h4" id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
            Group <b> {props.info.name}'s</b> Detailed Scores
            </Typography>
            <Typography id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
            (0=Lowest / 5=Best)
            </Typography>
              {
                props.detailedTeamResults.map(eMC=>(
                    <React.Fragment>

                        <Typography variant="h5" id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
                        Grades for <b>{eMC.name}</b>
                        </Typography>

                        {
                            eMC.res.map(eOR=>(
                                <React.Fragment>

                                    <Typography id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
                                    <b>{eOR.question}</b>
                                    </Typography>
                                        {
                                            eOR.scores.map(eSC=>(
                                                <React.Fragment>
                                                    <Typography id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
                                                    {eSC.grader}: {eSC.score}
                                                    </Typography>
                                                </React.Fragment>
                                            ))
                                        }
                                </React.Fragment>
                            ))
                        }
                     <Typography id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
                        <hr></hr>
                     </Typography>
                    </React.Fragment>
                ))
              }

              <Typography id="discrete-slider-custom" gutterBottom style={{paddingTop:20}}>
                <b>Team Average Question Grade: {props.info.avg_score}</b>
              </Typography>

        </React.Fragment>

    )

  }

  return (
    <div>
      <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title" >
        <DialogContent>
         {detailedTeamResults}

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
