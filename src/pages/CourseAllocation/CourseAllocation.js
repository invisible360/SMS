import React, { useState } from 'react';

import StudentsDistribution from './StudentsDistribution';
import StudentsSelection from './StudentsSelection';

const CourseAllocation = () => {
    const [dataHold, setDataHold] = useState([]);

    const sendHoldValue = (valHld) => {
       
        setDataHold(valHld);
    
    }

    return (
        <div className='min-h-screen'>
            <h1 className='text-center text-3xl font-bold my-5'>Course Allocation</h1>
            <section className='grid grid-cols-2 gap-5'>
                <StudentsSelection sendHoldValue={sendHoldValue}></StudentsSelection>
                <StudentsDistribution dataHold={dataHold}></StudentsDistribution>
            </section>
        </div>
    );
};

export default CourseAllocation;