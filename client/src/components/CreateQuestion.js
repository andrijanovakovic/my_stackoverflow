import React, { Component } from "react";
import { connect } from "react-redux";

class CreateQuestion extends Component {
	render() {
		return <div>CreateQuestion</div>;
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CreateQuestion);