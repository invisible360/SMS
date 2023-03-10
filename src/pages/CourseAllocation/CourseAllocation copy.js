import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { BiRightArrow } from 'react-icons/bi';

import StudentsDistribution from './StudentsDistribution';
import StudentsSelection from './StudentsSelection';

const CourseAllocation = () => {
    // const [dataHold, setDataHold] = useState([]);

    // const sendHoldValue = (valHld) => {

    //     setDataHold(valHld);

    // }

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerStd, handleSubmit: handleSubmitStd } = useForm();

    const sections = [
        {
            _id: 1,
            section: "A"
        },
        {
            _id: 2,
            section: "B"
        },
        {
            _id: 3,
            section: "C"
        },
        {
            _id: 4,
            section: "D"
        },
    ]

    const batches = [
        {
            _id: 1,
            mainBatch: 63,
        },
        {
            _id: 2,
            mainBatch: 62
        },
        {
            _id: 3,
            mainBatch: 61
        },
        {
            _id: 4,
            mainBatch: 60
        }
    ]

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

    const courses = [
        {
            _id: 1,
            code: 'CSE 1301',
            title: 'Physics',
            value: 'cse-1301-physics'
        },
        {
            _id: 2,
            code: 'CSE 1302',
            title: 'Physics Lab',
            value: 'cse-1301-physics-lab'
        },
        {
            _id: 3,
            code: 'CSE 2303',
            title: 'Electrical Drives and Instrumentation',
            value: 'cse-2303-EDI'
        },
        {
            _id: 4,
            code: 'CSE 2304',
            title: 'Electrical Drives and Instrumentation Lab',
            value: 'cse-2303-EDI-lab'
        }
    ]

    const [holdValue, setHoldValue] = useState([]);
    const [list, setList] = useState([]);
    const [selected, setSelected] = useState({});
    const [isCheck, setIsCheck] = useState([]);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [assign, setAssign] = useState([]);
    const [sendHoldValue, setSendHoldvalue] = useState([]);



    const handlefetchStudent = data => {
        const batch = parseInt(data.batch);
        setSelected(data);

        const studentFetchingInfo = {
            batch: batch,
            section: data.section,
            program: data.program
        }

        setIsCheckAll(false);
        setIsCheck([]);

        fetch(`https://sms-server-theta.vercel.app/student-list-fetch`, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(studentFetchingInfo)
        })
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    setList(data);
                }
                else {
                    setList([]);
                }
            })
    }

    const handleStudentAssignment = data => {
        if (isCheckAll) {
            if (list.length === 0) {
                toast.error("No Student Selected");
            }
            setHoldValue([...holdValue, ...list]);

            fetchAssignStd();

        }
        else {
            var passInfo = data.stdInfo;
            if (typeof (data.stdInfo) === 'string') {
                passInfo = [data.stdInfo]
            }

            var assingStd = [];
            for (var i = 0; i < passInfo.length; i++) {
                assingStd.push({ _id: passInfo[i] }
                )
            }
            setHoldValue([...holdValue, ...assingStd]);

            fetchAssignStd()
            // sendHoldValue([...new Map(holdValue.map(item => [item['_id'], item])).values()]);
        }
    }

    const fetchAssignStd = () => {
        const arrayUniqueByKey = [...new Map(holdValue.map(item => [item['_id'], item])).values()];
        // sendHoldValue([...new Map(holdValue.map(item => [item['_id'], item])).values()]);

        const _ids = [];
        arrayUniqueByKey.map(e => _ids.push(e._id));
        // console.log(_ids);

        fetch(`https://sms-server-theta.vercel.app/assigned-students`, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(_ids)
        })
            .then(res => res.json())
            .then(data => {
                setAssign(data);
            })
    }

    // sendHoldValue(holdValue);//problem-1

    const handleSelectAll = () => {
        // setHoldValue([...holdValue, ...list]);

        setIsCheckAll(!isCheckAll);
        setIsCheck(list.map(li => li._id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    const handleClick = e => {
        // setHoldValue([...holdValue, ...selectedStd]);

        setIsCheckAll(false);
        const { id, checked } = e.target;
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== id));
        }
    };


    const { register: register3, handleSubmit: handleSubmit3, formState: { errors: error3 } } = useForm();



    return (
        <div className='min-h-screen'>
            <h1 className='text-center text-3xl font-bold my-5'>Course Allocation</h1>
            <section className='grid grid-cols-2 gap-5'>
                <div className='p-5'>
                    <h3 className='text-center font-bold text-primary text-xl my-5'>Students Selection</h3>
                    <form onSubmit={handleSubmit(handlefetchStudent)} className='flex flex-col items-center justify-center'>
                        {/* Batch selection */}
                        <div className='flex items-center justify-between w-full '>
                            <select {...register("batch", { required: "Batch selection is Required" })} className="select select-primary w-[30%] ">
                                <option value=''>Admitted Batch</option>
                                {
                                    batches.map(batch => <option key={batch._id} value={batch.mainBatch}>{batch.mainBatch}</option>)
                                }
                            </select>

                            {/* Day and Evening Selection  */}
                            <div className='flex items-center w-[35%] space-x-4'>
                                <label className="label-text font-bold">Day</label>
                                <input type="radio" {...register("program", { required: "Program selection is Required" })} value='Day' className="radio checked:bg-blue-500" />

                                <label className="label-text font-bold">Evening</label>
                                <input type="radio" {...register("program", { required: "Program selection is Required" })} value="Evening" className="radio checked:bg-red-500" />

                            </div>

                            {/* Section Selection  */}
                            <select {...register("section", { required: "Section selection is Required" })} className="select select-primary w-[30%] ">
                                <option value=''>Select Section</option>
                                {
                                    sections.map(sections => <option key={sections._id} value={sections.section}>{sections.section}</option>)
                                }
                            </select>
                        </div>

                        {errors.program && <span className='text-red-600'>{errors.program?.message}</span>}
                        {errors.batch && <span className='text-red-600'>{errors.batch?.message}</span>}
                        {errors.section && <span className='text-red-600'>{errors.section?.message}</span>}

                        <input type="submit" value="Show All" className='btn btn-primary btn-sm text-white my-5' />
                    </form>

                    <form onSubmit={handleSubmitStd(handleStudentAssignment)}>
                        <div className="overflow-x-auto my-5">
                            <div className='grid grid-cols-3 gap-2 my-3 text-center'>
                                <p><span className='font-bold text-blue-600'>Batch:</span> {selected.batch}</p>
                                <p><span className='font-bold text-blue-600'>Section:</span> {selected.section}</p>
                                <p><span className='font-bold text-blue-600'>Program:</span> {selected.program}</p>
                            </div>
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Sl.</th>
                                        <th className='flex items-center space-x-3'><input type="checkbox" className="checkbox"
                                            onChange={handleSelectAll}
                                            checked={isCheckAll} /><span>Select All</span></th>
                                        <th>Name</th>
                                        <th>ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        list.length > 0 ?
                                            <>
                                                {list.map((f, i) => <tr key={f._id}>
                                                    <th>{i + 1}</th>

                                                    <td>
                                                        <input type="checkbox" {...registerStd('stdInfo')} value={f._id} className="checkbox"
                                                            id={f._id}
                                                            onChange={handleClick}
                                                            checked={isCheck.includes(f._id)} />
                                                    </td>

                                                    <td>{f.name}</td>
                                                    <td>{f.id}</td>
                                                </tr>)}
                                            </>
                                            :
                                            <tr>
                                                <td colSpan="4" className='text-center text-red-600'>No Data Found</td>
                                            </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className={`text-center ${isCheck.length > 0 || isCheckAll ? 'block' : 'hidden'}`}>
                            <button className='btn btn-primary btn-circle btn-outline btn-lg'><span className='text-5xl'><BiRightArrow /></span></button>
                        </div>
                    </form>

                </div>


                <div className='p-5'>
                    <h3 className='text-center font-bold text-primary text-xl my-5'>Assigned Students</h3>

                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Sl.</th>
                                <th>Delete</th>
                                <th>Name</th>
                                <th>ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                assign.map((std, i) => <tr key={std._id}>
                                    <th>{i + 1}</th>
                                    <td><button className='btn btn-sm btn-error'>X</button></td>
                                    <td>{std.name}</td>
                                    <td>{std.id}</td>
                                </tr>)

                            }
                        </tbody>
                    </table>

                    {/* onSubmit={handleSubmit(handleAssignStudents)}  */}
                    <h3 className='text-center font-bold text-primary text-xl my-5'>Final Assignment</h3>
                    <form className='flex flex-col items-center justify-center'>
                        {/* Semester selection */}
                        <div className='flex items-center justify-between w-full '>
                            <select {...register3("semester", { required: "Semester selection is Required" })} className="select select-primary w-[45%] ">
                                <option value=''>Semester</option>
                                {
                                    semesters.map(semester => <option key={semester._id} value={semester.value}>{semester.name}</option>)
                                }
                            </select>

                            {/* Section Selection  */}
                            <select {...register3("course", { required: "Section selection is Required" })} className="select select-primary w-[45%] ">
                                <option value=''>Select Course</option>
                                {
                                    courses.map(course => <option key={course._id} value={course.value}>{course.code}: {course.title}</option>)
                                }
                            </select>
                        </div>

                        {error3.semester && <span className='text-red-600'>{error3.semester?.message}</span>}
                        {error3.course && <span className='text-red-600'>{error3.course?.message}</span>}
                        {/* {errors.section && <span className='text-red-600'>{errors.section?.message}</span>} */}

                        <input type="submit" value="Submit" className='btn btn-primary btn-sm text-white my-5' />
                    </form>

                </div>
            </section>
        </div>
    );
};

export default CourseAllocation;