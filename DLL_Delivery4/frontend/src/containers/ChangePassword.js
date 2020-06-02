import React, {Component} from 'react'
import Container from '@material-ui/core/Container'
// import pages
import axios from 'axios'
import ChangePasswordPage from '../components/Login/ChangePassword'
import SnackBar from '../components/Login/SnackBar'

import Nav from '../components/NavBar'
import {withRouter,Redirect} from 'react-router-dom'



class ChangePassword extends Component{

    state={
        logout: false,
        currentPassword:null,
        newPassword:null,
        confirmPassword:null,
        wrongCredentials:false,
        mismatchedNewCreds:false,
        successfulChange:false,
        professorRedirect:false,
        studentRedirect:false,
        sidebar:null,
        userType:null,
        determined:false,
    }

    onLogout=()=>{
        this.setState({
            logout:true
        })
    }

    // *------------ HANDLE CHANGE TEXT ----------------*
    textHandler=e=>{
        this.setState({
            [e.target.id]:e.target.value
        })
    }

    changePasswordHandler= async e=>{
        e.preventDefault()
        e.stopPropagation();
        console.log("submit change password")
        //function to get the cookie from req in order to handle the csrf token
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        var valid = 'F';
        //get csrf token in order to not have request blocked
        var csrftoken = getCookie('csrftoken');

        //if new and confirm password match
        if(this.state.newPassword==this.state.confirmPassword){
            console.log("change password request")
            //Using axios to write post request to Django server that is handled in requestHandler.py to validate
            axios.post('/verifychangepassword/',{
                currentPassword: this.state.currentPassword,
                newPassword: this.state.newPassword,
                confirmPassword: this.state.confirmPassword,
                email: localStorage.getItem('userEmail'),
                type: localStorage.getItem('userType')
            },
            {
                headers: {
                    'X-CSRFToken': csrftoken
                }
            }).then((response) => {
                  valid = response.data
                  console.log(response.data);

                if(valid=='F'){
                    this.setState({
                        wrongCredentials:true
                    })
                }
                else{
                    this.setState({
                        successfulChange:true
                    })
                    //Included this commented code if you want to redirect to home page after change
//                     var userType = localStorage.getItem("userType")
//                     if(userType=="Professor"){
//                         this.setState({
//                             professorRedirect:true
//                         })
//                     }
//                     else if(userType=="Student"){
//                         this.setState({
//                             studentRedirect:true
//                         })
//                     }
                }
                }, (error) => {
                  console.log(error);
            });
        }
        else{
            this.setState({
                mismatchedNewCreds:true
            })
        }

    }
    // *------------- NEXT -------------*
    onClickBack=e=>{
        var userType = localStorage.getItem("userType")
        if(userType=="Professor"){
            this.setState({
                professorRedirect:true
            })
        }
        else if(userType=="Student"){
            this.setState({
                studentRedirect:true
            })
        }

    }

    //  *------------ CLOSE NOTIFICATION ----------------*
     handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        this.setState({
            wrongCredentials:false,
            mismatchedNewCreds:false,
            successfulChange:false
        })
      };
    render(){
//         if(localStorage.getItem('userType')=='Student'){
//             this.setState({
//                 sidebar:'Student'
//             })
//         }
//         else if(localStorage.getItem('selectedClass'==null)){
//             this.setState({
//                 sidebar:'ProfessorHome'
//             })
//         }
//         else{
//             this.setState({
//                 sidebar:'Professor'
//             })
//         }
        if(!this.state.determined){
            if(localStorage.getItem('userType')=='Professor'){
                this.setState({
                    userType:'ProfessorHome'
                })
            }
            else{
                this.setState({
                    userType:'StudentHome'
                })
            }
            this.setState({
                determined:true
            })
        }

        let pageContent = (
            <ChangePasswordPage
                textHandler={this.textHandler}
                handleBack={this.onClickBack}
                changePasswordHandler={this.changePasswordHandler}
            />

        )
        console.log('changepwdpage')

        return(
            <Nav
//                 user={this.state.sidebar}
                user={this.state.userType}
                onLogout={this.onLogout}
            >

                {pageContent}
                <SnackBar
                    message='Incorrect Password'
                    open={this.state.wrongCredentials}
                    handleClose={this.handleClose}

                />
                <SnackBar
                    message="Confirm Password doesn't match New Password"
                    open={this.state.mismatchedNewCreds}
                    handleClose={this.handleClose}

                />
                <SnackBar
                    message="Password Successfully Changed"
                    open={this.state.successfulChange}
                    handleClose={this.handleClose}

                />
            {this.state.logout===true?<Redirect to='/login' />:null}
            {this.state.successfulChange?<Redirect to='/changepassword/'/>:null}
            {this.state.professorRedirect?<Redirect to='/professorHome/'/>:null}
            {this.state.studentRedirect?<Redirect to='/studentHome/'/>:null}

            </Nav>
        )
    }
}
export default ChangePassword