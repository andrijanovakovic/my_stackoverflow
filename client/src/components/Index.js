import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import { all_available_questions } from "../actions/CoreActions";
import Spinner from "react-bootstrap/Spinner";
import Jumbotron from "react-bootstrap/Jumbotron";
import moment from "moment";
import "../css/IndexComponent.css";
import flow from "lodash/flow";

class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			questions_loading: true,
			redirectToLogin: false,
		};
	}

	componentWillMount() {
		this.props.all_available_questions();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.questions_loading === false && nextProps.questions_data.success) {
			this.setState({ questions_loading: false, questions: nextProps.questions_data.questions });
		}
	}

	render_tags(tags) {
		if (tags) {
			return tags.map((tag, index) => {
				return (
					<div
						key={index}
						className={"tag"}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							this.props.history.push("/t/" + tag.name);
						}}
					>
						{tag.name}&nbsp;
					</div>
				);
			});
		}
	}

	render_questions() {
		if (this.state.questions.length !== 0) {
			return this.state.questions.map((q, index) => {
				return (
					<div key={index} className={"question_main_container"} onClick={() => this.props.history.push("/q/" + q._id)}>
						<div>
							<h4>{q.title}</h4>
							<p className={"question_par_added"}>
								{" "}
								Added {moment(q.createdAt).fromNow()} by{" "}
								<code
									className={"tag"}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										this.props.history.push("/a/" + q.user._id);
									}}
								>
									{q.user.username}
								</code>
							</p>
						</div>
						<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
							<div style={{ display: "flex", flexDirection: "row", marginRight: "2rem" }}>{this.render_tags(q.tags)}</div>
							{q.answers.length} {q.answers.length === 1 ? "answer" : "answers"}
						</div>
					</div>
				);
			});
		} else {
			return <div className={"question_main_container"}>No questions yet...</div>;
		}
	}

	render() {
		if (this.state.redirectToLogin) {
			return (
				<Redirect
					to={{
						pathname: "/sign_in/",
						state: { from: { pathname: "/create_question/" } },
					}}
				/>
			);
		}
		if (this.props.questions_loading || this.state.questions_loading) {
			return (
				<div>
					<Jumbotron>
						<div style={{ display: "flex", flexDirection: "row" }}>
							<div style={{ flex: 1 }}>
								<h1>Loading questions...</h1>
							</div>
						</div>
					</Jumbotron>{" "}
					<div style={{ width: "100%", textAlign: "center" }}>
						<Spinner animation="grow" />
					</div>
				</div>
			);
		}
		return (
			<div>
				<Jumbotron style={{ margin: 0 }}>
					<div style={{ display: "flex", flexDirection: "row" }}>
						<div style={{ flex: 1 }}>
							<h1>Latest questions</h1>
						</div>
					</div>
				</Jumbotron>
				<div className={"index_main_container"}>{this.render_questions()}</div>
				{this.props.user_authenticated ? null : (
					<h3 style={{ textAlign: "center" }}>
						<a
							href=""
							onClick={(e) => {
								e.preventDefault();
								this.setState({ redirectToLogin: true });
							}}
						>
							Sign-in
						</a>{" "}
						to create your question!
					</h3>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		questions_loading: state.core.questions_loading,
		questions_data: state.core.questions_data,
		questions_error: state.core.questions_error,
		user_authenticated: state.auth.user_authenticated,
	};
};

const mapDispatchToProps = { all_available_questions };

const combinedHOC = flow(
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
	withRouter,
);

export default combinedHOC(Index);
