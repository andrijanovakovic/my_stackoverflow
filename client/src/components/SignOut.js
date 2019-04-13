import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as authActionCreators from "../actions/AuthActions";

class SignOut extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
	};

	componentWillMount() {
		this.props.dispatch(authActionCreators.logout());
	}

	render() {
		return <div>bye bye</div>;
	}
}

export default connect()(SignOut);
