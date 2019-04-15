import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { register_user } from "../actions/AuthActions";
import { create_question, get_all_available_tags } from "../actions/CoreActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTags from "react-tag-autocomplete";
import "../css/ReactTags.css";

class CreateQuestion extends Component {
	constructor(props) {
		super(props);
		this.state = {
			description: "",
			title: "",
			tags: [],
			available_tags: [],
			redirectToQuestionView: false,
		};
	}

	componentDidMount() {
		this.props.get_all_available_tags();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.all_available_tags_data.tags && nextProps.all_available_tags_data.tags.length !== 0) {
			this.setState({ available_tags: nextProps.all_available_tags_data.tags });
		}
		if (nextProps.create_question_data && nextProps.create_question_data.success) {
			// this.props.history.push("/q/" + nextProps.create_question_data.question._id);
			this.setState({ redirectToQuestionView: true });
		}
	}

	submit_data() {
		const { description, title, tags } = this.state;
		if (description !== "" && title !== "") {
			this.props.create_question({
				title: title,
				description: description,
				tags: tags,
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

	handleDeleteTag(i) {
		const tags = this.state.tags.slice(0);
		tags.splice(i, 1);
		this.setState({ tags });
	}

	handleAdditionTag(tag) {
		const tags = [].concat(this.state.tags, tag);
		this.setState({ tags });
	}

	render() {
		if (this.state.redirectToQuestionView) {
			return <Redirect to={`/q/${this.props.create_question_data.question._id}`} />;
		}
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

						<Form.Group controlId="tags">
							<Form.Label>Tags</Form.Label>
							<ReactTags
								tags={this.state.tags}
								suggestions={this.state.available_tags}
								handleDelete={this.handleDeleteTag.bind(this)}
								handleAddition={this.handleAdditionTag.bind(this)}
								allowNew={true}
								allowBackspace={false}
								style={{ width: "100%" }}
								autofocus={false}
							/>
						</Form.Group>

						<Button variant="light" style={{ width: "100%" }} onClick={() => this.submit_data()}>
							{this.props.create_question_loading ? (
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
		all_available_tags_data: state.core.all_available_tags_data,
		all_available_tags_loading: state.core.all_available_tags_loading,
		create_question_data: state.core.create_question_data,
		create_question_loading: state.core.create_question_loading,
		create_question_fail: state.core.create_question_fail,
	};
};

const mapDispatchToProps = { register_user, create_question, get_all_available_tags };

const CreateQuestionCon = withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps,
	)(CreateQuestion),
);
export default CreateQuestionCon;
