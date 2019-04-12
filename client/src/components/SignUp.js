import React, { Component } from "react";
import { connect } from "react-redux";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../css/SignUp.css";
import FormErrors from "./FormErrors";
import { register_user } from "../actions/AuthActions";

class SignUp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formErrors: { email: "", password: "", username: "", passwordValid: "" },
			emailValid: false,
			passwordValid: false,
			usernameValid: false,
			formValid: false,
			passwordRepeatValid: false,
		};
	}

	submit_data() {
		this.props.register_user({
			username: this.state.username,
			password: this.state.password,
			email: this.state.email,
		});
	}

	validateField(fieldName, value) {
		let fieldValidationErrors = this.state.formErrors;
		let emailValid = this.state.emailValid;
		let passwordValid = this.state.passwordValid;
		let usernameValid = this.state.usernameValid;
		let passwordRepeatValid = this.state.passwordRepeatValid;

		switch (fieldName) {
			case "username":
				usernameValid = value.length >= 8;
				fieldValidationErrors.username = usernameValid ? "" : " is too short";
				break;
			case "email":
				emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				fieldValidationErrors.email = emailValid ? "" : " is invalid";
				break;
			case "password":
				passwordValid = value.length >= 10;
				fieldValidationErrors.password = passwordValid ? "" : " is too short";
				break;
			case "password_repeat":
				passwordRepeatValid = value === this.state.password ? true : false;
				fieldValidationErrors.passwordRepeat = passwordRepeatValid ? "" : " does not match";
				break;
			default:
				break;
		}
		this.setState(
			{
				formErrors: fieldValidationErrors,
				usernameValid: usernameValid ? true : false,
				emailValid: emailValid ? true : false,
				passwordValid: passwordValid ? true : false,
				passwordRepeatValid: passwordRepeatValid ? true : false,
			},
			this.validateForm,
		);
	}

	handleUserInput(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value }, () => {
			this.validateField(name, value);
		});
	}

	validateForm() {
		this.setState({ formValid: this.state.emailValid && this.state.passwordValid && this.state.usernameValid && this.state.passwordRepeatValid });
	}

	render() {
		return (
			<div>
				<Jumbotron>
					<div style={{ display: "flex", flexDirection: "row" }}>
						<div style={{ flex: 1 }}>
							<h1>Hello there!</h1>
							<p>Welcome to my version of stackoverflow.</p>
							<p>You can start using it in seconds, just fill in the fields below and register.</p>
						</div>
						<div style={{ flex: 1 }}>
							<div
								className="panel panel-default"
								style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}
							>
								<FormErrors formErrors={this.state.formErrors} />
							</div>
						</div>
					</div>
				</Jumbotron>
				<div className={"main_form_container"}>
					<Form style={{ width: "70%" }}>
						<Form.Group controlId="formBasicUsername">
							<Form.Label>Username</Form.Label>
							<Form.Control type="text" placeholder="Username" ref="username" name="username" onChange={(event) => this.handleUserInput(event)} />
							<Form.Text className="text-muted">Username should be at least 8 characters long.</Form.Text>
						</Form.Group>

						<Form.Group controlId="formBasicEmail">
							<Form.Label>Email address</Form.Label>
							<Form.Control type="email" placeholder="Email" ref="email" name="email" onChange={(event) => this.handleUserInput(event)} />
							<Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
						</Form.Group>

						<Form.Group controlId="formBasicPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								ref="password"
								name="password"
								onChange={(event) => this.handleUserInput(event)}
							/>
							<Form.Text className="text-muted">We suggest you to choose a strong password. Minimal length is 10 characters.</Form.Text>
						</Form.Group>

						<Form.Group controlId="formBasicPasswordRepeat">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Repeat password"
								ref="password_repeat"
								name="password_repeat"
								onChange={(event) => this.handleUserInput(event)}
							/>
							<Form.Text className="text-muted">This should match the field above.</Form.Text>
						</Form.Group>

						<Button variant="light" style={{ width: "100%" }} disabled={!this.state.formValid} onClick={() => this.submit_data()}>
							Submit
						</Button>
					</Form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = { register_user };

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(SignUp);
