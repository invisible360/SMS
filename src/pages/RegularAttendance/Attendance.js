import React, { useState } from 'react';
import { ImCheckmark, ImCross } from "react-icons/im";
import { format } from 'date-fns';


const Attendance = ({ atted, inputCourse, handleAttend }) => {
    const [checkedPresent, setCheckedPresent] = useState(false);
    const [checkedAbsent, setCheckedAbsent] = useState(false);

    const presentBtn = () => {
        setCheckedPresent(true)
        setCheckedAbsent(false)
        status("P");
        const newAttend = {
            id: atted.id,
            _id: atted._id,
            date: atted.studentRecord[0].Attendance[0].date,
            status: atted.studentRecord[0].Attendance[0].status,
            attendCourse: inputCourse
        }
        handleAttend(newAttend);
    }

    const absentBtn = () => {
        setCheckedAbsent(true)
        setCheckedPresent(false)
        status("A");
        const newAttend = {
            id: atted.id,
            _id: atted._id,
            date: atted.studentRecord[0].Attendance[0].date,
            status: atted.studentRecord[0].Attendance[0].status,
            attendCourse: inputCourse
        }
        handleAttend(newAttend);
    }

    const status = (stat) => {

        atted.studentRecord = [
            {
                Attendance: [
                    {
                        date: format(new Date(), "PP"),
                        status: stat
                    }
                ]
            }
        ]

    }

    return (
        <div className='flex items-center'>
            <div className="btn-group m-1">
                <span onClick={presentBtn} className="btn btn-primary text-white" disabled={checkedPresent}>Present</span>
                <span onClick={absentBtn} className="btn btn-accent text-black" disabled={checkedAbsent}>Absent</span>
            </div>
            <div className='flex text-xl ml-5 items-center'>

                <div className='flex '>

                    {
                        checkedPresent && <span className='mx-2'>P</span>
                    }
                    {
                        checkedAbsent && <span className='mx-2'>A</span>
                    }

                </div>
                <div className='flex'>
                    <span className={`text-green-500 ${checkedPresent ? 'block' : 'hidden'} `}><ImCheckmark /></span>
                    <span className={`text-red-500 ${checkedAbsent ? 'block' : 'hidden'}`}><ImCross /></span>
                </div>
            </div>
        </div>
    );
};

export default Attendance;