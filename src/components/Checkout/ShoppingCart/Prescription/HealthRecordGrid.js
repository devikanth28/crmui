import CommonDataGrid from '@medplus/react-common-components/DataGrid';
import { StackedImages } from '@medplus/react-common-components/DynamicForm';
import { useContext, useState } from 'react';
import DataGridHelper from '../../../../helpers/DataGridHelper';
import Validate from '../../../../helpers/Validate';
import DynamicGridHeight from '../../../Common/DynamicGridHeight';
import { AlertContext } from '../../../Contexts/UserContext';
import AnimationHelpers from '../../../../helpers/AnimationHelpers';

const HealthRecordGrid = (props) => {
    const healthRecordMetadata = DataGridHelper().HealthRecordList();
    const healthRecordsData = props?.healthRecordsData;
    const { setStackedToastContent } = useContext(AlertContext);
    const [healthRecordsAnimation,setHealthRecordsAnimation]=useState(false);

    const validate = Validate();

    const callBackMapping = {
        "renderPresImageColumn": renderPresImageColumn,
        "renderActionColumn": renderActionColumn,
    }

    const selectHealthRecord = (recordId) => {
        setStackedToastContent({ toastMessage: "Selected Health Record ID " + recordId });
        props?.savePrescriptionDetails({ healthRecordId: recordId, ePrescriptionRequired: false });

    }

    function renderActionColumn({ row }) {
        return <input type="radio" name="oldPrescription" className="" checked={props?.healthRecordId == row.recordId} onClick={() => { props?.setIsEPrescSelected(false); selectHealthRecord(row.recordId);setHealthRecordsAnimation(true) }} />
    }

    function renderPresImageColumn(props) {
        const recordImageList = props.row[props.column.key];

        return (
            <div className="pointer">
                <StackedImages includeLightBox images={recordImageList} maxImages="4" setGridImgHeight={true}></StackedImages>
            </div>
        )
    }

    return (
        <>
            {validate.isNotEmpty(healthRecordsData) &&
                <>
                    <label class="d-block pb-0 p-12 font-weight-bold">Select Health Records From List</label>
                    <div className='p-12 pb-0'>
                    {validate.isNotEmpty(props.healthRecordId) && <><p className="font-weight-bold custom-fieldset">Selected Health Record Id</p>
                        <div className="d-flex ">
                            <h5 className={`mt-2 mb-3 ${AnimationHelpers().getBadgeAnimation(" ", healthRecordsAnimation, setHealthRecordsAnimation)}`}><mark className="px-2">{props.healthRecordId}</mark> </h5>
                        </div></>}
                        <div className={`card mb-3 me-0 `}>
                            <DynamicGridHeight id="Records" metaData={healthRecordMetadata} dataSet={[...healthRecordsData]} className="block-size-100 ">
                                <CommonDataGrid {...healthRecordMetadata} dataSet={[...healthRecordsData]} callBackMap={callBackMapping} />
                            </DynamicGridHeight>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default HealthRecordGrid