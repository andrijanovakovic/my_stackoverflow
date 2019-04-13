import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

class PrivateRoute extends React.Component {
	render() {
		return (
			<Route
                path={this.props.path}
                exact={this.props.exact}
                render={() =>
                    this.props.user_authenticated ? (
						<this.props.component />
                    ) : (
						<Redirect
							to={{
								pathname: "/sign_in",
								state: { from: this.props.location },
							}}
						/>

                    )
				}
			/>
		);
	}
}

function mapStateToProps(state) {
	return { user_authenticated: state.auth.user_authenticated };
}

export default connect(mapStateToProps)(PrivateRoute);
