import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MdAddCircle } from "react-icons/md";
import Attendance from './Attendance';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const RegularAttendance = () => {
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

    const inputAction = [
        {
            mode: "ATTENDANCE",
            value: "Attendance"
        },
        {
            mode: "CLASS TEST - 1",
            value: "Class Test -1"
        },
        {
            mode: "CLASS TEST - 2",
            value: "Class Test -2"
        },
        {
            mode: "MID TERM",
            value: "Mid Term"
        },
        {
            mode: "FINAL TERM",
            value: "Final Term"
        },

    ]

    const [program, setProgram] = useState([]);
    const [section, setSection] = useState([]);
    const [course, setCourse] = useState([]);
    const [studnts, setStudnts] = useState([]);

    const [inputMode, setInputMode] = useState('Not Selected');
    const [inputCourse, setInputCourse] = useState('');

    const [presentList, setPresentList] = useState([]);

    const [existAttendance, setExistAttendance] = useState([]);
    const [existCT1, setExistCT1] = useState([]);
    const [existCT2, setExistCT2] = useState([]);
    const [existMid, setExistMid] = useState([]);
    const [existFinal, setExistFinal] = useState([]);


    const [ct1List, setCt1List] = useState([]);
    const [ct2List, setCt2List] = useState([]);
    const [midTerm, setMidterm] = useState([]);
    const [finalTerm, setFinalterm] = useState([]);

    const [courseAttendance, setCourseAttendance] = useState([]);
    const [marksSummary, setMarksSummary] = useState([]);
    const [onlydate, setOnlyDate] = useState([]);
    const [dateMaxLength, setDateMaxLength] = useState([]);
    const [attendaceDate, setAttendanceDate] = useState([]);
    const [dailyPresent, setDailyPresent] = useState([]);


    const [submitDisabled, setSubmitDisabled] = useState(false)



    const onChangeMade = () => {
        setStudnts([]);
        setInputMode('Not Selected');
        setCourseAttendance([]);
        setMarksSummary([])
    }

    const handleSemesterFetching = (e) => {
        const getSemester = e.target.value;
        setStudnts([]);
        setInputMode('Not Selected')
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

        setInputMode('Not Selected');
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
                    }
                })
        }
    }

    const markAPI = (marks, marksType) => {
        fetch(`https://sms-server-theta.vercel.app/marks-record`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(marks)
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.message) {
                    toast.error(data.message)
                }
                else {
                    toast.success(`${marksType} Marks Successfully Submitted`);
                    // navigate(0);
                    // navigate('/');

                    fetch('https://sms-server-theta.vercel.app/summery-attendance/v2', {
                        method: "POST",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify([studnts, inputCourse])
                    })
                        .then(res => res.json())
                        .then(data => {
                            const marks = data[1]
                            // console.log(marks);
                            // console.log(studnts);

                            studnts.map(e => e['allMarks'] = []);
                            for (var i = 0; i < studnts.length; i++) {
                                for (var j = 0; j < marks.length; j++) {
                                    if (marks[j].studentList_id === studnts[i]._id) {
                                        // ({...studnts[i], marks[j]})
                                        studnts[i].allMarks.push(marks[j])
                                    }
                                }
                            }
                            // console.log(studnts);
                            setMarksSummary(studnts);
                            setSubmitDisabled(true);
                        })

                }
            })
    }

    // Most Important Function 
    const filtering = (obj, list, setList, message) => {
        const alreadyExist = list.find(e => e.studentList_id === obj.studentList_id);
        if (typeof alreadyExist === 'undefined') {
            setList([...list, ...[obj]]);
        }
        else {
            const newList = list.filter(e => e.studentList_id !== alreadyExist.studentList_id)
            setList([...newList, ...[obj]]);
            if (message) {
                toast.success(message)
            }
        }
    }

    const handleAttend = (newAttend) => {
        filtering(newAttend, presentList, setPresentList, "Status Changed");
    }

    const handleCT1 = (e) => {
        const studentList_id = e.target.id;
        const value = parseInt(e.target.value);

        const ct1 = {
            studentList_id, classTest1: value,
            course: inputCourse,
        }

        if (value > 10) {
            toast.error("CT Marks must be less than equal 10");
            e.target.value = '';
            ct1.classTest1 = null;
            filtering(ct1, ct1List, setCt1List)
        }
        else {
            filtering(ct1, ct1List, setCt1List)
        }

    }

    const handleCT2 = (e) => {
        const studentList_id = e.target.id;
        const value = parseInt(e.target.value);;

        const ct2 = {
            studentList_id, classTest2: value,
            course: inputCourse,
        }

        if (value > 10) {
            toast.error("CT Marks must be less than equal 10");
            e.target.value = '';
            ct2.classTest2 = null;
            filtering(ct2, ct2List, setCt2List)
        }
        else {
            filtering(ct2, ct2List, setCt2List)
        }

    }

    const handleMid = (e) => {
        const studentList_id = e.target.id;
        const value = parseInt(e.target.value);;

        const mid = {
            studentList_id, midTerm: value,
            course: inputCourse,
        }

        if (value > 30) {
            toast.error("Mid Term Marks must be less than equal 30");
            e.target.value = '';
            mid.midTerm = null;
            filtering(mid, midTerm, setMidterm)
        }
        else {
            filtering(mid, midTerm, setMidterm)
        }

    }

    const handleFinal = (e) => {
        const studentList_id = e.target.id;
        const value = parseInt(e.target.value);;

        const final = {
            studentList_id, finalTerm: value,
            course: inputCourse,
        }

        if (value > 50) {
            toast.error("Final Term Marks must be less than equal 50");
            e.target.value = '';
            final.finalTerm = null;
            filtering(final, finalTerm, setFinalterm)
        }
        else {
            filtering(final, finalTerm, setFinalterm)
        }

    }

    useEffect(() => {
        fetch('https://sms-server-theta.vercel.app/get-attendance-log')
            .then(res => res.json())
            .then(data => {
                const existAttend = data.filter(e => e.date === format(new Date(), "PP") && e.attendCourse === inputCourse);
                // const existAttend = data.filter(e => e.date === 'Jan 30, 2023' && e.attendCourse === inputCourse);
                const existIds = existAttend.map(e => e.studentList_id);
                setExistAttendance(existIds);

            })
    }, [inputCourse])

    useEffect(() => {
        fetch(`https://sms-server-theta.vercel.app/get-marks-log`)
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                const alreadyCT1 = data.filter(e => (e.classTest1 || e.classTest1 === 0) && e.course === inputCourse);
                // console.log(existEntity);
                const existCT1Ids = alreadyCT1.map(e => e.studentList_id);
                setExistCT1(existCT1Ids);

                const alreadyCT2 = data.filter(e => (e.classTest2 || e.classTest2 === 0) && e.course === inputCourse);
                const existCT2Ids = alreadyCT2.map(e => e.studentList_id);
                setExistCT2(existCT2Ids);

                const alreadyMid = data.filter(e => (e.midTerm || e.midTerm === 0) && e.course === inputCourse);
                const existMidIds = alreadyMid.map(e => e.studentList_id);
                setExistMid(existMidIds);

                const alreadyFinal = data.filter(e => (e.finalTerm || e.midTerm === 0) && e.course === inputCourse);
                const existFinalIds = alreadyFinal.map(e => e.studentList_id);
                setExistFinal(existFinalIds);
            })
    }, [inputCourse])


    const handleSubmission = e => {
        e.preventDefault();
        // console.log(ct1List);


        if (presentList.length > 0) {

            fetch("https://sms-server-theta.vercel.app/attendance-record", {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(presentList)
            })
                .then(res => res.json())
                .then(result => {
                    // console.log(result);
                    if (result.acknowledged) {
                        toast.success(`Attendace Submitted for ${format(new Date(), "PP")}`);


                        // oraginzing data
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

                                studnts.map(e => e['attendance'] = []);

                                for (var i = 0; i < studnts.length; i++) {
                                    for (var j = 0; j < attendanceCourse.length; j++) {
                                        if (attendanceCourse[j].studentList_id === studnts[i]._id) {
                                            studnts[i].attendance.push(attendanceCourse[j])
                                        }
                                    }
                                }
                                setCourseAttendance(studnts);

                                const allDate = studnts.map(e => e.attendance)
                                const arr1d = [].concat.apply([], allDate);
                                const uniqueDate = [...new Map(arr1d.map(item => [item['date'], item])).values()];
                                setAttendanceDate(uniqueDate);

                                const onlyDate = [...new Set(arr1d.map(item => item.date))];
                                setOnlyDate(onlyDate);

                                const maxLengthArray = studnts.map(e => e.attendance.length)
                                const maxLength = Math.max(...maxLengthArray)
                                setDateMaxLength(maxLength)

                                const present = onlyDate.map(e => attendanceCourse.filter(e2 => e2.date === e && e2.status === "P"))
                                setDailyPresent(present);
                                setSubmitDisabled(true);
                            })

                    }
                })


        }

        else if (ct1List.length > 0) {
            markAPI(ct1List, "CT-1")
        }

        else if (ct2List.length > 0) {
            markAPI(ct2List, "CT-2")

        }

        else if (midTerm.length > 0) {
            markAPI(midTerm, "Mid Term")
        }

        else if (finalTerm.length > 0) {
            markAPI(finalTerm, "Final Term")
        }

        else {
            toast.error("No Input Action taken")
        }

    }

    const handleAttendanceMarkSubmission = () => {
        const attenMark = [];

        courseAttendance.map(e => attenMark.push({ course: inputCourse, studentList_id: e._id, attendanceMark: parseInt((e.attendance.filter(e2 => e2.status === "P").length / onlydate.length) * 10) }))
       
        fetch(`https://sms-server-theta.vercel.app/marks-record`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(attenMark)
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.message) {
                    toast.error(data.message)
                }
                else {
                    toast.success(`Final Attendance Marks Successfully Submitted`);
                }
            })

    }

    return (
        <div className='min-h-screen'>
            <h1 className='text-center text-3xl font-bold my-5'>Input log</h1>

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
                <div className='flex md:flex-row flex-col justify-between md:my-5'>
                    <select onChange={onChangeMade} className="select select-primary mb-5 w-full md:w-1/4" name='program'>
                        <option value=''>{program.length !== 0 ? 'Program' : 'None'}</option>
                        {
                            program.map((prog, i) => <option key={i} value={prog}>{prog}</option>)
                        }
                    </select>
                    <select onChange={onChangeMade} className="select select-primary mb-5 w-full md:w-1/4" name='section'>
                        <option value=''>{section.length !== 0 ? 'Section' : 'None'}</option>
                        {
                            section.map((sec, i) => <option key={i} value={sec}>{sec}</option>)
                        }
                    </select>

                    <select onChange={onChangeMade} className="select select-primary mb-5 w-full md:w-1/4" name='course'>
                        <option value=''>{course.length !== 0 ? 'Course' : 'Course Not Assigned yet'}</option>
                        {
                            course.map((crs, i) => <option key={i} value={crs}>{crs}</option>)
                        }
                    </select>

                </div>
                <input type="submit" className='btn btn-primary btn-md text-white my-5 w-52 mx-auto' value="Find All" />
            </form>


            <div className='w-[70%] mx-auto'>
                {
                    studnts.length > 0 && <p className='text-xl text-center text-green-600 mb-5'>Input Mode: {inputMode === 'ATTENDANCE' ? `Attendance for ${format(new Date(), "PP")}` : inputMode}</p>
                }
                <div className='grid grid-cols-2'>

                    {/* Table to show student data */}

                    {
                        studnts.length > 0 && <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className='text-lg hidden md:block'>Batch</th>
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
                                                    <td className='hidden md:block'>{stdnt.batch} {stdnt.section} {stdnt.program}</td>
                                                    <td>{stdnt.name}</td>
                                                    <td>{stdnt.id}</td>
                                                </tr>)
                                    }
                                </tbody>
                            </table>
                        </div>
                    }

                    {/* Input Action */}
                    <div>
                        <div className={`dropdown dropdown-hover dropdown-left ${studnts.length === 0 ? 'hidden' : ''} `}>
                            <label tabIndex={0} className="btn btn-info m-1"><p className='text-2xl w-28 md:w-52 flex items-center justify-center'><MdAddCircle></MdAddCircle></p></label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-info text-black rounded-box w-52">
                                {
                                    inputAction.map((input, i) =>
                                        <li key={i}>
                                            <span onClick={() => {
                                                setInputMode(input.mode)
                                                setPresentList([])
                                                setCt1List([])
                                                setCt2List([])
                                                setMidterm([])
                                                setFinalterm([])
                                                // setSubmitDisabled (false)
                                            }}>{input.value}</span>
                                        </li>)
                                }
                            </ul>
                        </div>


                        <form onSubmit={handleSubmission} className='flex flex-col'>
                            <div>

                                {
                                    inputMode === 'ATTENDANCE' &&
                                    studnts.map((atted, i) => <Attendance
                                        key={i}
                                        atted={atted}
                                        inputCourse={inputCourse}
                                        handleAttend={handleAttend}
                                        existAttendance={existAttendance}
                                    ></Attendance>)
                                }

                                {
                                    inputMode === 'CLASS TEST - 1' &&
                                    studnts.map((ct1, i) => <input onBlur={handleCT1} key={i} id={ct1._id} type="number" placeholder={existCT1.includes(ct1._id) ? "Already Given" : "CT-1"} className="input input-bordered text-center w-36 md:max-w-xs input-primary m-1" disabled={existCT1.includes(ct1._id)} />)
                                }

                                {
                                    inputMode === 'CLASS TEST - 2' &&
                                    studnts.map((ct2, i) => <input onBlur={handleCT2} key={i} id={ct2._id} type="number" placeholder={existCT2.includes(ct2._id) ? "Already Given" : "CT-2"} className="input input-bordered text-center w-36 md:max-w-xs input-primary m-1" disabled={existCT2.includes(ct2._id)} />)
                                }

                                {
                                    inputMode === 'MID TERM' &&
                                    studnts.map((mid, i) => <input onBlur={handleMid} key={i} id={mid._id} type="number" placeholder={existMid.includes(mid._id) ? "Already Given" : "Mid Term"} className="input input-bordered text-center md w-36 md:max-w-xs input-primary m-1" disabled={existMid.includes(mid._id)} />)
                                }

                                {
                                    inputMode === 'FINAL TERM' &&
                                    studnts.map((final, i) => <input onBlur={handleFinal} key={i} id={final._id} type="number" placeholder={existFinal.includes(final._id) ? "Already Given" : "Final Term"} className="input input-bordered text-center w-36 md:max-w-xs input-primary m-1" disabled={existFinal.includes(final._id)} />)
                                }
                            </div>
                            {
                                inputMode !== 'Not Selected' &&
                                <input type="submit" className='btn btn-warning mt-1 md:w-[15.5rem]' disabled={submitDisabled} value="Submit" />
                            }
                        </form>

                    </div>
                </div>

                {
                    courseAttendance.length > 0 &&
                    <>
                        <h1 className='text-center text-3xl font-bold my-5'>Attendane Summary</h1>
                        <div className="overflow-x-auto my-10">
                            <table className="table table-compact table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Batch</th>
                                        <th>Name</th>
                                        {
                                            attendaceDate.map((e, i) => <th key={i} className={`text-center p-3 ${e.date === format(new Date(), "PP") && 'bg-purple-700 text-white'}`}><p>{e.date}</p> <p>{e.day}</p></th>)
                                        }
                                        <th className='text-center p-3'>Total Class</th>
                                        <th className='text-center p-3'>Total Present</th>
                                        <th className='text-center p-3'>Total Absent</th>
                                        <th className='text-center p-3'>%</th>
                                        <th className='text-center p-3'>Mark(10)</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        courseAttendance.map(e =>
                                            <tr key={e._id}>

                                                <th>{e.id}</th>
                                                <td>{e.batch} {e.section} {e.program}</td>
                                                <td>{e.name}</td>
                                                {
                                                    onlydate.length !== e.attendance.length && [...Array(dateMaxLength - e.attendance.length).keys()].map((e, i) => <td key={i} className="text-center text-gray-200">N/A ≈ <span className='text-red-600'>A</span></td>)

                                                }
                                                {/* {
                                                    e.attendance.map((status) => <th key={status._id} className={`text-center ${status.status === 'A' ? 'text-red-600' : 'text-green-600'}`}>{status.date}<br></br></th>)
                                                } */}
                                                {
                                                    e.attendance.map((status) => <td key={status._id} className={`text-center ${status.status === 'A' ? 'text-red-600' : 'text-green-600'}`}>
                                                        {status.status}</td>)
                                                }
                                                <td className='text-center'>{onlydate.length}</td>
                                                <td className='text-center'>{e.attendance.filter(e => e.status === "P").length}</td>

                                                <td className='text-center'>{e.attendance.filter(e => e.status === "A").length + [...Array(dateMaxLength - e.attendance.length).keys()].length}</td>

                                                <td className={`text-center ${((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2) < 50 ? 'text-red-600' : 'text-green-600'}`}>{((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2)}%</td>


                                                <td className='text-center'>{
                                                    ((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2) === 100 ?
                                                        10 :
                                                        ((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2) >= 90 ?
                                                            9 :
                                                            ((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2) >= 80 ?
                                                                8 :
                                                                ((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2) >= 70 ?
                                                                    7 :
                                                                    ((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2) >= 60 ?
                                                                        6 :
                                                                        ((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2) >= 50 ?
                                                                            5 :
                                                                            ((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2) >= 40 ?
                                                                                4 :
                                                                                ((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2) >= 30 ?
                                                                                    3 :
                                                                                    ((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2) >= 20 ?
                                                                                        2 :
                                                                                        ((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2) >= 10 ?
                                                                                            1 :
                                                                                            ((e.attendance.filter(e => e.status === "P").length / onlydate.length) * 100).toFixed(2) >= 0 ?
                                                                                                0.5 :
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
                                                <label htmlFor="my-modal-6" className="text-xs btn btn-lg btn-circle btn-primary">Daily <br /> Report</label>
                                            </th>)
                                        }


                                        <th colSpan='4' className='text-center  border p-2'>
                                            <p>Marking System</p>
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

                                        <th>
                                            <div onClick={handleAttendanceMarkSubmission} className='flex flex-col items-center justify-center btn btn-info'>
                                                <p>Submit</p>
                                                <p>Attendance</p>
                                                <p>Mark</p>
                                            </div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <button onClick={() => navigate('/')} className='btn btn-outline btn-success mx-auto my-5 flex items-center justify-center'>All Okey</button>
                    </>
                }

                {
                    marksSummary.length > 0 &&
                    <>
                        <h1 className='text-center text-3xl font-bold my-5'>Marks Summary</h1>
                        <div className="overflow-x-auto my-10">
                            <table className="table table-compact table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Batch</th>
                                        <th>Name</th>
                                        <th className='text-center p-3'>Class Test-1 (10)</th>
                                        <th className='text-center p-3'>Class Test-2 (10)</th>
                                        <th className='text-center p-3'>Class Test Final (Avg. = 10)</th>
                                        <th className='text-center p-3'>Mid Term (30)</th>
                                        <th className='text-center p-3'>Final Term (50)</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        marksSummary.map(e =>
                                            <tr key={e._id}>

                                                <th>{e.id}</th>
                                                <td>{e.batch} {e.section} {e.program}</td>
                                                <td>{e.name}</td>
                                                <td className='text-center'>{e.allMarks[0].classTest1}</td>
                                                <td className='text-center'>{e.allMarks[0].classTest2}</td>
                                                <td className='text-center'>{(e.allMarks[0].classTest1 + e.allMarks[0].classTest2) / 2}</td>
                                                <td className='text-center'>{e.allMarks[0].midTerm}</td>
                                                <td className='text-center'>{e.allMarks[0].finalTerm}</td>
                                            </tr>)
                                    }

                                </tbody>
                            </table>
                        </div>
                        <button onClick={() => navigate('/')} className='btn btn-outline btn-success mx-auto my-5 flex items-center justify-center'>All Okey</button>
                    </>
                }




                {/* Modal Body */}
                <input type="checkbox" id="my-modal-6" className="modal-toggle" />
                <div className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <div className="overflow-x-auto">
                            <p className='text-center font-bold mb-5'>Absent Students</p>
                            <table className="table w-full">

                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Batch</th>
                                        <th>Write Reason</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr>
                                        <th>1</th>
                                        <td>Zakir Hossain</td>
                                        <td>63 A Day</td>
                                        <td><textarea className="textarea textarea-info" placeholder="Reason"></textarea></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-action place-content-center">
                            <label htmlFor="my-modal-6" className="btn btn-sm btn-info">Submit</label>
                        </div>
                    </div>
                </div>
            </div>




        </div >
    );
};

export default RegularAttendance;
