import React from 'react';
import Feature from './Feature';

const Management = () => {
    const features = [
        {
            "_id": 1,
            "name": 'Entry Student',
            "route": '/entryStudent'
        },
        {
            "_id": 5,
            "name": 'Course Allocation',
            "route": '/courseAllocation'
        },
        {
            "_id": 2,
            "name": 'Regular Attendance',
            "route": '/regularAttendance'
        },
        {
            "_id": 3,
            "name": 'View Student List',
            route: '/viewStudentList'
        },
        {
            "_id": 4,
            "name": 'See Batch Report',
            "route": '/seeBatchReport'
        },
        

    ]
    return (
        <div className='mt-10'>

            <h1 className="text-3xl font-bold text-center my-5">Students Management Features</h1>
            <div className='grid grid-cols-4 gap-5 m-5'>
                {
                    features.map(feature => <Feature
                        key={feature._id}
                        feature={feature}
                    ></Feature>)
                }
            </div>

        </div>
    );
};

export default Management;