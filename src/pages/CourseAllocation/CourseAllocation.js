//First .js

import React from 'react';

import StudentsDistribution from './StudentsDistribution';
import StudentsSelection from './StudentsSelection';

const CourseAllocation = () => {

    return (
        <div className='min-h-screen'>
            <h1 className='text-center text-3xl font-bold my-5'>Course Allocation</h1>
            <section className='grid grid-cols-2 gap-5'>
                <StudentsSelection></StudentsSelection>
                <StudentsDistribution></StudentsDistribution>
            </section>
        </div>
    );
};

export default CourseAllocation;