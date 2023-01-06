import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import InputLog from './InputLog';
import { BiMessageAltAdd } from "react-icons/bi";

const RegularAttendance = () => {

    const semesters = [
        {
            _id: 1,
            name: 'Spring 2023',
            value: 'spring-2023'
        },
        {
            _id: 2,
            name: 'Fall 2022',
            value: 'fall-2022'
        }
    ]
    // const [semester, setSemester] = useState([]);
    const [program, setProgram] = useState([]);
    const [section, setSection] = useState([]);
    const [course, setCourse] = useState([]);

    // const [attedance, setAttendance] = useState('');
    // const [classtest1, setClasstest1] = useState('');
    // const [classtest2, setClasstest2] = useState('');
    // const [midterm, setMidterm] = useState('');
    // const [final, setFinal] = useState('');

    const [inputMode, setInputMode] = useState('');

    // const attendaceClick = () => {
    //     console.log('attendace clicked');
    // }

    // console.log(attedance);

    const [studnts, setStudnts] = useState([]);

    const handleSemesterFetching = (e) => {
        // console.log(e.target.value);
        const getSemester = e.target.value;
        fetch(`http://localhost:5000/semester-courses/${getSemester}`)
            .then(res => res.json())
            .then(data => {
                if (data.length === 0) {
                    toast.error("Not Found");
                }
                else {
                    // console.log(data);
                    const program = [];
                    const section = [];
                    const course = [];
                    data.map(e => program.push(e.program));
                    data.map(e => section.push(e.section));
                    data.map(e => course.push(...e.course));
                    const newProgram = [...new Set(program)];
                    const newSection = [...new Set(section)];
                    const newCourse = [...new Set(course)];

                    setProgram(newProgram);
                    setSection(newSection);
                    setCourse(newCourse);
                }
            })
    }

    const handleSearchStudents = (e) => {
        e.preventDefault();
        const form = e.target;
        const semester = form.semester.value;
        const program = form.program.value;
        const section = form.section.value;
        const course = form.course.value;

        if (semester === '' || program === '' || section === '' || course === '') {
            toast.error('All Input Selection is Mandatory')
        }
        else {

            const searchData = { semester, program, section, course }
            // console.log(searchData);

            fetch(`http://localhost:5000/coursewise-attendance-list`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(searchData)
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data);
                    setStudnts(data);
                })
        }

    }

    return (
        <div className='min-h-screen'>
            <h1 className='text-center text-3xl font-bold my-5'>Input log</h1>


            <form onSubmit={handleSearchStudents} className='flex flex-col w-[70%] mx-auto'>

                <div className='flex justify-between'>
                    <select onChange={handleSemesterFetching} name='semester' className="select select-primary mb-5 w-full">
                        <option value=''>Semester</option>
                        {
                            semesters.map(semester => <option key={semester._id} value={semester.value}>{semester.name}</option>)
                        }
                    </select>

                </div>

                <div className='flex justify-between my-5'>
                    <select className="select select-primary mb-5 w-1/4" name='program'>
                        <option value=''>{program.length !== 0 ? 'Program' : 'None'}</option>
                        {
                            program.map((prog, i) => <option key={i} value={prog}>{prog}</option>)
                        }
                    </select>
                    <select className="select select-primary mb-5 w-1/4" name='section'>
                        <option value=''>{section.length !== 0 ? 'Section' : 'None'}</option>
                        {
                            section.map((sec, i) => <option key={i} value={sec}>{sec}</option>)
                        }
                    </select>

                    <select className="select select-primary mb-5 w-1/4" name='course'>
                        <option value=''>{course.length !== 0 ? 'Course' : 'None'}</option>
                        {
                            course.map((crs, i) => <option key={i} value={crs}>{crs}</option>)
                        }
                    </select>

                </div>
                <input type="submit" className='btn btn-primary btn-md text-white my-5 w-52 mx-auto' value="Find All" />
            </form>

            <div className='w-[70%] mx-auto'>
                <h1 className='text-xl text-right text-green-600'>Input Mode: {inputMode ? inputMode : "Not Selected"}</h1>
                <div className="overflow-x-auto">
                    <table className="table w-full">

                        <thead>
                            <tr>
                                <th className='text-lg'>Batch</th>
                                <th className='text-lg'>Name</th>
                                <th className='text-lg'>ID</th>
                                <th className={`${studnts.length === 0 ? 'hidden' : 'block'}`}>

                                    <ul className="menu menu-horizontal">

                                        <li tabIndex={0}>
                                            <span className='text-2xl'><BiMessageAltAdd></BiMessageAltAdd></span>
                                            <ul className='text-primary bg-base-100'>
                                                <li><span onClick={() => setInputMode('ATTENDANCE')}>Attendance</span></li>
                                                <li><span onClick={() => setInputMode('CLASS TEST - 1')}>CT-1</span></li>
                                                <li><span onClick={() => setInputMode('CLASS TEST - 2')}>CT-2</span></li>
                                                <li><span onClick={() => setInputMode('Mid Term')}>Mid Term</span></li>
                                                <li><span onClick={() => setInputMode('Final Term')}>Final Term</span></li>
                                                <li><span onClick={() => setInputMode('Not Selected')}>Default</span></li>
                                            </ul>
                                        </li>

                                    </ul>

                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                studnts.length === 0 ?
                                    <tr>
                                        <td colSpan="4" className='text-center text-red-600'>No Students Found</td>
                                    </tr>
                                    :
                                    studnts.map((stdnt, i) => <InputLog
                                        key={i}
                                        stdnt={stdnt}
                                        inputMode={inputMode}
                                    ></InputLog>)
                            }

                        </tbody>
                    </table>
                </div>
                            
            </div>


        </div>
    );
};

export default RegularAttendance;


// {
//     inputMode === 'ATTENDANCE' &&
//     studnts.map((stdnt, i) => <InputAttendance
//         key={i}
//         stdnt={stdnt}
//     ></InputAttendance>)
// }
// {
//     inputMode === 'CLASS TEST - 1' &&
//     studnts.map((stdnt, i) => <InputClasstest1
//         key={i}
//         stdnt={stdnt}
//     ></InputClasstest1>)
// }
// {
//     inputMode === 'CLASS TEST - 2' &&
//     studnts.map((stdnt, i) => <InputClasstest2
//         key={i}
//         stdnt={stdnt}
//     ></InputClasstest2>)
// }
// {
//     inputMode === 'Mid Term' &&
//     studnts.map((stdnt, i) => <InputMidterm
//         key={i}
//         stdnt={stdnt}
//     ></InputMidterm>)
// }
// {
//     inputMode === 'Final Term' &&
//     studnts.map((stdnt, i) => <InputFinalterm
//         key={i}
//         stdnt={stdnt}
//     ></InputFinalterm>)
// }
// {
//     inputMode === 'Not Selected' && ''

// }

