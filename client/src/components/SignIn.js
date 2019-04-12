import React, { Component } from "react";
import { connect } from "react-redux";

class SignIn extends Component {
	render() {
		return <div>SignIn</div>;
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(SignIn);