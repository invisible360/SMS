import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { BiRightArrow } from "react-icons/bi";
import { AiOutlineReload } from "react-icons/ai";
import useAppState from '../../hook/useAppState';
import useListState from '../../hook/useListState';


const StudentsSelection = ({ sendHoldValue }) => {
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

    const [storedStd, setStroredStd] = useAppState([]);
    // const [reload, setReload] = useListState();

    const [holdValue, setHoldValue] = useState([]);
    const [list, setList] = useState([]);
    const [selected, setSelected] = useState({});
    const [isCheck, setIsCheck] = useState([]);
    const [isCheckAll, setIsCheckAll] = useState(false);


    const handlefetchStudent = data => {
        const batch = parseInt(data.batch);
        setSelected(data);

        const studentFetchingInfo = {
            batch: batch,
            section: data.section,
            program: data.program,
            semester: data.semester
        }

        setIsCheckAll(false);
        // setIsCheck([]);

        fetch(`http://localhost:5000/student-list-fetch`, {
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
                    fetchAssignStd([]);
                }
                else {
                    setList([]);
                }
            })
    }

    // const handleStudentAssignment = event => {
    //     event.preventDefault();
    //     const data = event.target.asd;
    //     console.log(data);

    // }

    const handleStudentAssignment = data => {
        // setReload(false);
        // console.log(data.stdInfo);
        // console.log(storedStd);

        if (isCheckAll) {
            if (list.length === 0) {
                toast.error("Choose Semester, Batch, section and Program");
            }
            // setHoldValue([...holdValue, ...list]);
            else {

                // setHoldValue(list);
                // setStroredStd(holdValue);
                fetchAssignStd(list);
            }
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
            // console.log([...storedStd, ...assingStd]);
            // console.log(assingStd);
            // setHoldValue([...holdValue, ...assingStd]);
            // setHoldValue(assingStd);
            // setStroredStd(holdValue);
            // fetchAssignStd(assingStd);
            fetchAssignStd([...storedStd, ...assingStd]);

        }
    }

    const fetchAssignStd = (holdValue) => {
        // const arrayUniqueByKey = [...new Map(holdValue.map(item => [item['_id'], item])).values()];
        const _ids = [];
        // arrayUniqueByKey.map(e => _ids.push(e._id));
        holdValue.map(e => _ids.push(e._id));
        // console.log(_ids);


        fetch(`http://localhost:5000/assigned-students`, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(_ids)
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                // sendHoldValue(data);
                setStroredStd(data)
                // setHoldValue ([]);
                setIsCheck([]);
                setIsCheckAll(false);

            })

    }

    // sendHoldValue(holdValue);//problem-1**** douvble click a data load hocche

    const handleSelectAll = () => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(list.map(li => li._id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    const handleClick = e => {
        // setReload(false)
        setIsCheckAll(false);
        const { id, checked } = e.target;
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== id));
        }
    };

    return (
        <div className='p-5'>
            <h3 className='text-center font-bold text-primary text-xl my-5'>Students Selection</h3>
            <form onSubmit={handleSubmit(handlefetchStudent)} className='flex flex-col items-center justify-center'>
                
                {/* semester selection  */}
                <select {...register("semester", { required: "Semester selection is Required" })} className="select select-primary w-full mb-5">
                    <option value=''>Semester</option>
                    {
                        semesters.map(semester => <option key={semester._id} value={semester.value}>{semester.name}</option>)
                    }
                </select>
                {errors.semester && <span className='text-red-600'>{errors.semester?.message}</span>}

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
                    <div className='grid grid-cols-4 gap-1 my-3 text-center'>
                        <p><span className='font-bold text-blue-600'>Semester:</span> {selected.semester}</p>
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
                                <th>ID</th>
                                <th>Name</th>
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

                                            <td>{f.id}</td>
                                            <td>{f.name}</td>
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
                    {/* <button className='btn btn-primary btn-circle btn-outline btn-lg'><span className='text-5xl'>{reload ? <AiOutlineReload /> : <BiRightArrow />}</span></button> */}
                    <button className='btn btn-primary btn-circle btn-outline btn-lg'><span className='text-5xl'><BiRightArrow /></span></button>
                </div>
            </form>

        </div>
    );
};

export default StudentsSelection;