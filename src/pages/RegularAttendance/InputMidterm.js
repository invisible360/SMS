import React from 'react';

const InputMidterm = ({ stdnt }) => {
    return (
        <tr>
            <td>{stdnt.batch} {stdnt.section} {stdnt.program}</td>
            <td>{stdnt.name}</td>
            <td>{stdnt.id}</td>

            <td>
                <input type='text' placeholder='Mid term'></input>
            </td>

        </tr>
    );
};

export default InputMidterm;