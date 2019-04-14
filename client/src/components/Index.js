import React, { Component } from "react";
import { connect } from "react-redux";
import { get_questions } from "../actions/CoreActions";

class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount() {
		this.props.get_questions();
	}

	render() {
		return <div>Index</div>;
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = { get_questions };

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Index);
