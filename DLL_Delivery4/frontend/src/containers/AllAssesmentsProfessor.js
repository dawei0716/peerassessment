import React, { Component } from "react";
import Moment from "moment";

// HomePage
import Assessments from "../components/DashboardProfessor/AllAssesments";
import ToDOModal from "../components/DashboardProfessor/ModalProfessor";
import CreateModal from "../components/DashboardProfessor/CreateModal";
import axios from "axios";

// Nav
import Nav from "../components/NavBar";
import SnackBar from "../components/Login/SnackBar";

// redirect
import { Redirect } from "react-router-dom";

class StudentHome extends Component {
  state = {
    selectedAssessment: false,
    selected: null,
    selectedIndex: null,
    //Modal Related for Update Deadline
    openToDoModal: false,
    todoSelected: null,
    toDoIndex: null,
    todoResponses: null,
    logout: false,
    createModal: false,
    changePassword: false,
    notification: false,
    //Assessment info
    assessmentName: null,
    assessmentStartDate: null,
    assessmentDueDate: null,
    allAssessments: [],
    closedAssessments:[],
    //ran request in render
    ranRequest: false
  };


  selectAssessmentHandler = (e) => {
    //add to local storage the class selected
    console.log("selectedClass");
    console.log(this.state.closedAssessments[e]);
    this.setState({
      selectedAssessment: true,
      selected: this.state.closedAssessments[e],
      selectedIndex: e,
    });
    localStorage.setItem("selectedAssessment", this.state.closedAssessments[e].pk);
    localStorage.setItem("selectedAssessmentName", this.state.closedAssessments[e].fields.assessment_name);
    //        localStorage.setItem('selectedClass', this.state.classes[e])
    console.log(localStorage.getItem("selectedAssessment"));
  };


  // *----------HANDLE MODAL METHODS------------------*
  openModalHandler = (e) => {
    this.setState({
      openToDoModal: true,
      todoSelected: this.state.allAssessments[e],
      toDoIndex: e,
    });
  };

  handleClose = () => {
    this.setState({
      openToDoModal: false,
      createModal: false,
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

  //  *------------Assessment Create Functions -------------*
  submitNewHandler = () => {
    //adds assessment to all assessments

    //Http Request
    console.log("Add Assessment");

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

    console.log("Add assessment request");
    //Using axios to write post request to Django server that is handled in requestHandler.py to validate
    axios
      .post(
        "/addassessmentreq/",
        {
          name: this.state.assessmentName,
          startDate: this.state.assessmentStartDate,
          dueDate: this.state.assessmentDueDate,
          email: localStorage.getItem("userEmail"),
          type: localStorage.getItem("userType"),
          selectedClass: localStorage.getItem("selectedClass"),
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
          var a = JSON.parse(data)
//          console.log(a)
//          console.log(a[0])
          this.state.allAssessments.push(a[0]);
          this.setState({
//              allAssessments: JSON.parse(data),
              ranRequest: true
          })
//          console.log(this.state.allAssessments)
        },
        (error) => {
          console.log(error);
        }
      );

//    this.state.allAssessments.push({
//      "fields": {
//        "assessment_name": this.state.assessmentName,
//        "start_date": this.state.assessmentStartDate,
//        "due_date": this.state.assessmentDueDate,
//      }
//    });

    this.setState({
      assessmentName: null,
      assessmentStartDate: null,
      assessmentDueDate: null,
      createModal: false,
      notification: true,
    });
  };

  //  *------------Submit ToDo Functions -------------*
  submitToDoHandler = () => {
    //Http Request
    console.log("Submit Todo Modal");
    console.log(this.state.assessmentDueDate)
    console.log(this.state.todoSelected)
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

    console.log("To Grade Modal request");
    console.log("this.state.toDoIndex: " + this.state.toDoIndex);
    console.log("this.state.todoSelected: " + this.state.todoSelected);
    //Using axios to write post request to Django server that is handled in requestHandler.py to validate
    axios
      .post(
        "/professordeadlineupdate/",
        {
          toDoIndex: this.state.toDoIndex,
//          todoSelected: this.state.todoSelected,
          pk: this.state.todoSelected.pk,
          email: localStorage.getItem("userEmail"),
          dueDate: this.state.assessmentDueDate,
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
          var a = JSON.parse(data)
          this.state.allAssessments[this.state.toDoIndex]=a[0];
          console.log(this.state.allAssessments);
        },
        (error) => {
          console.log(error);
        }
      );
//    this.state.closedAssessments.splice(this.state.toDoIndex, 1);

    this.setState({
      openToDoModal: false,
      createModal: false,
      toDoIndex: null,
      todoSelected: null,
      ranRequest: false
    });
  };

  //  *------------ CLOSE NOTIFICATION ----------------*
  handleCloseNot = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({
      notification: false,
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
    console.log("Load assessments");

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

        console.log("View assessments page");
        console.log(localStorage);
        //Using axios to write post request to Django server that is handled in requestHandler.py to validate
        axios
          .post(
            "/assessmentview/",
            {
              email: localStorage.getItem("userEmail"),
              type: localStorage.getItem("userType"),
              selectedClass: localStorage.getItem("selectedClass"),
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
              this.setState({
                  allAssessments: JSON.parse(data[0]),
                  closedAssessments: JSON.parse(data[1]),
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
        user="Professor"
        onLogout={this.onLogout}
        changePassword={this.changePassword}
      >
        <Assessments
          closedAssessments={this.state.closedAssessments}
          assessments={this.state.allAssessments}
          openModal={this.openModalHandler}
          openCreate={this.openCreateModal}
          selectAssessment={this.selectAssessmentHandler}
          selectClosedAssessment={this.selectAssessmentHandler}
        />

        <ToDOModal
          close={this.handleClose}
          open={this.state.openToDoModal}
          info={this.state.todoSelected}
          assessmentDueDate={this.state.assessmentDueDate}
          onChangeHandler={this.textHandler}
          submit={this.submitToDoHandler}
          type = "assessmentUpdate"
        />

        <CreateModal
          close={this.handleClose}
          open={this.state.createModal}
          onChangeHandler={this.textHandler}
          assessmentName={this.state.assessmentName}
          assessmentStartDate={this.state.assessmentStartDate}
          assessmentDueDate={this.state.assessmentDueDate}
          submit={this.submitNewHandler}
          type="assessment"
        />

        <SnackBar
          message="Assessment Created"
          open={this.state.notification}
          handleClose={this.handleCloseNot}
        />
        {this.state.selectedAssessment === true ? (
          <Redirect to="/professorHome/aggregatedresults" />
        ) : null}
        {this.state.changePassword === true ? (
          <Redirect to="/changepassword" />
        ) : null}
        {this.state.logout === true ? <Redirect to="/login" /> : null}
      </Nav>
    );
  }
}

export default StudentHome;
