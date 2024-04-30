import React from 'react'
import { UncontrolledTooltip } from "reactstrap";

const DisabledCell = (props) => {

  //Fields that can be passed - [showComponent], [showText], [cellId, cellTooltip]
  //First priority is for [showComponent]

  return (
    <React.Fragment>
        <div id={props.cellId ? `disabledCell_${props.cellId}` : "disabledCell"}>
        {
            props.showComponent
                ? props.showComponent
                : props.showText 
                ? <span className='d-flex justify-content-center'>{props.showText}</span>  
                : null
        }
        </div>
    </React.Fragment>
  )
}

export default DisabledCell;