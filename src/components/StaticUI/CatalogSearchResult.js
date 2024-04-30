import React from 'react'
import { MenuItem } from 'react-bootstrap-typeahead';


const CatalogSearchResult=(props)=> {
  return (
    <MenuItem className="no-gutters p-0">
        <div style={{height:53}} className='d-flex align-items-center w-100 px-3 '>
            <div className='container-fluid row align-items-center mx-0 w-100 p-0'>
                <div className='col text-wrap ps-0'>
                    <p className='mb-0 font-14'>
                        Razo D Cap
                    </p>
                    <small className='text-muted font-12'>
                        Dr. Reddys Laboratory
                    </small>
                </div>
                <div className="col-3 pe-0" style={{"text-align": "right"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g id="rightchevron_black_icon_24px" transform="translate(-906.838 786) rotate(-90)">
                        <rect id="Rectangle_4721" data-name="Rectangle 4721" width="24" height="24" transform="translate(762 906.838)" fill="none"/>
                        <path id="Path_23400" data-name="Path 23400" d="M63.432,503.859l5.4-5.4a1.223,1.223,0,0,0-1.73-1.73l-4.533,4.52-4.533-4.533a1.228,1.228,0,0,0-2.092.865,1.216,1.216,0,0,0,.363.865l5.4,5.411A1.229,1.229,0,0,0,63.432,503.859Z" transform="translate(711.356 418.584)" fill="#080808"/>
                    </g>
                </svg>
                </div>
            </div>
        </div>
        <div className='border-bottom'></div>

    </MenuItem>
  )
}

export default CatalogSearchResult