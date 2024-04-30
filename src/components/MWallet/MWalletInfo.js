import React from "react"
import Validate from "../../helpers/Validate";
import CloseIcon from '../../images/cross.svg';
import { Button } from "react-bootstrap";
const MWalletInfo = props => {

    const validate = Validate();
    const imagePath = validate.isNotEmpty(props.MWalletInfo.imagePathListStr) ? props.MWalletInfo.imagePathListStr :
        'https://static1.medplusindia.com:666/displayprescriptionimages/static6/2023/0322/P_W_23a5b1941693be11281c344ab3b2f943.png';
    const transferDetails = props.MWalletInfo.transferDetails.split(",");

    return (
        <React.Fragment>
            <div className="header bg-white height100vh custom-modal">
                <div class="row no-gutters m-0 "></div>
                <div className="d-flex justify-content-between border-bottom mb-3">
                    <h6 className="title m-3"> MWallet Account Details:</h6>
                    <Button variant=" " onClick={() => props.setShowMWalletDetails(false)} className="rounded-5 btn-link">
                    <span className='custom-close-btn icon-hover'></span>
                    </Button>
                </div>
                {validate.isNotEmpty(transferDetails) && transferDetails.map(each => {
                    return (
                        <React.Fragment>
                            {validate.isNotEmpty(each) && <p>{each}</p>}
                        </React.Fragment>
                    )
                })}
                {/*  {validate.isEmpty(props.MWalletInfo.imagePathListStr) && <h6>No Image Found</h6>}
                {validate.isNotEmpty(props.MWalletInfo.imagePathListStr) && <img src = {props.MWalletInfo.imagePathListStr} ></img>} */}

                {<img src={imagePath} />}
            </div>

        </React.Fragment>
    )
}

export default MWalletInfo;