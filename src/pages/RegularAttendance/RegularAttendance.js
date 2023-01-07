import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
// import InputLog from './InputLog';
import { MdAddCircle } from "react-icons/md";
// import { Link } from 'react-router-dom';

// import { ImCheckmark, ImCross } from "react-icons/im";
import Attendance from './Attendance';
import { format } from 'date-fns';

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

    const [presentList, setPresentList] = useState([]);
    const [ct1List, setCt1List] = useState([]);
    const [ct2List, setCt2List] = useState([]);
    const [midTerm, setMidterm] = useState([]);
    const [finalTerm, setFinalterm] = useState([]);



    // const [inputProgram, setInputProgram] = useState('');
    // const [inputSection, setInputSection] = useState('');
    const [inputCourse, setInputCourse] = useState('');
    // const [inputSemester, setInputSemester] = useState('');


    const handleSemesterFetching = (e) => {
        const getSemester = e.target.value;
        fetch(`http://localhost:5000/semester-courses/${getSemester}`)
            .then(res => res.json())
            .then(data => {
                if (data.length === 0) {
                    toast.error("Not Found");
                    setStudnts([]);
                    setInputMode('Not Selected')
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
        // setInputProgram(program)
        // setInputSemester(semester)
        // setInputSection(section)

        if (semester === '' || program === '' || section === '' || course === '') {
            toast.error('All Input Selection is Mandatory')
        }
        else {

            const searchData = { semester, program, section, course }

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
                    // setNotFound(true);
                })
        }
    }

    // Most Important Function 
    const filtering = (obj, list, setList, message) => {
        const alreadyExist = list.find(e => e._id === obj._id);
        if (typeof alreadyExist === 'undefined') {
            setList([...list, ...[obj]]);
        }
        else {
            const newList = list.filter(e => e._id !== alreadyExist._id)
            setList([...newList, ...[obj]]);
            if (message) {
                toast.success(message)
            }
        }
    }

    const handleAttend = (newAttend) => {
        filtering(newAttend, presentList, setPresentList, "Status Changed")
    }

    const handleCT1 = (e) => {
        const _id = e.target.name;
        const id = e.target.id;
        const value = e.target.value;

        const ct1 = {
            _id, id, mark: value,
            course: inputCourse,
        }

        if (value > 11) {
            toast.error("CT Marks must be less than equal 10");
            e.target.value = '';
            ct1.mark = '';
            filtering(ct1, ct1List, setCt1List)
        }
        else {
            filtering(ct1, ct1List, setCt1List)
        }

    }

    const handleCT2 = (e) => {
        const _id = e.target.name;
        const id = e.target.id;
        const value = e.target.value;
        const ct2 = {
            _id, id, mark: value,
            course: inputCourse,
        }

        if (value > 11) {
            toast.error("CT Marks must be less than equal 10");
            e.target.value = '';
            ct2.mark = '';
            filtering(ct2, ct2List, setCt2List)
        }
        else {
            filtering(ct2, ct2List, setCt2List)
        }

    }

    const handleMid = (e) => {
        const _id = e.target.name;
        const id = e.target.id;
        const value = e.target.value;
        const mid = {
            _id, id, mark: value,
            course: inputCourse,
        }

        if (value > 31) {
            toast.error("Mid Term Marks must be less than equal 30");
            e.target.value = '';
            mid.mark = '';
            filtering(mid, midTerm, setMidterm)
        }
        else {
            filtering(mid, midTerm, setMidterm)
        }

    }

    const handleFinal = (e) => {
        const _id = e.target.name;
        const id = e.target.id;
        const value = e.target.value;
        const final = {
            _id, id, mark: value,
            course: inputCourse,
        }

        if (value > 51) {
            toast.error("Mid Term Marks must be less than equal 30");
            e.target.value = '';
            final.mark = '';
            filtering(final, finalTerm, setFinalterm)
        }
        else {
            filtering(final, finalTerm, setFinalterm)
        }

    }


    const handleSubmission = e => {
        e.preventDefault();

        if (presentList.length > 0) {
            if (presentList.length !== studnts.length) {
                toast.error("Select All for Attendance");
            }
            else {
                toast.success(`Attendace Submitted for ${format(new Date(), "PP")}`)
                console.log(presentList);
            }
        }

        else if (ct1List.length > 0) {
            const isMark = ct1List.map(e => e.mark);
            if (ct1List.length !== studnts.length || isMark.includes("")) {
                toast.error("Some CT-1 Inputs are Missing");
            }
            else {
                toast.success("CT-1 Marks Successfully Submitted")
                //navigation hobe to another page show details
                console.log(ct1List);
            }

        }

        else if (ct2List.length > 0) {
            const isMark = ct2List.map(e => e.mark);
            if (ct2List.length !== studnts.length || isMark.includes("")) {
                toast.error("Some CT-2 Inputs are Missing");
            }
            else {
                toast.success("CT-2 Marks Successfully Submitted")
                //navigation hobe to another page show details
                console.log(ct2List);
            }

        }

        else if (midTerm.length > 0) {
            const isMark = midTerm.map(e => e.mark);
            if (midTerm.length !== studnts.length || isMark.includes("")) {
                toast.error("Some Mid Term Inputs are Missing");
            }
            else {
                toast.success("Mid Terms Marks Successfully Submitted")
                //navigation hobe to another page show details
                console.log(midTerm);
            }

        }

        else if (finalTerm.length > 0) {
            const isMark = finalTerm.map(e => e.mark);
            if (finalTerm.length !== studnts.length || isMark.includes("")) {
                toast.error("Some Final Term Inputs are Missing");
            }
            else {
                toast.success("Final Term Marks Successfully Submitted")
                //navigation hobe to another page show details
                console.log(finalTerm);
            }

        }

        else {
            toast.error("No Input Action taken")
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
                <div className='grid grid-cols-2'>

                    {/* Table to show student data */}
                    <div className="overflow-x-auto">
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

                    {/* Input Action */}
                    <div>
                        <div className={`dropdown dropdown-hover dropdown-left ${studnts.length === 0 ? 'hidden' : ''} `}>
                            <label tabIndex={0} className="btn btn-info m-1"><p className='text-2xl w-52 flex items-center justify-center'><MdAddCircle></MdAddCircle></p></label>
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
                                            }}>{input.value}</span>
                                        </li>)
                                }
                            </ul>
                        </div>

                        {
                            studnts.length > 0 && <span className='text-xl text-right text-green-600 mb-5'>Input: {inputMode}</span>
                        }


                        <form onSubmit={handleSubmission} className='flex flex-col'>
                            <div>

                                {
                                    inputMode === 'ATTENDANCE' &&
                                    studnts.map((atted, i) => <Attendance
                                        key={i}
                                        atted={atted}
                                        inputCourse={inputCourse}
                                        handleAttend={handleAttend}
                                    ></Attendance>)
                                }

                                {
                                    inputMode === 'CLASS TEST - 1' &&
                                    studnts.map((ct1, i) => <input onBlur={handleCT1} key={i} name={ct1._id} id={ct1.id} type="number" placeholder="CT-1" className="input input-bordered text-center max-w-xs input-primary m-1" />)
                                }

                                {
                                    inputMode === 'CLASS TEST - 2' &&
                                    studnts.map((ct2, i) => <input onBlur={handleCT2} key={i} name={ct2._id} id={ct2.id} type="number" placeholder="CT-2" className="input input-bordered text-center max-w-xs input-primary m-1" />)
                                }

                                {
                                    inputMode === 'MID TERM' &&
                                    studnts.map((mid, i) => <input onBlur={handleMid} key={i} name={mid._id} id={mid.id} type="number" placeholder="Mid Term" className="input input-bordered text-center max-w-xs input-primary m-1" />)
                                }

                                {
                                    inputMode === 'FINAL TERM' &&
                                    studnts.map((final, i) => <input onBlur={handleFinal} key={i} name={final._id} id={final.id} type="number" placeholder="Final Term" className="input input-bordered text-center max-w-xs input-primary m-1" />)
                                }
                            </div>

                            {
                                inputMode !== 'Not Selected' &&
                                <input type="submit" className='btn btn-warning mt-1 w-[15.5rem]' value="Submit" />
                            }
                        </form>

                    </div>
                </div>

            </div>


        </div >
    );
};

export default RegularAttendance;
