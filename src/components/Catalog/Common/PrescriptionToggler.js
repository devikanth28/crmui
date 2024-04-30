import React from "react";
import { UncontrolledTooltip } from "reactstrap";

const PrescriptionToggler = (props) => {
    const { showPrescription, handlePrescriptionToggle } = props;

    return (
        <React.Fragment>
            <div className="toggle-prescription" id="toggle-prescription-btn" onClick={handlePrescriptionToggle}>
                <button type="button" className="btn p-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" style={{ transform: `${showPrescription ? 'scaleX(-1)' : 'scaleX(1)'}`, transition: 'transform 0.8s', transformStyle: 'preserve-3d' }}>
                        <g id="flip-container" transform="translate(0 0)">
                            <g transform="matrix(1, 0, 0, 1, -27, -15)" filter="url(#Ellipse_1271)">
                                <circle id="Ellipse_1271-2" data-name="Ellipse 1271" cx="24" cy="24" r="24" transform="translate(27 15)" />
                            </g>
                            <g id="flip-horizontal-icn-24" transform="translate(-168.258 -269.937)">
                                <rect id="Rectangle_3296" data-name="Rectangle 3296" width="24" height="24" rx="3" transform="translate(180.258 281.937)" fill="none" />
                                <g id="flip-horizontal-icn" transform="translate(-208.7 106.937)">
                                    <path id="Path_52368" data-name="Path 52368" d="M5.269,12.117V7.98h0a.564.564,0,0,0-.963-.4L2.622,9.267A5.678,5.678,0,0,1,3.682,1.4.752.752,0,1,0,2.735.257,7.173,7.173,0,0,0,1.547,10.342L.171,11.718a.564.564,0,0,0,.4.962H4.705a.564.564,0,0,0,.564-.564Z" transform="translate(407.646 178) rotate(90)" fill="#fff" />
                                    <g id="Group_36524" data-name="Group 36524" transform="translate(391.957 183.956)">
                                        <path id="Path_52365" data-name="Path 52365" d="M9.777,1.5a.752.752,0,0,0,0-1.5H.752a.752.752,0,0,0,0,1.5Z" transform="translate(9.777 0.722) rotate(90)" fill="#fff" />
                                        <path id="Path_52367" data-name="Path 52367" d="M11.093,0H.941A.94.94,0,0,0,0,.94a.963.963,0,0,0,.331.707l4.76,4.76.075.082h0a.932.932,0,0,0,.662.278.955.955,0,0,0,.639-.248l5.264-4.881h0A.94.94,0,0,0,11.093,0Z" transform="translate(18.049 0) rotate(90)" fill="#fff" />
                                        <path id="Path_52371" data-name="Path 52371" d="M5.091,6.407l.075.082a.932.932,0,0,0,.662.278.952.952,0,0,0,.639-.248l5.264-4.881A.94.94,0,0,0,11.092,0H.94A.94.94,0,0,0,0,.94a.963.963,0,0,0,.331.707Zm5.527-5.264L5.843,5.565,1.4,1.128Z" transform="translate(0 12.044) rotate(-90)" fill="#fff" />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                </button>
            </div>
            <UncontrolledTooltip placement="bottom" target="toggle-prescription-btn">
                {showPrescription ? "Hide Prescription" : "Show Prescription"}
            </UncontrolledTooltip>
        </React.Fragment>
    );
};

export default PrescriptionToggler;