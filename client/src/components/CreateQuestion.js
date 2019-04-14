import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { register_user } from "../actions/AuthActions";
import flow from "lodash/flow";
import { create_question } from "../actions/CoreActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class CreateQuestion extends Component {
	constructor(props) {
		super(props);
		this.state = {
			description: "",
			title: "",
		};
	}

	submit_data() {
		const { description, title } = this.state;
		if (description !== "" && title !== "") {
			this.props.create_question({
				title: title,
				description: description,
			});
		} else {
			toast.error("Please fill in all the fields.", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: false,
				pauseOnHover: false,
				draggable: false,
			});
		}
	}

	handleUserInput(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value });
	}

	render() {
		return (
			<div>
				<Jumbotron>
					<div style={{ display: "flex", flexDirection: "row" }}>
						<div style={{ flex: 1 }}>
							<h1>Create a question!</h1>
						</div>
					</div>
				</Jumbotron>
				<div className={"main_form_container"}>
					<Form style={{ width: "70%" }}>
						<Form.Group controlId="title">
							<Form.Label>Title</Form.Label>
							<Form.Control required type="text" placeholder="Title" ref="title" name="title" onChange={(event) => this.handleUserInput(event)} />
						</Form.Group>

						<Form.Group controlId="description">
							<Form.Label>Description</Form.Label>
							<Form.Control
								required
								as="textarea"
								rows="5"
								placeholder="Description"
								ref="description"
								name="description"
								onChange={(event) => this.handleUserInput(event)}
							/>
						</Form.Group>

						<Button variant="light" style={{ width: "100%" }} onClick={() => this.submit_data()}>
							{this.props.user_sign_up_loading ? (
								<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" style={{ marginRight: 5 }} />
							) : null}
							Create your question!
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
	};
};

const mapDispatchToProps = { register_user, create_question };

const combinedHOC = flow(
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
	withRouter,
);

export default combinedHOC(CreateQuestion);
