import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			auth === true ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: "/sign_in/",
						state: { from: props.location },
					}}
				/>
			)
		}
	/>
);

PrivateRoute.propTypes = {
	auth: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth.user_authenticated,
	};
};

// export default connect(mapStateToProps)(PrivateRoute);

// const mapDispatchToProps = { register_user, create_question, get_all_available_tags };

const PrivateRouteCon = withRouter(
	connect(
		mapStateToProps,
		// mapDispatchToProps,
	)(PrivateRoute),
);
export default PrivateRouteCon;
