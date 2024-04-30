import { ClaimButton, UnclaimButton } from '@medplus/react-common-components/DataGrid';
import React from 'react'

const ClaimUnclaimHandler = (props) => {

    const { activeTabId, selectedRecordsLength, claimedSet } = props

    return <React.Fragment>
        {(activeTabId == 2 && selectedRecordsLength) ? <ClaimButton selectedRecords={selectedRecordsLength} handleOnClick={claimedSet} /> : null}
        {(activeTabId == 1 && selectedRecordsLength) ? <UnclaimButton selectedRecords={selectedRecordsLength} handleOnClick={claimedSet} /> : null}
    </React.Fragment>

}

export default ClaimUnclaimHandler;