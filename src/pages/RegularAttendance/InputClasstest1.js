import React from 'react';

const InputClasstest1 = ({ stdnt }) => {
    return (
        <tr>
            <td>{stdnt.batch} {stdnt.section} {stdnt.program}</td>
            <td>{stdnt.name}</td>
            <td>{stdnt.id}</td>

            <td>
                <input type='text' placeholder='CT-1'></input>
            </td>

        </tr>
    );
};

export default InputClasstest1;