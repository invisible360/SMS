import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const StudentsDistribution = ({ dataHold }) => {
    // const [fetchId, setFetchId] = useState([]);
    // console.log(dataHold);
    const arrayUniqueByKey = [...new Map(dataHold.map(item =>
        [item['_id'], item])).values()];
    // console.log(arrayUniqueByKey);

    const _ids = [];
    arrayUniqueByKey.map(e => _ids.push(e._id));
    // console.log(_ids);

    const [assign, setAssign] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/assigned-students`, {
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
    }, [_ids])


    const { register, handleSubmit, formState: { errors } } = useForm();

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
    // const [finalAssignemnt, setFinalAssignment] = useState([]);

    // const handleAssignStudents = data => {

    //     setFinalAssignment(arrayUniqueByKey.map(e => ({ ...e, semester: data.semester, course: data.course })))
    // }
    // console.log(finalAssignemnt);

    return (
        <div className='p-5'>
            <h3 className='text-center font-bold text-primary text-xl my-5'>Assigned Students</h3>
            <form>
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Sl.</th>
                            <th>Name</th>
                            <th>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            assign.map((std, i) => <tr key={std._id}>
                                <th>{i + 1}</th>
                                <td>{std.name}</td>
                                <td>{std.id}</td>
                            </tr>)

                        }
                    </tbody>
                </table>


            </form>
            {/* onSubmit={handleSubmit(handleAssignStudents)}  */}
            <h3 className='text-center font-bold text-primary text-xl my-5'>Final Assignment</h3>
            <form className='flex flex-col items-center justify-center'>
                {/* Semester selection */}
                <div className='flex items-center justify-between w-full '>
                    <select {...register("semester", { required: "Semester selection is Required" })} className="select select-primary w-[45%] ">
                        <option value=''>Semester</option>
                        {
                            semesters.map(semester => <option key={semester._id} value={semester.value}>{semester.name}</option>)
                        }
                    </select>

                    {/* Section Selection  */}
                    <select {...register("course", { required: "Section selection is Required" })} className="select select-primary w-[45%] ">
                        <option value=''>Select Course</option>
                        {
                            courses.map(course => <option key={course._id} value={course.value}>{course.code}: {course.title}</option>)
                        }
                    </select>
                </div>

                {errors.semester && <span className='text-red-600'>{errors.semester?.message}</span>}
                {errors.course && <span className='text-red-600'>{errors.course?.message}</span>}
                {/* {errors.section && <span className='text-red-600'>{errors.section?.message}</span>} */}

                <input type="submit" value="Submit" className='btn btn-primary btn-sm text-white my-5' />
            </form>

        </div>
    );
};

export default StudentsDistribution;