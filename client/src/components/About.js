import React, { Component } from "react";
import { connect } from "react-redux";

class About extends Component {
	render() {
		return <div>About</div>;
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(About);
