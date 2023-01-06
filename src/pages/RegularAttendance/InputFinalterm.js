import React from 'react';

const InputFinalterm = ({stdnt}) => {
    return (
        <tr>
            <td>{stdnt.batch} {stdnt.section} {stdnt.program}</td>
            <td>{stdnt.name}</td>
            <td>{stdnt.id}</td>

            <td>
                <input type='text' placeholder='Final term'></input>
            </td>

        </tr>
    );
};

export default InputFinalterm;