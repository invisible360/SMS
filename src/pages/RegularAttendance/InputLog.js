import React, { useState } from 'react';
// import { ImCheckmark, ImCross } from "react-icons/im";

const InputLog = ({ stdnt, inputMode, reset }) => {
    // console.log(inputMode);
    // if (inputMode === 'ATTENDANCE') {
    //     console.log('attendance asche');
    //     return
    // }

    // const [checkedPresent, setCheckedPresent] = useState(false);
    // const [checkedAbsent, setCheckedAbsent] = useState(false);

    // console.log(checkedPresent);


    return (
        <tr>
            <td>{stdnt.batch} {stdnt.section} {stdnt.program}</td>
            <td>{stdnt.name}</td>
            <td>{stdnt.id}</td>

            {/* upgrade: DRY minimized */}



            {/* <td className={`${inputMode === 'ATTENDANCE' ? 'block' : 'hidden'}`}>
                <div className="btn-group items-center">
                    <div>
                        <button onClick={() => {
                            setCheckedPresent(true)
                            setCheckedAbsent(false)
                            // setCheckedPresent(reset)
                        }} className="btn btn-primary text-white" disabled={checkedPresent}>Present</button>
                        <button onClick={() => {
                            setCheckedAbsent(true)
                            setCheckedPresent(false)
                            // setCheckedAbsent(reset)
                        }} className="btn btn-error" disabled={checkedAbsent}>Absent</button>
                    </div>
                    <div className='flex text-xl ml-5'>
                        <span className={`text-green-500 ${checkedPresent ? 'block' : 'hidden'}`}><ImCheckmark /></span>
                        <span className={`text-red-500 ${checkedAbsent ? 'block' : 'hidden'}`}><ImCross /></span>
                    </div>

                </div>
            </td> */}





            {/* <td className={`${inputMode === 'CLASS TEST - 1' ? 'block' : 'hidden'}`}>
                <input type="text" placeholder="CT-1" className="input input-bordered text-center max-w-xs input-primary" />
            </td> */}

            {/* <td className={`${inputMode === 'CLASS TEST - 2' ? 'block' : 'hidden'}`}>
                <input type="text" placeholder="CT-2" className="input input-bordered text-center max-w-xs input-primary" />
            </td> */}

            {/* <td className={`${inputMode === 'Mid Term' ? 'block' : 'hidden'}`}>
                <input type="text" placeholder="Mid Term" className="input input-bordered text-center max-w-xs input-primary" />
            </td> */}

            {/* <td className={`${inputMode === 'Final Term' ? 'block' : 'hidden'}`}>
                <input type="text" placeholder="Final Term" className="input input-bordered text-center max-w-xs input-primary" />
            </td> */}

            {/* <td className={`${inputMode === 'Not Selected' ? 'block' : 'hidden'}`}>
                No Selection
            </td> */}

        </tr>
    );
};

export default InputLog;