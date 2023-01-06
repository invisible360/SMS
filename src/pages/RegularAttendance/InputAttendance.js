import React from 'react';

const InputAttendance = ({ stdnt }) => {
    return (
        <tr>
            <td>{stdnt.batch} {stdnt.section} {stdnt.program}</td>
            <td>{stdnt.name}</td>
            <td>{stdnt.id}</td>

            <td>
                <div className="btn-group">
                    <button className="btn btn-primary text-white">Present</button>
                    <button className="btn btn-error">Absent</button>
                </div>
            </td>

        </tr>
    );
};

export default InputAttendance;