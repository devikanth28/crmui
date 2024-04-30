import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { closeChromeTab } from "../../../helpers/AgentAppHelper";

const CloseChromeTab = (props) => {
	return (
		<div className="d-flex flex-column justify-content-center align-items-center h-100 no-data-found max-height-center">
			{props.displayText && (
				<p className="text-center">{props.displayText}</p>
			)}
			<Button variant="dark" onClick={closeChromeTab}>
				{props.buttonText ? props.buttonText : "Click Me!"}
			</Button>
		</div>
	);
};

CloseChromeTab.propTypes = {
	displayText: PropTypes.string,
	buttonText: PropTypes.string,
};

export default CloseChromeTab;
