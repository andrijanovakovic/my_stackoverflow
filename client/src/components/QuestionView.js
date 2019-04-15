import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import flow from "lodash/flow";
import "react-toastify/dist/ReactToastify.css";
import { get_question_details, add_answer_to_question, accept_this_answer, add_comment_to_answer } from "../actions/CoreActions";
import Spinner from "react-bootstrap/Spinner";
import moment from "moment";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

class QuestionView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			question_details_loading: true,
			question_details_data: [],
			redirectToLogin: false,
			answer: "",
		};
	}

	componentWillMount() {
		this.props.get_question_details(this.props.match.params.id);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.question_details_data && nextProps.question_details_data.success) {
			this.setState({ question_details_data: nextProps.question_details_data.question, question_details_loading: false });
		}
	}

	handleUserInput(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value });
	}

	handleUserCommentInput(e, id) {
		const value = e.target.value;
		this.setState({ [`comment_value_for_answer_with_id__${id}`]: value });
	}

	add_comment_to_answer(answer_id) {
		const comment_value = this.state[`comment_value_for_answer_with_id__${answer_id}`];
		if (comment_value && comment_value !== "") {
			this.props.add_comment_to_answer(answer_id, comment_value, this.props.match.params.id, () => {
				this.props.get_question_details(this.props.match.params.id);
			});
		}
	}

	render_comments(comments = []) {
		return comments.map((comment, index) => {
			return (
				<div key={index} style={{ paddingLeft: "2rem", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
					<div>
						<code>{comment.user.username}</code>&nbsp; commented &nbsp;
						<p style={{ display: "inline-block" }}>{comment.value}</p>
					</div>
					<div style={{ textAlign: "right" }}>
						<p style={{ display: "inline-block", textAlign: "right" }}>
							{moment(comment.createdAt).fromNow()} ({moment(comment.createdAt).format("DD. MMM. YYYY HH:MM:ss")})
						</p>
					</div>
				</div>
			);
		});
	}

	render_answers() {
		if (this.state.question_details_data.answers && this.state.question_details_data.answers.length !== 0) {
			return this.state.question_details_data.answers.map((a, index) => {
				return (
					<div style={{ width: "70%", background: "#E9ECEF", padding: "10px", marginBottom: "10px" }} key={index}>
						<div
							className={"question_main_container"}
							style={{ width: "100%" }}
							onClick={() =>
								this.props.accept_this_answer(a, () => {
									this.props.get_question_details(this.props.match.params.id);
								})
							}
						>
							<div>
								<h5>{a.value}</h5>
								<h6>
									Posted by <code>{a.user.username}</code>
								</h6>
								{a.accepted ? <h6 style={{ color: "#90ee90" }}>Accepted</h6> : null}
							</div>
							<div>
								Posted {moment(a.createdAt).fromNow()} ({moment(a.createdAt).format("DD. MMM. YYYY HH:MM:ss")})
							</div>
						</div>
						<div style={{ marginBottom: "1rem" }}>{this.render_comments(a.comments)}</div>
						{this.props.user_authenticated ? (
							<InputGroup size="sm">
								<FormControl
									onChange={(e) => this.handleUserCommentInput(e, a._id)}
									placeholder="Add comment"
									aria-label="Comment"
									aria-describedby="basic-addon1"
								/>
								<InputGroup.Append>
									<Button
										variant="outline-primary"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											this.add_comment_to_answer(a._id);
										}}
									>
										Add comment
									</Button>
								</InputGroup.Append>
							</InputGroup>
						) : null}
					</div>
				);
			});
		} else {
			return <div className={"question_main_container"}>No answers yet...</div>;
		}
	}

	submit_data() {
		if (this.state.answer !== "") {
			this.props.add_answer_to_question(this.state.question_details_data._id, this.state.answer, () => {
				this.props.get_question_details(this.props.match.params.id);
			});
		} else {
			toast.error("Please fill in the answer field.", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: false,
				pauseOnHover: false,
				draggable: false,
			});
		}
	}

	render_answer_form() {
		if (this.props.user_authenticated) {
			return (
				<Jumbotron style={{ width: "100%", marginBottom: "0px", display: "flex", flexDirection: "column", alignItems: "center" }}>
					<h1>Add your answer</h1>
					<Form style={{ width: "70%", marginTop: "10px" }}>
						<Form.Group controlId="answer">
							<Form.Control
								required
								as="textarea"
								rows="5"
								placeholder="Answer"
								ref="answer"
								name="answer"
								onChange={(event) => this.handleUserInput(event)}
							/>
						</Form.Group>

						<Button variant="light" style={{ width: "100%" }} onClick={() => this.submit_data()}>
							{this.props.create_question_loading ? (
								<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" style={{ marginRight: 5 }} />
							) : null}
							Add your answer!
						</Button>
					</Form>
				</Jumbotron>
			);
		} else {
			return (
				<h3>
					<a
						href=""
						onClick={(e) => {
							e.preventDefault();
							this.setState({ redirectToLogin: true });
						}}
					>
						Sign-in
					</a>{" "}
					to add your answer or comment!
				</h3>
			);
		}
	}

	render_accepted_answer() {
		if (this.state.question_details_data.answers && this.state.question_details_data.answers.length !== 0) {
			return this.state.question_details_data.answers.map((a, index) => {
				if (a.accepted) {
					return (
						<div key={index} className={"question_main_container"} style={{ background: "#90ee90" }}>
							<div>
								<h5>{a.value}</h5>
								<h6>{a.user.username}</h6>
							</div>
							<div>Posted {moment(a.createdAt).fromNow()}</div>
						</div>
					);
				}
				return null;
			});
		} else {
			return null;
		}
	}

	render() {
		if (this.state.redirectToLogin) {
			return (
				<Redirect
					to={{
						pathname: "/sign_in/",
						state: { from: this.props.location },
					}}
				/>
			);
		}
		if (this.props.question_details_loading || this.state.question_details_loading) {
			return (
				<div>
					<Jumbotron>
						<div style={{ display: "flex", flexDirection: "row" }}>
							<div style={{ flex: 1 }}>
								<h1>Loading question details...</h1>
							</div>
						</div>
					</Jumbotron>{" "}
					<div style={{ width: "100%", textAlign: "center" }}>
						<Spinner animation="grow" />
					</div>
				</div>
			);
		}
		const { question_details_data } = this.state;
		return (
			<div>
				<Jumbotron style={{ margin: 0 }}>
					<div style={{ display: "flex", flexDirection: "row" }}>
						<div style={{ flex: 1 }}>
							<h1>{question_details_data.title}</h1>
							<p>{question_details_data.description}</p>
						</div>
						<div style={{ flex: 1, textAlign: "right" }}>
							<p style={{ padding: 0, margin: 0 }}>
								Answer count: {question_details_data.answers.length} {question_details_data.answers.length === 1 ? "answer" : "answers"}
							</p>
							Posted by:&nbsp;
							<code
								className={"tag"}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									this.props.history.push("/a/" + question_details_data.user._id);
								}}
							>
								{question_details_data.user.username}
							</code>
							<p style={{ padding: 0, margin: 0 }}>Posted {moment(question_details_data.createdAt).fromNow()}</p>
							<p style={{ padding: 0, margin: 0 }}>{moment(question_details_data.createdAt).format("DD. MMM. YYYY HH:MM:ss")}</p>
						</div>
					</div>
				</Jumbotron>
				<div className={"index_main_container"}>
					{this.state.question_details_data.answers.length !== 0 ? (
						<div style={{ width: "70%" }}>
							<h5 style={{ textAlign: "left" }}>Accepted answer</h5>
						</div>
					) : null}

					{this.render_accepted_answer()}
				</div>
				<div className={"index_main_container"}>
					<div style={{ width: "70%" }}>
						<h5 style={{ textAlign: "left" }}>All answers</h5>
					</div>
					{this.render_answers()}
				</div>
				<div className={"main_form_container"} style={{ marginBottom: 0 }}>
					{this.render_answer_form()}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		question_details_data: state.core.question_details_data,
		question_details_loading: state.core.question_details_loading,
		question_details_fail: state.core.question_details_fail,
		user_authenticated: state.auth.user_authenticated,
	};
};

const mapDispatchToProps = { get_question_details, add_answer_to_question, accept_this_answer, add_comment_to_answer };

const combinedHOC = flow(
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
	withRouter,
);

export default combinedHOC(QuestionView);
