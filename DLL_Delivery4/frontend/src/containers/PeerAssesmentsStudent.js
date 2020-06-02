import React, { Component } from "react";
import Moment from "moment";

// HomePage
import Assesments from "../components/DashboardStudent/Assesments";
import ToDOModal from "../components/DashboardStudent/SubmitModal";
import axios from "axios";

// Nav
import Nav from "../components/NavBar";

// redirect
import { Redirect } from "react-router-dom";

const assesmentsToDo = [
  {
    name: "Delivery 6 Assesments",
    teamMates: ["Pedro", "John", "Adam"],
    dueDate: new Date(),
    id: 12312,
  },
];

const assesmentsClosed = [
  {
    name: "Delivery 5 Assesments",
    teamMates: ["Pedro", "John", "Adam"],
    dueDate: Moment(new Date()).subtract(10, "days").calendar(),
    id: 12312,
  },
];

class StudentHome extends Component {
  state = {
    openToDoModal: false,
    todoSelected: null,
    toDoIndex: null,
    todoResponses: null,
    teamMembers:[],
    questionsMC:[],
    questionsOR:[],
    answers:{},
    submittable: false,

    logout: false,
    changePassword: false,
    disableSubmit: false,
    currAssessments: [],
    pastAssessments:[],

    ranRequest: false

  };

  // *----------HANDLE MODAL METHODS------------------*
  openModalHandler = (e) => {
    console.log(this.state.currAssessments[e]);
    console.log("open diag")
    console.log(e);
    this.setState({
      openToDoModal: true,
      todoSelected: this.state.currAssessments[e],
      toDoIndex: e,
    });
  };

  handleClose = () => {
    this.setState({
      openToDoModal: false,
    });
  };

  updateValue = (id, value) => {
    var items = id.split('_')
    if (items.length == 2) {
      var nameId = items[0];
      var ansId = items[1];
      var ans = this.state.answers;
      if (!(nameId in ans)) {
        ans[nameId] = {}
      }
      ans[nameId][ansId] = value;
      this.setState({
        answers: ans
      });
    }
    this.checkSubmittable()
  };

  // *------------ HANDLE CHANGE TEXT ----------------*
  textHandler = (e) => {
    this.updateValue(e.target.id, e.target.value);
  };

  sliderHandler = (e, val) => {
    for (var p in e.path) {
      if (e.path[p].id != "") {
        this.updateValue(e.path[p].id, val);
        return;
      }
    }
  };

  checkSubmittable = () => {
    if(this.submittable==true){
        return
    }
    //check each user in the answers object. Check if size = questionsMC.length+questionsOR.length
    var qLength = this.state.questionsMC.length+this.state.questionsOR.length
    var submitState = true
    if(Object.keys(this.state.answers).length != this.state.teamMembers.length){
        submitState = false
    }
    else{
        for (var x in this.state.answers){
            if(Object.keys(this.state.answers[x]).length != qLength){
                submitState = false
                break
            }
        }
    }
    this.setState({
        submittable: submitState
    })
  }

  //  *------------Submit ToDo Functions -------------*
  submitGradeHandler = (e) => {
    //Http Request
    console.log("Submit student assessment Modal");
    console.log(this.state)
    console.log(e)

    //--------------------------------------------------------------------
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
    //--------------------------------------------------------------------

    console.log("Student Grade Modal request");
    console.log("this.state.toDoIndex: " + this.state.toDoIndex);
    console.log("this.state.todoSelected: " + this.state.todoSelected);
    //Using axios to write post request to Django server that is handled in requestHandler.py to validate
    axios
      .post(
        "/studentgrade/",
        {
          answers: this.state.answers,
          toDoIndex: this.state.toDoIndex,
          todoSelected: this.state.todoSelected,
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
        },
        (error) => {
          console.log(error);
        }
      );
//    assesmentsToDo.splice(this.state.toDoIndex, 1);

    this.setState({
      openToDoModal: false,
      toDoIndex: null,
      todoSelected: null,
    });
  };

  changePassword = () => {
    console.log("changepwd");
    this.setState({
      changePassword: true,
    });
  };

  // LOGOUT
  onLogout = () => {
    console.log("here");
    this.setState({
      logout: true,
    });
  };

  render() {
    //write a get request to get all assessments!!!!!
    //Http Request
    console.log("Load Student Peer Assessments");

    //--------------------------------------------------------------------
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
    if(!this.state.ranRequest){

        //get csrf token in order to not have request blocked
        var csrftoken = getCookie("csrftoken");
        //--------------------------------------------------------------------

        console.log("View Student Peer Assessments");
        //Using axios to write post request to Django server that is handled in requestHandler.py to validate
        axios
          .post(
            "/studentpeerassessments/",
            {
              email: localStorage.getItem("userEmail"),
              type: localStorage.getItem("userType"),
              studentSelectedClass: localStorage.getItem("studentSelectedClass")
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
              console.log(response.data);
              console.log(data[2])
              this.setState({
                  currAssessments: JSON.parse(data[0]),
                  pastAssessments: JSON.parse(data[1]),
                  teamMembers: data[2],
                  questionsMC: JSON.parse(data[3]),
                  questionsOR: JSON.parse(data[4]),
                  ranRequest: true
              })

            },
            (error) => {
              console.log(error);
            }
          );
    }
    //--------------------------------------------------------------------

    return (
      <Nav
        user="Student"
        onLogout={this.onLogout}
        changePassword={this.changePassword}
      >
        <Assesments
          currAssessments={this.state.currAssessments}
          pastAssessments={this.state.pastAssessments}
          openModal={this.openModalHandler}
        />

        <ToDOModal
          close={this.handleClose}
          open={this.state.openToDoModal}
          info={this.state.todoSelected}
          teamMembers={this.state.teamMembers}
          questionsMC={this.state.questionsMC}
          questionsOR={this.state.questionsOR}
          submit={this.submitGradeHandler}
          disable={this.state.disableSubmit}
          onTextChangeHandler={this.textHandler}
          onSliderChangeHandler={this.sliderHandler}
          submittable={this.state.submittable}
        />
        {this.state.changePassword === true ? (
          <Redirect to="/changepassword" />
        ) : null}
        {this.state.logout === true ? <Redirect to="/login" /> : null}
      </Nav>
    );
  }
}

export default StudentHome;
