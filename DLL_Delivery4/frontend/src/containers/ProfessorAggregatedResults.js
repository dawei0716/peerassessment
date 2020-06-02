import React, { Component } from "react";
import Moment from "moment";

// HomePage
import ProfessorAggregateResults from "../components/DashboardProfessor/ProfessorAggregateResults";
import ToDOModal from "../components/DashboardProfessor/ModalProfessor";
import CreateModal from "../components/DashboardProfessor/CreateModal";
import DetailedStudentResults from "../components/DashboardProfessor/DetailedStudentResults";
import DetailedTeamResults from "../components/DashboardProfessor/DetailedTeamResults";

import axios from "axios";

// Nav
import Nav from "../components/NavBar";
import SnackBar from "../components/Login/SnackBar";

// redirect
import { Redirect } from "react-router-dom";

class ProfessorAggregatedResults extends Component {
  state = {
    todoSelected: null,
    logout: false,
    changePassword: false,
    notificationRelease: false,
    notificationDownload: false,
    notificationRemind: false,
    message:null,

    allStudents: [],
    allTeams: [],
    selected: localStorage.getItem("selectedAssessmentName"),

    openStudentModal:false,
    detailedStudentResults:[],
    didAssessment:false,
    selectedStudent:null,

    openTeamModal:false,
    detailedTeamResults:[],
    selectedTeam:null,
  };

  // *----------HANDLE MODAL METHODS------------------*
  selectStudentHandler = (e) => {
    console.log(this.state.allStudents[e]);
    this.setState({
      selectedStudent: this.state.allStudents[e],
    });
    //--------------------------------------------------------------
    console.log("student result modal");
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

    axios
      .post(
        "/studentdetailedresults/",
        {
          email: localStorage.getItem("userEmail"),
          type: localStorage.getItem("userType"),
          selectedAssessment: localStorage.getItem("selectedAssessment"),
          selectedUser: this.state.allStudents[e],
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
          this.setState({
              detailedStudentResults: data[0],
              didAssessment: data[1],
              openStudentModal:true,
          });
          console.log(this.state.selectedStudent)

        },
        (error) => {
          console.log(error);
        }
      );

  };

  selectTeamHandler = (e) => {
    console.log(this.state.allTeams[e]);
    this.setState({
      selectedTeam: this.state.allTeams[e],
    });
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

    axios
      .post(
        "/teamdetailedresults/",
        {
          email: localStorage.getItem("userEmail"),
          type: localStorage.getItem("userType"),
          selectedAssessment: localStorage.getItem("selectedAssessment"),
          selectedTeam: this.state.allTeams[e],
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
          this.setState({
              detailedTeamResults: data,
//              didAssessment: data[1],
              openTeamModal:true,
          });
          console.log(this.state.selectedStudent)

        },
        (error) => {
          console.log(error);
        }
      );
  };

  handleClose = () => {
    this.setState({
      openStudentModal: false,
      openTeamModal: false,
    });
  };





  //  *------------ Create Functions -------------*
  releaseResults = () => {
    //--------------------------------------------------------------
    console.log("releaseResults");
    //ADD CODE FOR RELEASING RESULTS
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

    axios
      .post(
        "/releaseresults/",
        {
          selectedAssessment: localStorage.getItem("selectedAssessment"),
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
    //--------------------------------------------------------------

    this.setState({
      notificationRelease: true,
    });
  };

  downloadResults = () => {
      //ADD CODE FOR DOWNLOADING RESULTS
    console.log("download results");
      this.setState({
          notificationDownload: true,
      });
  };

  //  *------------ CLOSE NOTIFICATION ----------------*
  handleCloseNot = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({
      notificationRelease: false,
      notificationDownload: false,
      notificationRemind:false,
    });
  };

  // *------ Remind STUDENT ---------*
  remind = (index) => {
//    this.state.allStudents.splice(index, 1);
    console.log("In remind")
    console.log(index)
    console.log(this.state.allStudents[index])
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

    axios
      .post(
        "/remind/",
        {
          selectedAssessment: localStorage.getItem("selectedAssessment"),
          email: localStorage.getItem("userEmail"),
          type: localStorage.getItem("userType"),
          student: this.state.allStudents[index]
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
          this.setState({
              notificationRemind: true,
              message: "Reminded " + this.state.allStudents[index]["name"]
            });
        },
        (error) => {
          console.log(error);
        }
      );

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

  componentDidMount(){
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

    console.log("View Student Teams");
    //Using axios to write post request to Django server that is handled in requestHandler.py to validate
    axios
      .post(
        "/resultsaggregated/",
        {
          email: localStorage.getItem("userEmail"),
          type: localStorage.getItem("userType"),
          selectedClass: localStorage.getItem("selectedClass"),
          selectedAssessment: localStorage.getItem("selectedAssessment")
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
              allTeams: data[1],
              allStudents: data[0]
          })
        },
        (error) => {
          console.log(error);
        }
      );
  }
  render() {
    //write a get request to get all assessments!!!!!
    //Http Request
    console.log("Load Student Teans");


    //--------------------------------------------------------------------

    return (
      <Nav
        user="Professor"
        changePassword={this.changePassword}
        onLogout={this.onLogout}
      >
        <ProfessorAggregateResults
          students={this.state.allStudents}
          teams={this.state.allTeams}
          releaseResults={this.releaseResults}
          download={this.downloadResults}
          studentRemind={this.remind}
          selected={this.state.selected}
          selectStudent={this.selectStudentHandler}
          selectTeam={this.selectTeamHandler}
          loggedInUser={localStorage.getItem("userEmail")}
          loggedInUserType={localStorage.getItem("userType")}
          selectedAssessment={localStorage.getItem("selectedAssessment")}
        />
        <DetailedStudentResults
            open={this.state.openStudentModal}
            close={this.handleClose}
            detailedStudentResults={this.state.detailedStudentResults}
            info={this.state.selectedStudent}
        />
        <DetailedTeamResults
            open={this.state.openTeamModal}
            close={this.handleClose}
            detailedTeamResults={this.state.detailedTeamResults}
            info={this.state.selectedTeam}
        />
        <SnackBar
          message="Downloading Results"
          open={this.state.notificationDownload}
          handleClose={this.handleCloseNot}
        />

        <SnackBar
          message="Released Results"
          open={this.state.notificationRelease}
          handleClose={this.handleCloseNot}
        />
        <SnackBar
          message={this.state.message}
          open={this.state.notificationRemind}
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

export default ProfessorAggregatedResults;
