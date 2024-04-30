import {useState} from "react";
import { UncontrolledCollapse } from "reactstrap";

const MoleculeInfo = (props) => {

    const events = ['click'];
    const [currentlyopened , setCurrentlyOpened] = useState([])
    const data = props.moleculeData

    const handleOpen = (index) =>{
        if(!currentlyopened.includes('molecule'+index)) {
            setCurrentlyOpened([...currentlyopened, 'molecule'+index]);
        } else {
            setCurrentlyOpened(currentlyopened.filter(molecule => molecule != 'molecule'+index));
        }
    }

    return (
        <>
            {Object.keys(data[0]).map((key,index) => {
                return (
                    <>
                        <section className="border mb-3 rounded ">
                            <p className="mb-0 p-2 d-flex align-items-center justify-content-between question-hover" onClick={(e) => {handleOpen(index)}} id={'molecule' + index} title="Click to open answer">
                                {key}
                                <span>
                                    <svg className={ currentlyopened.includes('molecule'+index)  ? "collapse-arrow rotate-bottom-half" : "collapse-arrow up-half"} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                        <g transform="translate(884.477 -762) rotate(90)">
                                            <rect fill="none" width="16" height="16" transform="translate(762 868.477)" />
                                            <path fill="#343a40" d="M59.879,465.752l-3.694,3.694a.837.837,0,1,0,1.184,1.184l3.1-3.093,3.1,3.1a.84.84,0,0,0,1.432-.592.832.832,0,0,0-.248-.592l-3.7-3.7A.84.84,0,0,0,59.879,465.752Z" transform="translate(709.685 408.091)" />
                                        </g>
                                    </svg>
                                </span>
                            </p>
                            <div className="collapse-container">
                                <UncontrolledCollapse toggler={'#molecule' + index} toggleEvents={events}>
                                    <p className="mb-0 border-top p-2">{data[0][key]}</p>
                                </UncontrolledCollapse>
                            </div>
                        </section>
                    </>
                )
                }
            )}
        </>
    )
}
export default MoleculeInfo