import React from "react";
import Alert from 'react-bootstrap/Alert';

class FormErrors extends React.Component {
	render() {
		const { formErrors } = this.props;
		return (
			<div className="formErrors" style={{ width: "70%", textAlign: "center"}}>
				{Object.keys(formErrors).map((fieldName, i) => {
					if (formErrors[fieldName].length > 0) {
						return (
							<Alert variant={"dark"} key={i}>
								{fieldName} {formErrors[fieldName]}
							</Alert>
						);
					} else {
						return "";
					}
				})}
			</div>
		);
	}
}

export default FormErrors;
