import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiRightArrow } from "react-icons/bi";

const StudentsSelection = () => {
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

    const [filter, setFilter] = useState({});
    const [selected, setSelected] = useState({});
    const [btnHidden, setBtnHidden] = useState('hidden');
    // const [selectAll, setSelectAll] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const handleOnChange = () => {
        setIsChecked(!isChecked);
    };

    const handlefetchStudent = data => {
        const batch = parseInt(data.batch);
        setSelected(data);

        const studentFetchingInfo = {
            batch: batch,
            section: data.section,
            program: data.program
        }

        fetch(`http://localhost:5000/student-list-fetch`, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(studentFetchingInfo)
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.length > 0) {
                    setFilter(data);
                    setBtnHidden('block');
                    setIsChecked(false)
                }
                else {
                    setFilter([]);
                    setBtnHidden('hidden');
                    setIsChecked(false)
                }

            })
    }

    const handleStudentAssignment = data => {
        console.log(data);
        var passInfo = data.stdInfo;
        if (typeof (data.stdInfo) === 'string') {
            passInfo = [data.stdInfo]
        }
        var assingStd = [];
        for (var i = 0; i < passInfo.length; i++) {
            assingStd.push({
                name: passInfo[i].split(' ')[0],
                id: parseInt((passInfo[i].split(' ')[1])),
                batch: selected.batch,
                section: selected.section,
                program: selected.program
            })
        }
        console.log(assingStd);
    }

    return (
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
                                <th className='flex items-center space-x-3'><input type="checkbox" className="checkbox" checked={isChecked}
                                    onChange={handleOnChange} /><span>Select All</span></th>
                                <th>Name</th>
                                <th>ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filter.length > 0 ?
                                    <>
                                        {filter.map((f, i) => <tr key={f._id}>
                                            <th>{i + 1}</th>
                                            {/* {
                                                selectAll ? 
                                                <td><input type="checkbox" {...registerStd('stdInfo')} value={`${f.name} ${parseInt(f.id)}`} className="checkbox" checked={selectAll} /></td>
                                                :
                                                <td><input type="checkbox" {...registerStd('stdInfo')} value={`${f.name} ${parseInt(f.id)}`} className="checkbox" /></td>
                                            } */}
                                            <td><input type="checkbox" {...registerStd('stdInfo')} value={`${f.name} ${parseInt(f.id)}`} className="checkbox" checked={isChecked} /></td>


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
                <div className={`text-center ${btnHidden}`}>
                    <button className='btn btn-primary btn-circle btn-outline btn-lg'><span className='text-5xl'><BiRightArrow /></span></button>
                </div>
            </form>

        </div>
    );
};

export default StudentsSelection;