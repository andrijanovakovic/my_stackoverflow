import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import FormErrors from "./FormErrors";
import queryString from "query-string";
import { sign_in_user } from "../actions/AuthActions";

class SignIn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formErrors: { data: "" },
			jumbotron_title: "Welcome!",
			identifier: "",
			password: "",
			form_valid: false,
			redirectToReferrer: false,
		};
	}

	componentDidMount() {
		this.check_form_validity();
		const url_search_params = queryString.parse(this.props.location.search);
		if (url_search_params.sign_up_successfull && url_search_params.sign_up_successfull === "true") {
			this.setState({ jumbotron_title: "Welcome, you sign-up was successfull, you can now sign-in!" });
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user_sign_in_data) {
			if (nextProps.user_sign_in_data.success === false) {
				let { formErrors } = this.state;
				formErrors.data = nextProps.user_sign_in_data.reason;
				this.setState({ formErrors });
			} else {
				this.setState({ redirectToReferrer: true });
			}
		}
	}

	handleUserInput(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value }, () => this.check_form_validity());
	}

	check_form_validity() {
		const { identifier, password } = this.state;
		this.setState({ form_valid: identifier !== "" && password.length >= 10 ? true : false });
	}

	submit_data() {
		this.props.sign_in_user(
			{
				identifier: this.state.identifier,
				password: this.state.password,
			},
			this.props.history,
			this.props.location.state || { from: { pathname: "/" } },
		);
	}

	render() {
		let { from } = (this.props.location.state &&
		this.props.location.state.from &&
		this.props.location.state.from.pathname &&
		this.props.location.state.from.pathname.includes("sign_out")
			? { pathname: "/" }
			: this.props.location.state) || {
			from: { pathname: "/" },
		};
		let { redirectToReferrer } = this.state;
		if (redirectToReferrer) return <Redirect to={from ? from : { pathname: "/" }} />;
		return (
			<div>
				<Jumbotron>
					<div style={{ display: "flex", flexDirection: "row" }}>
						<div style={{ flex: 1 }}>
							<h1>{this.state.jumbotron_title}</h1>
							<p>Use your email/username and password to sign in!</p>
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
						<Form.Group controlId="identifier">
							<Form.Label>Username or Email</Form.Label>
							<Form.Control
								type="text"
								placeholder="Username or Email"
								ref="identifier"
								name="identifier"
								required
								onChange={(event) => this.handleUserInput(event)}
							/>
						</Form.Group>

						<Form.Group controlId="password">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								ref="password"
								name="password"
								required
								onChange={(event) => this.handleUserInput(event)}
							/>
						</Form.Group>

						<Button variant="light" style={{ width: "100%" }} disabled={!this.state.form_valid} onClick={() => this.submit_data()}>
							{this.props.user_sign_in_loading ? (
								<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" style={{ marginRight: 5 }} />
							) : null}
							Sign in!
						</Button>
					</Form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user_authenticated: state.auth.user_authenticated,
		user_sign_in_loading: state.auth.user_sign_in_loading,
		user_sign_in_data: state.auth.user_sign_in_data,
		user_sign_in_error: state.auth.user_sign_in_error,
	};
};

const mapDispatchToProps = {
	sign_in_user,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(SignIn);
