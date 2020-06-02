import React, { Component } from "react";
import Moment from "moment";

// HomePage
import Teams from "../components/DashboardProfessor/Teams";
import ToDOModal from "../components/DashboardProfessor/ModalProfessor";
import CreateModal from "../components/DashboardProfessor/CreateModal";
import axios from "axios";
//test 
// Nav
import Nav from "../components/NavBar";
import SnackBar from "../components/Login/SnackBar";

// redirect
import { Redirect } from "react-router-dom";

class ProfTeams extends Component {
  state = {
    openToDoModal: false,
    todoSelected: null,
    todoResponses: null,
    logout: false,
    changePassword: false,
    createModal: false,

    studentName: null,
    teamSelected: null,
    notificationStudent: false,

    teamName: null,
    notificationTeam: false,
    createModalTeam: false,

    allStudents: [],
    allTeams: []
  };

  // *----------HANDLE MODAL METHODS------------------*
  openModalHandler = (e) => {
    console.log(this.state.allStudents[e]);
    this.setState({
      openToDoModal: true,
      todoSelected: this.state.allStudents[e],
    });
  };

  handleClose = () => {
    this.setState({
      openToDoModal: false,
      createModal: false,
      createModalTeam: false,
    });
  };

  openCreateModal = () => {
    this.setState({
      createModal: true,
    });
  };

  openCreateModalTeam = () => {
    this.setState({
      createModalTeam: true,
    });
  };

  // *------------ HANDLE CHANGE TEXT ----------------*
  textHandler = (e) => {
    console.log(e);
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  teamSelectHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  //  *------------ Create Functions -------------*
  submitNewStudentHandler = () => {
    //--------------------------------------------------------------
    console.log("create Student");
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
        "/makenewstudent/",
        {
          name: this.state.studentName,
          team: this.state.teamSelected,
          overallGrade: "0",
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

    this.state.allStudents.push({
      name: this.state.studentName,
      team: this.state.teamSelected,
      overallGrade: "0",
    });

    this.setState({
      allStudents: this.state.allStudents,
      studentName: null,
      teamSelected: null,
      createModal: false,
      notificationStudent: true,
    });
  };

  submitNewTeamHandler = () => {
    //--------------------------------------------------------------
    console.log("create team");
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

    console.log("create team req");
    axios
      .post(
        "/makenewteam/",
        {
          name: this.state.teamName,
          members: [],
          overallGrade: "0",
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

    //Should probably remove this when done
    this.state.allTeams.push({
      name: this.state.teamName,
      members: [],
      overallGrade: "0",
    });

    this.setState({
      teamName: null,
      createModalTeam: false,
      notificationTeam: true,
    });
  };

  //  *------------ CLOSE NOTIFICATION ----------------*
  handleCloseNot = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({
      notificationStudent: false,
      notificationTeam: false,
    });
  };

  // *------ DELETE STUDENT ---------*
  studentDelete = (index) => {
    this.state.allStudents.splice(index, 1);
    this.setState({
      allStudents: this.state.allStudents,
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
        "/studentteams/",
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
//          var teams = JSON.parse(data[0])
//          var students = JSON.parse(data[1])
//          for (student in students){
//               for (team in teams){
//                   this.state.allTeams
//               }
//          }
          this.setState({
              allTeams: data[1],
              allStudents: data[0]
//              allTeams: JSON.parse(data[1]),
//              allStudents: JSON.parse(data[0])
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
        <Teams
          students={this.state.allStudents}
          teams={this.state.allTeams}
          openCreateModalTeam={this.openCreateModalTeam}
          openCreate={this.openCreateModal}
          studentDelete={this.studentDelete}
        />

        {/* Modal Student Create */}
        <CreateModal
          close={this.handleClose}
          open={this.state.createModal}
          onChangeHandler={this.textHandler}
          studentName={this.state.studentName}
          teamSelected={this.state.teamSelected}
          submit={this.submitNewStudentHandler}
          type="student"
          teams={this.state.allTeams}
          teamSelectHandler={this.teamSelectHandler}
        />

        {/* Modal Team Create */}
        <CreateModal
          close={this.handleClose}
          open={this.state.createModalTeam}
          onChangeHandler={this.textHandler}
          teamName={this.state.teamName}
          submit={this.submitNewTeamHandler}
          type="team"
        />

        <SnackBar
          message="Student Created"
          open={this.state.notificationStudent}
          handleClose={this.handleCloseNot}
        />

        <SnackBar
          message="Team Created"
          open={this.state.notificationTeam}
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

export default ProfTeams;
