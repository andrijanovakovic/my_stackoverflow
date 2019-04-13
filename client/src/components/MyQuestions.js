import React, { Component } from "react";
import { connect } from "react-redux";

class MyQuestions extends Component {
	render() {
		return <div>MyQuestions</div>;
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(MyQuestions);
