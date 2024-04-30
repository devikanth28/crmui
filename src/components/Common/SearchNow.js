import React from "react";
import SearchImage from '../../images/Search-pana.svg'
import { Button } from "react-bootstrap";

const SeachNow = (props) => {

    const loadPage = () => {
        window.location.replace(window.location.pathname);
    }

    return (
        <React.Fragment>
            <div className="d-flex justify-content-center align-items-center h-100 max-height-center">
                <div className="text-center">
                    <img src={SearchImage} className="img-fluid" alt={"Search Image"} />
                    <p className="mb-0 text-secondary mt-4">{(props && props.message)?props.message:'To see the expected results, search your queries!'}</p>
                    <Button variant="dark" className="mt-3" onClick={() => loadPage()}>Search Now</Button>
                </div>
            </div>
        </React.Fragment>
    )
}
export default SeachNow