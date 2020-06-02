import React, {Component} from 'react'
import Container from '@material-ui/core/Container'
// import pages
import axios from 'axios'
import FirstPage from '../components/Login/1stPage'
import StudentLogin from '../components/Login/StudentLogin'
import ProfessorLogin from '../components/Login/ProfessorLogin'

// Import Custom Components
import SnackBar from '../components/Login/SnackBar'

// import router redirect

import {withRouter,Redirect} from 'react-router-dom'


// *----------------DUMMY DATA ------------------*
const professorCredentials ={
    username:'professor@bc.edu',
    pass:'12345678'
}

const studentCredentials ={
    username:'student@bc.edu',
    pass:'12345678'
}


class Login extends Component{

    // *------------ INITIALIZE STATE ----------------*
    state={
        typeSelected:null,
        step:0,

        professorEmail:null,
        professorPassword:null,

        studentEmail:null,
        studentPassword:null,

        wrongCredentials: false,

        professorRedirect:false,
        studentRedirect:false


    }


    // *-----------HANDLE SELECT TYPE ------*

    onClickTypeHandler=e=>{
        if(e==='Student'){
            this.setState({
                typeSelected:'Student'
            })
        }
        if(e==='Professor'){
            this.setState({
                typeSelected:'Professor'
            })
        }
    }

    // *------------- NEXT -------------*
    onClickNext=e=>{
        if(this.state.step===0){
            this.setState({
                step:1
            })
        }
        if(this.state.step===1){
            this.setState({
                step:0,
                typeSelected:null,
                studentEmail:null,
                studentPassword:null,
                professorEmail:null,
                professorPassword:null

            })
        }
    }


    // *------------ HANDLE CHANGE TEXT ----------------*
    textHandler=e=>{
        this.setState({
            [e.target.id]:e.target.value
        })
    }


    // *------------- LOGIN -----------------*
    loginHandler= async e=>{
        e.preventDefault()
        e.stopPropagation();
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
        if(this.state.typeSelected==='Student'){
            // *----------- CHANGE WITH DJANGO SERVER ---------------*
            var valid = 'F';
            //get csrf token in order to not have request blocked
            var csrftoken = getCookie('csrftoken');
//            emailData = this.state.studentEmail.toLowerCase()
            //Using axios to write post request to Django server that is handled in requestHandler.py to validate
            axios.post('/validate/',{
                email: this.state.studentEmail.toLowerCase(),
                pwd: this.state.studentPassword,
                t: "S"
            },
            {
                headers: {
                    'X-CSRFToken': csrftoken
                }
            }).then((response) => {
                  var responseData = response.data
                  valid = responseData[0]
                  var emailData = responseData[1]
                  console.log(response.data);
                  console.log(valid);
                  console.log(emailData);

                if(valid=='F'){
                    this.setState({
                        wrongCredentials:true
                })
                }
                else{
                    // *--------- ADD TOKEN ----------------*
                    // localStorage.setItem('token',login.data.token)
                    localStorage.setItem('userType','Student')
                    localStorage.setItem('userEmail',emailData)
                    console.log("local storage set email")
                    this.setState({
                        studentRedirect:true
                    })
                }
                }, (error) => {
                  console.log(error);
            });
        }
        //Same logic as above now for professor login
        if(this.state.typeSelected==='Professor'){
            // *----------- CHANGE WITH DJANGO SERVER ---------------*
            var valid = 'F';

            var csrftoken = getCookie('csrftoken');
//            emailData = this.state.professorEmail.toLowerCase()
            axios.post('/validate/',{
                email: this.state.professorEmail.toLowerCase(),
                pwd: this.state.professorPassword,
                t: "I"
            },
            {
                headers: {
                    'X-CSRFToken': csrftoken
                }
            }).then((response) => {
                  var responseData = response.data
                  valid = responseData[0]
                  var emailData = responseData[1]
                  console.log(response.data);
                  console.log(valid);
                  console.log(emailData);
                if(valid=='F'){
                    this.setState({
                        wrongCredentials:true
                })
                }
                else{
                    // *--------- ADD TOKEN ----------------*
                    // localStorage.setItem('token',login.data.token)
                    localStorage.setItem('userType','Professor')
                    localStorage.setItem('userEmail',emailData)
                    this.setState({
                        professorRedirect:true
                    })
                }
                }, (error) => {
                  console.log(error);
            });

        }

    }



    //  *------------ CLOSE NOTIFICATION ----------------*
     handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({
            wrongCredentials:false
        })
      };



    render(){
        // pageContent
        let pageContent = (
            <FirstPage
                    clickTypeHandler={this.onClickTypeHandler}
                    selected={this.state.typeSelected}
                    nextHandler={this.onClickNext}
                />

        )

        // Change to Student Login 
        if(this.state.step===1 && this.state.typeSelected==='Student'){
            pageContent=(
                <StudentLogin
                    handleBack={this.onClickNext}
                    textHandler={this.textHandler}
                    loginHandler={this.loginHandler}
                    pass={this.state.studentPassword}
                    email={this.state.studentEmail}
                />
            )
        }

         // Change to Professor Login 
         if(this.state.step===1 && this.state.typeSelected==='Professor'){
            pageContent=(
                <ProfessorLogin
                    handleBack={this.onClickNext}
                    textHandler={this.textHandler}
                    loginHandler={this.loginHandler}
                    pass={this.state.professorPassword}
                    email={this.state.professorEmail}

                />
            )
        }


        return(
            <Container style={{height:'100%'}}>
                {pageContent}



                <SnackBar 
                    message='Wrong Credentials'
                    open={this.state.wrongCredentials}
                    handleClose={this.handleClose}
                
                />


                {this.state.professorRedirect?<Redirect to='/professorHome/'/>:null}
                {this.state.studentRedirect?<Redirect to='/studentHome/'/>:null}

            </Container>
        )
    }
}


export default withRouter(Login)