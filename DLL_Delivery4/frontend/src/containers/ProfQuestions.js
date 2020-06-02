import React, { Component } from "react";
import { Redirect } from "react-router-dom";

// HomePage
import ProfQuestionsTemplate from "../components/DashboardProfessor/ProfQuestionsTemplate";
import CreateModal from "../components/DashboardProfessor/CreateModal";

import axios from "axios";

// Nav
import Nav from "../components/NavBar";
import SnackBar from "../components/Login/SnackBar";


class ProfQuestions extends Component {

  state = {
    questions: [],

    logout: false,
    changePassword: false,

    createModal: false,
    question: null,
    typeSelect: null,

    notificationQuestion: false,
    notificationQuestionFailed:false,
    ranRequest: false,

    email: localStorage.getItem("userEmail"),
    type: localStorage.getItem("userType"),
    types: [
        {
            name:'Multiple Choice'
        },
        {
            name:'Open Response'
        }
    ]
  };

  changePassword = () => {
    console.log("changepwd");
    this.setState({
      changePassword: true,
    });
  };
  onLogout = () => {
    console.log("here");
    this.setState({
      logout: true,
    });
  };

  openCreateModal = () => {
    console.log("Open Modal for making assessment");
    this.setState({
      createModal: true,
    });
  };

  // *------------ HANDLE CHANGE TEXT ----------------*
  textHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  typeSelectHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleClose = () => {
    this.setState({
      createModal: false,
    });
  };

  //  *------------ Create Functions -------------*
  submitNewQuestionHandler = () => {
    //--------------------------------------------------------------
    console.log("create question");
    //function to get the cookie from req in order to handle the csrf token
    function getCookie(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }

    //get csrf token in order to not have request blocked
    var csrftoken = getCookie("csrftoken");
    //--------------------------------------------------------------

    console.log("create Student req");
    axios
      .post(
        "/makenewquestion/",
        {
          question: this.state.question,
          questionType: this.state.typeSelect,
          email: localStorage.getItem("userEmail"),
          type: localStorage.getItem("userType"),
        },
        {
          headers: {
            "X-CSRFToken": csrftoken,
          },
        }
      )
      .then(
        (response) => {
          var data = response.data;
          console.log(response.data);

          if(data!="None"){
              var a = JSON.parse(data)
              this.state.questions.push(a[0]);
              this.setState({
                ranRequest: false,
                notificationQuestion: true,
              });
          }
          else{
            this.setState({
                notificationQuestionFailed: true,
                ranRequest: false
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    //--------------------------------------------------------------

//    this.state.questions.push({
//      name: this.state.studentName,
//      team: this.state.teamSelected,
//      overallGrade: "0",
//    });

    this.setState({
      questions: this.state.questions,
      question: null,
      typeSelect: null,
      createModal: false,
    });
  };

  handleCloseNot = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({
      notificationQuestion: false,
    });
  };

  render() {
    //write a get request to get all assessments!!!!!
    //Http Request
    console.log("Load prof homepage");
    var storageEmail = localStorage.getItem("userEmail");
    var storageType = localStorage.getItem("userType");
    console.log(this.state.email);
    console.log(this.state.type);
    //--------------------------------------------------------------------
    //function to get the cookie from req in order to handle the csrf token
    if(!this.state.ranRequest){
        function getCookie(name) {
          var cookieValue = null;
          if (document.cookie && document.cookie !== "") {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
              var cookie = cookies[i].trim();
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
              }
            }
          }
          return cookieValue;
        }
        //get csrf token in order to not have request blocked
        var csrftoken = getCookie("csrftoken");
        //--------------------------------------------------------------------

        console.log("View questions");
        //Using axios to write post request to Django server that is handled in requestHandler.py to validate
        axios
          .post(
            "/getquestions/",
            {
              email: localStorage.getItem("userEmail"),
              type: localStorage.getItem("userType"),
            },
            {
              headers: {
                "X-CSRFToken": csrftoken,
              },
            }
          )
          .then(
            (response) => {
              var data = response.data;
              console.log("responded to get request");
              //              console.log(response.data);
              //              this.props.classes = data
              console.log(data);
              this.setState({
                questions: JSON.parse(data),
                ranRequest: true
              });
              //              console.log(this.state.loadClasses)
            },
            (error) => {
              console.log(error);
            }
          );
        console.log("Out of request");
    }

    //--------------------------------------------------------------------
    //        if(localStorage.getItem('selectedClass')!=null){
    //            this.setState({
    //                user:false
    //            })
    //        }

    return (
      <Nav
        user="Professor"
        changePassword={this.changePassword}
        onLogout={this.onLogout}
      >
        <ProfQuestionsTemplate
          questions={this.state.questions}
          openCreate={this.openCreateModal}
        />
        <CreateModal
          close={this.handleClose}
          open={this.state.createModal}
          onChangeHandler={this.textHandler}
          question={this.state.question}
          typeSelect={this.state.typeSelect}
          submit={this.submitNewQuestionHandler}
          type="question"
          types={this.state.types}
          typeSelectHandler={this.typeSelectHandler}
        />
        <SnackBar
          message="Question Created"
          open={this.state.notificationQuestion}
          handleClose={this.handleCloseNot}
        />
        <SnackBar
          message="Question Already Exists"
          open={this.state.notificationQuestionFailed}
          handleClose={this.handleCloseNot}
        />
        {this.state.changePassword === true ? (
          <Redirect to="/changepassword" />
        ) : null}
        {this.state.logout === true ? <Redirect to="/login" /> : null}
      </Nav>
    );
  }
}

export default ProfQuestions;
