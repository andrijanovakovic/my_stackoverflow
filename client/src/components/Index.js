import React, { Component } from "react";
import { connect } from "react-redux";

class Index extends Component {
	render() {
		return <div>Index</div>;
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Index);