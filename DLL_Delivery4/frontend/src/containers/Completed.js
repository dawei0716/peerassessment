import React, { Component } from "react";
import Moment from "moment";

// HomePage
import Results from "../components/DashboardStudent/Completed";
import StudentResultModal from "../components/DashboardStudent/StudentResultModal";
import axios from "axios";

// Nav
import Nav from "../components/NavBar";

import { Redirect } from "react-router-dom";

class StudentHome extends Component {
  state = {
    logout: false,
    changePassword: false,
    assessments: [],
    aggregatedResultsMC: [],
    aggregatedResultsOR: [],
    totalScore: null,
    username:null,
    ranRequest: false,

    openToDoModal: false,
    openSelected: null,
    openSelectedIndex: null,
  };

    // *----------HANDLE MODAL METHODS------------------*
  openModalHandler = (e) => {
    console.log(this.state.assessments[e]);
    console.log("open diag")
    console.log(e);
    this.setState({
      openToDoModal: true,
      openSelected: this.state.assessments[e],
      openSelectedIndex: e,
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
        "/studentaggregatedresults/",
        {
          email: localStorage.getItem("userEmail"),
          type: localStorage.getItem("userType"),
          selectedAssessment: this.state.assessments[e],
          aggregatedResultsMC: this.state.aggregatedResultsMC,
          aggregatedResultsOR: this.state.aggregatedResultsOR
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
              aggregatedResultsMC: data[0],
              totalScore: data[1]
          });
        },
        (error) => {
          console.log(error);
        }
      );
  };

  handleClose = () => {
    this.setState({
      openToDoModal: false,
    });
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
  render() {
    //write a get request to get all assessments!!!!!
    //Http Request
    console.log("Load Student Completed Assessments");

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

        console.log("View Student Completed Assessments");
        //Using axios to write post request to Django server that is handled in requestHandler.py to validate
        axios
          .post(
            "/studentcompletedassessments/",
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
              this.setState({
                  assessments: JSON.parse(data[0]),
                  username: data[1],
                  aggregatedResultsMC: data[2],
                  aggregatedResultsOR: data[3],
                  ranRequest: true
              })
              console.log(this.state.aggregatedResultsMC)
              console.log(this.state.aggregatedResultsOR)
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
        <Results
            completedArr={this.state.assessments}
            openModal={this.openModalHandler}
        />
        <StudentResultModal
            close={this.handleClose}
            open={this.state.openToDoModal}
            info={this.state.openSelected}
            name={this.state.username}
            questionsMC={this.state.aggregatedResultsMC}
            questionsOR={this.state.aggregatedResultsOR}
            totalScore={this.state.totalScore}
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
