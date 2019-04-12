import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Index from "./components/Index";
import About from "./components/About";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { connect } from "react-redux";

class App extends Component {
	render() {
		return (
			<div className="App">
				<Router>
					<div>
						<Navbar bg="light">
							<Navbar.Brand href="/">My Stackoverflow</Navbar.Brand>
							<Nav.Link href="/">Home</Nav.Link>
							<Nav.Link href="/about/">About</Nav.Link>
							<Navbar.Collapse className="justify-content-end">
								{this.props.authenticated ? (
									<Navbar.Text>
										Signed in as: <a href="#login">authenticated = true</a>
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
					</div>
				</Router>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		authenticated: state.auth.authenticated,
	};
};

const mapDispatchToProps = {};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(App);
