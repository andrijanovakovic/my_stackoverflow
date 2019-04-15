import React, { Component } from "react";
import { connect } from "react-redux";
import { fetch_my_questions, delete_question } from "../actions/CoreActions";
import moment from "moment";
import Jumbotron from "react-bootstrap/Jumbotron";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

class MyQuestions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			questions_loading: true,
			redirectToLogin: false,
			questions: [],
		};
	}

	componentWillMount() {
		this.props.fetch_my_questions();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.my_questions_loading === false && nextProps.my_questions_data.success) {
			this.setState({ questions_loading: false, questions: nextProps.my_questions_data.questions });
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

	delete_question(question_id) {
        this.props.delete_question(question_id, () => {
            this.props.fetch_my_questions();
        });
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
								Added {moment(q.createdAt).fromNow()} ({moment(q.createdAt).format("DD. MMM. YYYY HH:MM:ss")})
							</p>
							<Button
								style={{ marginTop: 15 }}
								variant="outline-danger"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									this.delete_question(q._id);
								}}
							>
								Delete question
							</Button>
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
							<h1>Your questions</h1>
						</div>
					</div>
				</Jumbotron>
				<div className={"index_main_container"}>{this.render_questions()}</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		my_questions_loading: state.core.my_questions_loading,
		my_questions_data: state.core.my_questions_data,
		my_questions_fail: state.core.my_questions_fail,
	};
};

const mapDispatchToProps = { fetch_my_questions, delete_question };

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(MyQuestions);
