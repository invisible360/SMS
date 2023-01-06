import React, { useState } from 'react';

const InputLog = ({ stdnt, inputMode }) => {
    // console.log(inputMode);
    // if (inputMode === 'ATTENDANCE') {
    //     console.log('attendance asche');
    //     return
    // }


    return (
        <tr>
            <td>{stdnt.batch} {stdnt.section} {stdnt.program}</td>
            <td>{stdnt.name}</td>
            <td>{stdnt.id}</td>

            {/* upgrade: DRY minimized */}

            <td className={`${inputMode === 'ATTENDANCE' ? 'block' : 'hidden'}`}>
                <div className="btn-group">
                    <button className="btn btn-primary text-white">Present</button>
                    <button className="btn btn-error">Absent</button>
                </div>
            </td>

            <td className={`${inputMode === 'CLASS TEST - 1' ? 'block' : 'hidden'}`}>
                <input type="text" placeholder="CT-1" className="input input-bordered text-center max-w-xs input-primary" />
            </td>

            <td className={`${inputMode === 'CLASS TEST - 2' ? 'block' : 'hidden'}`}>
                <input type="text" placeholder="CT-2" className="input input-bordered text-center max-w-xs input-primary" />
            </td>

            <td className={`${inputMode === 'Mid Term' ? 'block' : 'hidden'}`}>
                <input type="text" placeholder="Mid Term" className="input input-bordered text-center max-w-xs input-primary" />
            </td>

            <td className={`${inputMode === 'Final Term' ? 'block' : 'hidden'}`}>
                <input type="text" placeholder="Final Term" className="input input-bordered text-center max-w-xs input-primary" />
            </td>

            {/* <td className={`${inputMode === 'Not Selected' ? 'block' : 'hidden'}`}>
                No Selection
            </td> */}

        </tr>
    );
};

export default InputLog;