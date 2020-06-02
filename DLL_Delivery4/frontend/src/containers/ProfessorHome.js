import React, { Component } from "react";
import { Redirect } from "react-router-dom";

// HomePage
import HomePage from "../components/DashboardProfessor/ProfessorHome";
import axios from "axios";

// Nav
import Nav from "../components/NavBar";

class ProfessorHome extends Component {

  state = {
    logout: false,
    changePassword: false,
    selectedClass: false,
    selected: null,
    selectedIndex: null,
    classes: [],
    email: localStorage.getItem("userEmail"),
    type: localStorage.getItem("userType"),
  };

  selectClassHandler = (e) => {
    //add to local storage the class selected
    console.log("selectedClass");
    console.log(this.state.classes[e]);
    this.setState({
      selectedClass: true,
      selected: this.state.classes[e],
      selectedIndex: e,
    });
    localStorage.setItem("selectedClass", this.state.classes[e].pk);
    //        localStorage.setItem('selectedClass', this.state.classes[e])
    console.log(localStorage.getItem("selectedClass"));
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

  getClasses = () => {
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

    console.log("View prof homepage");
    //        let data;
    //Using axios to write post request to Django server that is handled in requestHandler.py to validate
    axios
      .post(
        "/professorhomepage/",
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
          console.log(data);
          return data;
          //              console.log(this.state.loadClasses)
        },
        (error) => {
          console.log(error);
        }
      );
    //        return data
  };

  componentDidMount() {
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

    console.log("View prof homepage");
    //Using axios to write post request to Django server that is handled in requestHandler.py to validate
    axios
      .post(
        "/professorhomepage/",
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
          console.log(this.classes);
          this.setState({
            classes: JSON.parse(data),
          });
          //              console.log(this.state.loadClasses)
        },
        (error) => {
          console.log(error);
        }
      );
    console.log("Out of request");
  }
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

    //--------------------------------------------------------------------
    //        if(localStorage.getItem('selectedClass')!=null){
    //            this.setState({
    //                user:false
    //            })
    //        }

    return (
      <Nav
        user="ProfessorHome"
        changePassword={this.changePassword}
        onLogout={this.onLogout}
      >
        <HomePage
          classes={this.state.classes}
          selectClass={this.selectClassHandler}
        />
        {this.state.selectedClass === true ? (
          <Redirect to="/professorHome/assessments" />
        ) : null}
        {this.state.changePassword === true ? (
          <Redirect to="/changepassword" />
        ) : null}
        {this.state.logout === true ? <Redirect to="/login" /> : null}
      </Nav>
    );
  }
}

export default ProfessorHome;
