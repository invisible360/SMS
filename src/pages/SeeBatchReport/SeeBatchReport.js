import { format } from 'date-fns';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SeeBatchReport = () => {

    const navigate = useNavigate();

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

    const [inputCourse, setInputCourse] = useState('');
    const [studnts, setStudnts] = useState([]);

    const [program, setProgram] = useState([]);
    const [section, setSection] = useState([]);
    const [course, setCourse] = useState([]);

    // const [courseAttendance, setCourseAttendance] = useState([]);
    const [allSummary, setAllSummary] = useState([]);
    const [onlydate, setOnlyDate] = useState([]);
    const [dateMaxLength, setDateMaxLength] = useState([]);
    const [attendaceDate, setAttendanceDate] = useState([]);
    const [dailyPresent, setDailyPresent] = useState([]);



    const handleSemesterFetching = (e) => {
        const getSemester = e.target.value;
        setStudnts([]);
        fetch(`https://sms-server-theta.vercel.app/semester-courses/${getSemester}`)
            .then(res => res.json())
            .then(data => {
                if (data.length === 0) {
                    toast.error("Not Found");
                    // setStudnts([]);
                }
                else {
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

        setInputCourse(course)

        if (semester === '' || program === '' || section === '' || course === '') {
            toast.error('All Input Selection is Mandatory')
        }
        else {

            const searchData = { semester, program, section, course }

            fetch(`https://sms-server-theta.vercel.app/coursewise-attendance-list`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(searchData)
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data);
                    if (data.length === 0) {
                        toast.error("Not Found")
                    }
                    else {
                        setStudnts(data);

                        fetch('https://sms-server-theta.vercel.app/summery-attendance/v2', {
                            method: "POST",
                            headers: {
                                "content-type": "application/json"
                            },
                            body: JSON.stringify([studnts, inputCourse])
                        })
                            .then(res => res.json())
                            .then(data => {
                                const attendanceCourse = data[0]
                                const marks = data[1]

                                studnts.map(e => e['attendance'] = []);
                                studnts.map(e => e['allMarks'] = []);

                                for (var i = 0; i < studnts.length; i++) {
                                    for (var j = 0; j < attendanceCourse.length; j++) {
                                        if (attendanceCourse[j].studentList_id === studnts[i]._id) {
                                            studnts[i].attendance.push(attendanceCourse[j])
                                        }
                                    }
                                }
                                // setCourseAttendance(studnts);

                                for (var k = 0; k < studnts.length; k++) {
                                    for (var l = 0; l < marks.length; l++) {
                                        if (marks[l].studentList_id === studnts[k]._id) {
                                            studnts[k].allMarks.push(marks[l])
                                        }
                                    }
                                }


                                setAllSummary(studnts);



                                const allDate = studnts.map(e => e.attendance)
                                const arr1d = [].concat.apply([], allDate);
                                const uniqueDate = [...new Map(arr1d.map(item => [item['date'], item])).values()];
                                setAttendanceDate(uniqueDate);

                                const onlyDate = [...new Set(arr1d.map(item => item.date))];
                                setOnlyDate(onlyDate);

                                const maxLengthArray = studnts.map(e => e.attendance.length)
                                const maxLength = Math.max(...maxLengthArray)
                                setDateMaxLength(maxLength);

                                const present = onlyDate.map(e => attendanceCourse.filter(e2 => e2.date === e && e2.status === "P"))
                                setDailyPresent(present);

                            })
                    }
                })
        }
    }

    const onChangeMade = () => {
        setAllSummary([]);

    }


    return (
        <div className='min-h-screen'>
            <h1 className='text-center text-3xl font-bold my-5'>Batch Report</h1>

            <form onSubmit={handleSearchStudents} className='flex flex-col w-[70%] mx-auto'>
                {/* Semester Selection */}
                <div className='flex justify-between'>
                    <select onChange={handleSemesterFetching} name='semester' className="select select-primary mb-5 w-full">
                        <option value=''>Semester</option>
                        {
                            semesters.map(semester => <option key={semester._id} value={semester.value}>{semester.name}</option>)
                        }
                    </select>

                </div>
                {/* Program, Section and Course Selection  */}
                <div className='flex justify-between my-5'>
                    <select onChange={onChangeMade} className="select select-primary mb-5 w-1/4" name='program'>
                        <option value=''>{program.length !== 0 ? 'Program' : 'None'}</option>
                        {
                            program.map((prog, i) => <option key={i} value={prog}>{prog}</option>)
                        }
                    </select>
                    <select onChange={onChangeMade} className="select select-primary mb-5 w-1/4" name='section'>
                        <option value=''>{section.length !== 0 ? 'Section' : 'None'}</option>
                        {
                            section.map((sec, i) => <option key={i} value={sec}>{sec}</option>)
                        }
                    </select>

                    <select onChange={onChangeMade} className="select select-primary mb-5 w-1/4" name='course'>
                        <option value=''>{course.length !== 0 ? 'Course' : 'Course Not Assigned yet'}</option>
                        {
                            course.map((crs, i) => <option key={i} value={crs}>{crs}</option>)
                        }
                    </select>

                </div>
                <input type="submit" className='btn btn-primary btn-md text-white my-5 w-52 mx-auto' value="Find All" />
            </form>


            {
                allSummary.length > 0 &&
                <>
                    <h1 className='text-center text-3xl font-bold my-5'>Batch Summary</h1>
                    <div className="overflow-x-auto my-10">
                        <table className="table table-compact table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Batch</th>
                                    <th>Name</th>
                                    {
                                        attendaceDate.map((e, i) => <th key={i} className={`text-center p-3`}><p>{e.date}</p> <p>{e.day}</p></th>)
                                    }
                                    <th className='text-center p-3'>Total Class</th>
                                    <th className='text-center p-3'>Total Present</th>
                                    <th className='text-center p-3'>Total Absent</th>
                                    <th className='text-center p-3'>%</th>
                                    <th className='text-center p-3 bg-purple-700 text-white'>Attendance (10)</th>
                                    <th className='text-center p-3'>Class Test-1 (10)</th>
                                    <th className='text-center p-3'>Class Test-2 (10)</th>
                                    <th className='text-center p-3 bg-purple-700 text-white'>Class Test Final (Avg. = 10)</th>
                                    <th className='text-center p-3 bg-purple-700 text-white'>Mid Term (30)</th>
                                    <th className='text-center p-3 bg-purple-700 text-white'>Final Term (50)</th>
                                    <th className='text-center p-3 bg-green-700 text-white'>Total (100)</th>
                                    <th className='text-center p-3 bg-green-700 text-white'>Grade</th>
                                    <th className='text-center p-3 bg-green-700 text-white'>GPA</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    allSummary.map(e =>
                                        <tr key={e._id}>

                                            <th>{e.id}</th>
                                            <td>{e.batch} {e.section} {e.program}</td>
                                            <td>{e.name}</td>



                                            {
                                                onlydate.length !== e.attendance.length && [...Array(dateMaxLength - e.attendance.length).keys()].map((e, i) => <td key={i} className="text-center text-gray-200">N/A ≈ <span className='text-red-600'>A</span></td>)

                                            }

                                            {
                                                e.attendance.map((status) => <td key={status._id} className={`text-center ${status.status === 'A' ? 'text-red-600' : 'text-green-600'}`}>
                                                    {status.status}</td>)
                                            }
                                            <td className='text-center'>{onlydate.length}</td>
                                            <td className='text-center'>{e.attendance.filter(e => e.status === "P").length}</td>

                                            <td className='text-center'>{e.attendance.filter(e => e.status === "A").length + [...Array(dateMaxLength - e.attendance.length).keys()].length}</td>

                                            <td className={`text-center ${((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2) < 50 ? 'text-red-600' : 'text-green-600'}`}>{((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2)}%</td>



                                            <td className='text-center'>{e.allMarks[0].attendanceMark}</td>
                                            <td className='text-center'>{e.allMarks[0].classTest1}</td>
                                            <td className='text-center'>{e.allMarks[0].classTest2}</td>
                                            <td className='text-center'>{(e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2}</td>
                                            <td className='text-center'>{e.allMarks[0].midTerm}</td>
                                            <td className='text-center'>{e.allMarks[0].finalTerm}</td>

                                            <td className='text-center'>{((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark}</td>

                                            <td className='text-center'>{
                                                ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 80 ?
                                                    "A+" :
                                                    ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 70 ?
                                                        "A" :
                                                        ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 65 ?
                                                            "A-" :
                                                            ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 60 ?
                                                                "B+" :
                                                                ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 55 ?
                                                                    "B" :
                                                                    ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 50 ?
                                                                        "C+" :
                                                                        ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 45 ?
                                                                            "C" :
                                                                            ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 40 ?
                                                                                "D" :
                                                                                "F"

                                            }
                                            </td>

                                            <td className='text-center'>{
                                                ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 80 ?
                                                    4.00 :
                                                    ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 70 ?
                                                        3.75 :
                                                        ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 65 ?
                                                            3.50 :
                                                            ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 60 ?
                                                                3.25 :
                                                                ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 55 ?
                                                                    3.00 :
                                                                    ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 50 ?
                                                                        2.75 :
                                                                        ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 45 ?
                                                                            2.50 :
                                                                            ((e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2) + e.allMarks[0].midTerm + e.allMarks[0].finalTerm + e.allMarks[0].attendanceMark >= 40 ?
                                                                                2.25 :
                                                                                0

                                            }
                                            </td>
                                        </tr>)
                                }

                            </tbody>
                            <tfoot>
                                <tr>
                                    <th className='text-center text-md'> Daily Report</th>
                                    <th colSpan="2" className='text-center'>Batch</th>

                                    {
                                        dailyPresent.map((e, i) => <th key={i} className='text-center'>P : {e.length} <br />A : {studnts.length - e.length} <br /><br />
                                            {/* <label htmlFor="my-modal-6" className="text-xs btn btn-lg btn-circle btn-primary">Daily <br /> Report</label> */}
                                        </th>)
                                    }


                                    <th colSpan='5' className='text-center  border p-1'>
                                        <p>Attendance Marking System</p>
                                        <div className='grid grid-cols-2'>
                                            <div>
                                                <p>100% = 10</p>
                                                <p>90% = 9</p>
                                                <p>80% = 8</p>
                                                <p>70% = 7</p>
                                                <p>60% = 6</p>
                                            </div>
                                            <div>
                                                <p>50% = 5</p>
                                                <p>40% = 4</p>
                                                <p>30% = 3</p>
                                                <p>20% = 2</p>
                                                <p>10% = 1</p>
                                            </div>
                                        </div>
                                        <p>0-10% = 0.5</p>
                                    </th>
                                    <th colSpan='2'></th>
                                    
                                    <th colSpan='6' className='text-center  border p-1'>
                                        <p>Grading System</p>
                                        <div className='grid grid-cols-2'>
                                            <div>
                                                <p>100-80 = A+ (4.00)</p>
                                                <p>79-70 = A (3.75)</p>
                                                <p>69-65 = A- (3.50)</p>
                                                <p>64-60 = B+ (3.25)</p>
                                                {/* <p>&#62;=80 = A+ (4.00)</p>
                                                <p>&#62;=70 = A (3.75)</p>
                                                <p>&#62;=65 = A- (3.50)</p>
                                                <p>&#62;=60 = B+ (3.25)</p> */}


                                            </div>
                                            <div>
                                                <p>59-55 = B (3.00)</p>
                                                <p>54-50 = C+ (2.75)</p>
                                                <p>49-45 = C (2.50)</p>
                                                <p>44-40 = D (2.25)</p>
                                                {/* <p>&#62;=55 = B (3.00)</p>
                                                <p>&#62;=50 = C+ (2.75)</p>
                                                <p>&#62;=45 = C (2.50)</p>
                                                <p>&#62;=40 = D (2.25)</p> */}
                                            </div>
                                        </div>
                                        <p  className='text-red-700'>0-39 = F</p>
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <button onClick={() => navigate('/')} className='btn btn-outline btn-success mx-auto my-5 flex items-center justify-center'>All Okey</button>
                </>
            }

            {/* {
                studnts.length > 0 && <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className='text-lg'>Batch</th>
                                <th className='text-lg'>Name</th>
                                <th className='text-lg'>ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                studnts.length === 0 ?
                                    <tr>
                                        <td colSpan="4" className='text-center text-red-600'>No Students Found</td>
                                    </tr>
                                    :
                                    studnts.map((stdnt, i) =>
                                        <tr key={i}>
                                            <td>{stdnt.batch} {stdnt.section} {stdnt.program}</td>
                                            <td>{stdnt.name}</td>
                                            <td>{stdnt.id}</td>
                                        </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            } */}
        </div>
    );
};

export default SeeBatchReport;