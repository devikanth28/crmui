import React from "react";
import dateFormat from "dateformat";

const CatalogTimeSlotsMoule = () => {


    const labSlots = {        
            "2024-03-01": [
                {
                    "slotId": 10,
                    "name": null,
                    "displayName": "06:00 AM - 07:00 AM",
                    "fromTime": "6:00",
                    "toTime": "6:59",
                    "fullFromTime": "06:00",
                    "fullToTime": "06:59"
                },
                {
                    "slotId": 1,
                    "name": "7:00 AM - 8:00 AM",
                    "displayName": "07:00 AM - 08:00 AM",
                    "fromTime": "7:00",
                    "toTime": "7:59",
                    "fullFromTime": "07:00",
                    "fullToTime": "07:59"
                },
                {
                    "slotId": 2,
                    "name": "8:00 AM - 9:00 AM",
                    "displayName": "08:00 AM - 09:00 AM",
                    "fromTime": "8:00",
                    "toTime": "8:59",
                    "fullFromTime": "08:00",
                    "fullToTime": "08:59"
                },
                {
                    "slotId": 3,
                    "name": "9:00 AM - 10:00 AM",
                    "displayName": "09:00 AM - 10:00 AM",
                    "fromTime": "9:00",
                    "toTime": "9:59",
                    "fullFromTime": "09:00",
                    "fullToTime": "09:59"
                },
                {
                    "slotId": 4,
                    "name": "10:00 AM - 11:00 AM",
                    "displayName": "10:00 AM - 11:00 AM",
                    "fromTime": "10:00",
                    "toTime": "10:59",
                    "fullFromTime": "10:00",
                    "fullToTime": "10:59"
                },
                {
                    "slotId": 5,
                    "name": "11:00 AM - 12:00 PM",
                    "displayName": "11:00 AM - 12:00 PM",
                    "fromTime": "11:00",
                    "toTime": "11:59",
                    "fullFromTime": "11:00",
                    "fullToTime": "11:59"
                }
            ],
            "2024-03-02": [
                {
                    "slotId": 10,
                    "name": "6:00 AM - 7:00 AM",
                    "displayName": "06:00 AM - 07:00 AM",
                    "fromTime": "6:00",
                    "toTime": "6:59",
                    "fullFromTime": "06:00",
                    "fullToTime": "06:59"
                },
                {
                    "slotId": 1,
                    "name": "7:00 AM - 8:00 AM",
                    "displayName": "07:00 AM - 08:00 AM",
                    "fromTime": "7:00",
                    "toTime": "7:59",
                    "fullFromTime": "07:00",
                    "fullToTime": "07:59"
                },
                {
                    "slotId": 2,
                    "name": "8:00 AM - 9:00 AM",
                    "displayName": "08:00 AM - 09:00 AM",
                    "fromTime": "8:00",
                    "toTime": "8:59",
                    "fullFromTime": "08:00",
                    "fullToTime": "08:59"
                },
                {
                    "slotId": 3,
                    "name": "9:00 AM - 10:00 AM",
                    "displayName": "09:00 AM - 10:00 AM",
                    "fromTime": "9:00",
                    "toTime": "9:59",
                    "fullFromTime": "09:00",
                    "fullToTime": "09:59"
                },
                {
                    "slotId": 4,
                    "name": "10:00 AM - 11:00 AM",
                    "displayName": "10:00 AM - 11:00 AM",
                    "fromTime": "10:00",
                    "toTime": "10:59",
                    "fullFromTime": "10:00",
                    "fullToTime": "10:59"
                },
                {
                    "slotId": 5,
                    "name": "11:00 AM - 12:00 PM",
                    "displayName": "11:00 AM - 12:00 PM",
                    "fromTime": "11:00",
                    "toTime": "11:59",
                    "fullFromTime": "11:00",
                    "fullToTime": "11:59"
                }
            ],
            "2024-03-03": [
                {
                    "slotId": 10,
                    "name": "6:00 AM - 7:00 AM",
                    "displayName": "06:00 AM - 07:00 AM",
                    "fromTime": "6:00",
                    "toTime": "6:59",
                    "fullFromTime": "06:00",
                    "fullToTime": "06:59"
                },
                {
                    "slotId": 1,
                    "name": "7:00 AM - 8:00 AM",
                    "displayName": "07:00 AM - 08:00 AM",
                    "fromTime": "7:00",
                    "toTime": "7:59",
                    "fullFromTime": "07:00",
                    "fullToTime": "07:59"
                },
                {
                    "slotId": 2,
                    "name": "8:00 AM - 9:00 AM",
                    "displayName": "08:00 AM - 09:00 AM",
                    "fromTime": "8:00",
                    "toTime": "8:59",
                    "fullFromTime": "08:00",
                    "fullToTime": "08:59"
                },
                {
                    "slotId": 3,
                    "name": "9:00 AM - 10:00 AM",
                    "displayName": "09:00 AM - 10:00 AM",
                    "fromTime": "9:00",
                    "toTime": "9:59",
                    "fullFromTime": "09:00",
                    "fullToTime": "09:59"
                },
                {
                    "slotId": 4,
                    "name": "10:00 AM - 11:00 AM",
                    "displayName": "10:00 AM - 11:00 AM",
                    "fromTime": "10:00",
                    "toTime": "10:59",
                    "fullFromTime": "10:00",
                    "fullToTime": "10:59"
                },
                {
                    "slotId": 5,
                    "name": "11:00 AM - 12:00 PM",
                    "displayName": "11:00 AM - 12:00 PM",
                    "fromTime": "11:00",
                    "toTime": "11:59",
                    "fullFromTime": "11:00",
                    "fullToTime": "11:59"
                }
            ],
            "2024-03-04": [
                {
                    "slotId": 10,
                    "name": "6:00 AM - 7:00 AM",
                    "displayName": "06:00 AM - 07:00 AM",
                    "fromTime": "6:00",
                    "toTime": "6:59",
                    "fullFromTime": "06:00",
                    "fullToTime": "06:59"
                },
                {
                    "slotId": 1,
                    "name": "7:00 AM - 8:00 AM",
                    "displayName": "07:00 AM - 08:00 AM",
                    "fromTime": "7:00",
                    "toTime": "7:59",
                    "fullFromTime": "07:00",
                    "fullToTime": "07:59"
                },
                {
                    "slotId": 2,
                    "name": "8:00 AM - 9:00 AM",
                    "displayName": "08:00 AM - 09:00 AM",
                    "fromTime": "8:00",
                    "toTime": "8:59",
                    "fullFromTime": "08:00",
                    "fullToTime": "08:59"
                },
                {
                    "slotId": 3,
                    "name": "9:00 AM - 10:00 AM",
                    "displayName": "09:00 AM - 10:00 AM",
                    "fromTime": "9:00",
                    "toTime": "9:59",
                    "fullFromTime": "09:00",
                    "fullToTime": "09:59"
                },
                {
                    "slotId": 4,
                    "name": "10:00 AM - 11:00 AM",
                    "displayName": "10:00 AM - 11:00 AM",
                    "fromTime": "10:00",
                    "toTime": "10:59",
                    "fullFromTime": "10:00",
                    "fullToTime": "10:59"
                },
                {
                    "slotId": 5,
                    "name": "11:00 AM - 12:00 PM",
                    "displayName": "11:00 AM - 12:00 PM",
                    "fromTime": "11:00",
                    "toTime": "11:59",
                    "fullFromTime": "11:00",
                    "fullToTime": "11:59"
                }
            ],
            "2024-03-05": [
                {
                    "slotId": 10,
                    "name": "6:00 AM - 7:00 AM",
                    "displayName": "06:00 AM - 07:00 AM",
                    "fromTime": "6:00",
                    "toTime": "6:59",
                    "fullFromTime": "06:00",
                    "fullToTime": "06:59"
                },
                {
                    "slotId": 1,
                    "name": "7:00 AM - 8:00 AM",
                    "displayName": "07:00 AM - 08:00 AM",
                    "fromTime": "7:00",
                    "toTime": "7:59",
                    "fullFromTime": "07:00",
                    "fullToTime": "07:59"
                },
                {
                    "slotId": 2,
                    "name": "8:00 AM - 9:00 AM",
                    "displayName": "08:00 AM - 09:00 AM",
                    "fromTime": "8:00",
                    "toTime": "8:59",
                    "fullFromTime": "08:00",
                    "fullToTime": "08:59"
                },
                {
                    "slotId": 3,
                    "name": "9:00 AM - 10:00 AM",
                    "displayName": "09:00 AM - 10:00 AM",
                    "fromTime": "9:00",
                    "toTime": "9:59",
                    "fullFromTime": "09:00",
                    "fullToTime": "09:59"
                },
                {
                    "slotId": 4,
                    "name": "10:00 AM - 11:00 AM",
                    "displayName": "10:00 AM - 11:00 AM",
                    "fromTime": "10:00",
                    "toTime": "10:59",
                    "fullFromTime": "10:00",
                    "fullToTime": "10:59"
                },
                {
                    "slotId": 5,
                    "name": "11:00 AM - 12:00 PM",
                    "displayName": "11:00 AM - 12:00 PM",
                    "fromTime": "11:00",
                    "toTime": "11:59",
                    "fullFromTime": "11:00",
                    "fullToTime": "11:59"
                }
            ],
            "2024-03-06": [
                {
                    "slotId": 10,
                    "name": "6:00 AM - 7:00 AM",
                    "displayName": "06:00 AM - 07:00 AM",
                    "fromTime": "6:00",
                    "toTime": "6:59",
                    "fullFromTime": "06:00",
                    "fullToTime": "06:59"
                },
                {
                    "slotId": 1,
                    "name": "7:00 AM - 8:00 AM",
                    "displayName": "07:00 AM - 08:00 AM",
                    "fromTime": "7:00",
                    "toTime": "7:59",
                    "fullFromTime": "07:00",
                    "fullToTime": "07:59"
                },
                {
                    "slotId": 2,
                    "name": "8:00 AM - 9:00 AM",
                    "displayName": "08:00 AM - 09:00 AM",
                    "fromTime": "8:00",
                    "toTime": "8:59",
                    "fullFromTime": "08:00",
                    "fullToTime": "08:59"
                },
                {
                    "slotId": 3,
                    "name": "9:00 AM - 10:00 AM",
                    "displayName": "09:00 AM - 10:00 AM",
                    "fromTime": "9:00",
                    "toTime": "9:59",
                    "fullFromTime": "09:00",
                    "fullToTime": "09:59"
                },
                {
                    "slotId": 4,
                    "name": "10:00 AM - 11:00 AM",
                    "displayName": "10:00 AM - 11:00 AM",
                    "fromTime": "10:00",
                    "toTime": "10:59",
                    "fullFromTime": "10:00",
                    "fullToTime": "10:59"
                },
                {
                    "slotId": 5,
                    "name": "11:00 AM - 12:00 PM",
                    "displayName": "11:00 AM - 12:00 PM",
                    "fromTime": "11:00",
                    "toTime": "11:59",
                    "fullFromTime": "11:00",
                    "fullToTime": "11:59"
                }
            ]
        }

    const timeSlots = ["2024-03-01","2024-03-02","2024-03-03","2024-03-04","2024-03-05","2024-03-06"];


        const modalData = {
            "presentDate" : "2024-02-29",
            "presentHour" : "12"
        }

        const square = {
            squreSelected: {
                height: "1rem",
                width: "1rem", 
                borderRadius: "4px",
                backgroundColor: "#1C3FFD",
            },
            squreNotSelected: {
                height: "1rem",
                width: "1rem",
                borderRadius: "4px",
                backgroundColor: "#EDF0FF",
            },
            squreDisabled: {
                height: "1rem",
                width: "1rem",
                borderRadius: "4px",
                opacity: '0.6',
            }
        }

    return (
        <React.Fragment>
            <div className="time-slots-container card border-0 h-100">
                <div class="header p-3 border-bottom d-flex justify-content-between">
                    <p className="mb-0 d-flex align-items-center">Select a time slot</p>
                    <div className="order-controls">
                        <a href="javascript:void(0)" title="Previous Order" className={`btn me-3  btn-sm btn-link text-primary disabled`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <g transform="translate(-868.477 786) rotate(-90)">
                                    <rect fill="none" width="24" height="24" transform="translate(762 868.477)"></rect>
                                    <path fill="#1C3FFD" d="M61.848,465.874l-5.541,5.541a1.256,1.256,0,1,0,1.776,1.776l4.653-4.64,4.655,4.655a1.261,1.261,0,0,0,2.149-.888,1.248,1.248,0,0,0-.373-.888l-5.543-5.556A1.26,1.26,0,0,0,61.848,465.874Z" transform="translate(711.498 410.651)"></path>
                                </g>
                            </svg>
                            <span class="ml-2 hide-on-mobile">Previous 7 Days</span>
                        </a>
                        <a href="javascript:void(0)" title="Next Order" className={`btn btn-sm btn-link text-primary`}>
                            <span class="mr-2 hide-on-mobile">Next 7 Days</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <g transform="translate(-906.838 786) rotate(-90)">
                                    <rect fill="none" width="24" height="24" transform="translate(762 906.838)"></rect>
                                    <path fill="#1C3FFD" d="M63.432,503.859l5.4-5.4a1.223,1.223,0,0,0-1.73-1.73l-4.533,4.52-4.533-4.533a1.228,1.228,0,0,0-2.092.865,1.216,1.216,0,0,0,.363.865l5.4,5.411A1.229,1.229,0,0,0,63.432,503.859Z" transform="translate(711.356 418.584)"></path>
                                </g>
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="p-2 overflow-y-auto">
                    {timeSlots.map(eachSlot => {
                        return <div className="mb-2">
                            <div className="ps-2">May 08, 2024</div>
                            <div className="each-time-slot">
                                {labSlots[eachSlot].map((labSlot) => {
                                    if (eachSlot < modalData.presentDate || (eachSlot == modalData.presentDate && parseInt(labSlot.fromTime.split(":")[0]) <= modalData.presentHour))
                                        return <div className="content bg-secondary-subtle unavailabe" >{labSlot.displayName}</div>;
                                    else if (labSlot.slotId == 1)
                                        return <div className="content selected">{labSlot.displayName}</div>;
                                    else
                                        return <div className="content unselected" >{labSlot.displayName}</div>;
                                })}
                            </div>
                        </div>
                    })}
                </div> 
                <div className="footer p-3 border-top d-flex align-items-center mobile-compatible-tabs">
                    <label className="align-items-center d-flex gap-2 me-3"><div className='bg-secondary-subtle border border-black' style={square.squreDisabled}> </div> Disabled </label>
                    <label className="align-items-center d-flex gap-2 me-3"><div className='border-black border' style={square.squreNotSelected}> </div> Available </label>
                    <label className="align-items-center d-flex gap-2"><div className='border' style={square.squreSelected}></div>Selected</label>
                </div>
            </div>
        </React.Fragment>
    );
};

export default CatalogTimeSlotsMoule;