import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Index from "./components/Index";
import About from "./components/About";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import SignOut from "./components/SignOut";
import Navbar from "react-bootstrap/Navbar";
import CreateQuestion from "./components/CreateQuestion";
import MyQuestions from "./components/MyQuestions";
import Nav from "react-bootstrap/Nav";
import { connect } from "react-redux";
import PrivateRoute from './components/PrivateRoute';

class App extends Component {
	render() {
		const user = JSON.parse(localStorage.getItem("user"));
		return (
			<div className="App">
				<Router>
					<div>
						<Navbar bg="light">
							<Navbar.Brand href="/">My Stackoverflow</Navbar.Brand>
							<Nav.Link href="/">Home</Nav.Link>
							<Nav.Link href="/about/">About</Nav.Link>
							{user ? (
								<div style={{ display: "flex", flexDirection: "row" }}>
									<Nav.Link href="/create_question/">Create question</Nav.Link>
									<Nav.Link href="/my_questions/">My questions</Nav.Link>
								</div>
							) : null}
							<Navbar.Collapse className="justify-content-end">
								{user ? (
									<Navbar.Text>
										Signed in with: {user.email},{" "}
										<a href="/sign_out" onClick={() => localStorage.clear()}>
											Sign out
										</a>
									</Navbar.Text>
								) : (
									<div style={{ display: "flex", flexDirection: "row" }}>
										<Nav.Link href="/sign_in/">Sign in</Nav.Link>
										<Nav.Link href="/sign_up/">Sign up</Nav.Link>
									</div>
								)}
							</Navbar.Collapse>
						</Navbar>

						<Route path="/" exact component={Index} />
						<Route path="/about/" exact component={About} />
						<Route path="/sign_in/" exact component={SignIn} />
						<Route path="/sign_up/" exact component={SignUp} />
						<PrivateRoute path="/create_question/" exact component={CreateQuestion} />
						<PrivateRoute path="/my_questions/" exact component={MyQuestions} />
						{/* <PrivateRoute path="/sign_out/" exact component={SignOut} /> */}
					</div>
				</Router>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user_authenticated: state.auth.user_authenticated,
	};
};

const mapDispatchToProps = {};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(App);
