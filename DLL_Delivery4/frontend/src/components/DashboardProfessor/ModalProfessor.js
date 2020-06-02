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
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});



export default function FormDialog(props) {
    
  let profAssess;
  if (props.type==='assessmentUpdate'){
        profAssess =(
        <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title" TransitionComponent={Transition}>
            <DialogTitle id="form-dialog-title">{props.info?props.info.fields.assessment_name:""}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Update Deadline For Submission
              </DialogContentText>
            <TextField
                id="assessmentDueDate"
                label="Due Date"
                type="date"
    //             defaultValue={props.info.fields.due_date}
                // className={classes.textField}
                InputLabelProps={{
                shrink: true,
                }}
                onChange={props.onChangeHandler}
            />

            </DialogContent>
            <DialogActions>
              <Button onClick={props.close} color="primary">
                Cancel
              </Button>
              <Button onClick={props.submit} color="primary" disabled={props.assessmentDueDate!==null?false:true}>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
      )
  }
  if (props.type==='assessmentGrade'){
        profAssess = (
            <div>
              <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title" TransitionComponent={Transition}>
                <DialogTitle id="form-dialog-title">{props.info?props.info.name:""}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please review the students overall scores and leave a comment.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="comment"
                    label="Comment"
                    type="text"
                    fullWidth
                  />

                </DialogContent>
                <DialogActions>
                  <Button onClick={props.close} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={props.submit} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
        )
  }
    if (props.type==='detailedStudentResults'){
        profAssess = (
            <div>
              <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title" TransitionComponent={Transition}>
                <DialogTitle id="form-dialog-title">{props.info?props.info.name:""}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please review the students overall scores and leave a comment.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="comment"
                    label="Comment"
                    type="text"
                    fullWidth
                  />

                </DialogContent>
                <DialogActions>
                  <Button onClick={props.close} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={props.submit} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
        )
    }
  return (
    <div>
        {profAssess}
    </div>
  );
}