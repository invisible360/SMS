import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAppState from '../../hook/useAppState';

const StudentsDistribution = () => {
    const navigate = useNavigate();
    const [storedStd, setStroredStd] = useAppState([]);// context
    const [alreadyExist, setAlreadyExist] = useState([]);
    const [finalAssignemnt, setFinalAssignment] = useState([]);

    const { register, handleSubmit, formState: { errors } } = useForm();

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

    const handleDeleteStd = (_id) => {
        setAlreadyExist([])

        const remainingStd = storedStd.filter(e => e._id !== _id);

        setStroredStd(remainingStd);
    }

    const handleAssignStudents = data => {
        const confirm = window.confirm("Are You Sure Want to Enroll the Assigned Students?");
        if (confirm) {
            setFinalAssignment([storedStd.filter(e => !e.course.includes(data.course)), data.course]) //oi course bade onno course selection

            setAlreadyExist(storedStd.filter(e => e.course.includes(data.course)))
            // setFinalAssignment(storedStd.map(e => e.course.map(c => c !== data.course)))
            // setFinalAssignment(storedStd.map(e => ({ ...e,course: data.course })))
        } else {
            setFinalAssignment([])
        }

    }


    useEffect(() => {
        if (alreadyExist.length > 0) {
            toast.error("Following IDs are Already Enrolled!");
            return;
        }
        else if (finalAssignemnt.length > 0) {

            fetch('http://localhost:5000/spring-2023-std-list', {
                method: 'PUT',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(finalAssignemnt)
            })
                .then(res => res.json())
                .then(result => {
                    navigate(0);
                    toast.success("Successful Operation")
                })
            // .catch(err => toast.error("Exception Encountered!"))
        }

    }, [finalAssignemnt])

    return (
        <div className='p-5'>

            {
                alreadyExist.length > 0 &&
                <>
                    <h3 className='text-center font-bold text-primary text-xl my-5'>Already Assigned Student</h3>
                    <p className='text-red-600'>***Following Students are already Enrolled for this particular course, Please remove them from Assigned Students Table to continue enrollment</p>
                    <table className="table w-full">

                        <thead>
                            <tr>
                                <th>Sl.</th>
                                <th>ID</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                alreadyExist.map((aldAss, i) => <tr key={aldAss._id}>
                                    <td>{i + 1}</td>
                                    <td>{aldAss.id}</td>
                                    <td>{aldAss.name}</td>
                                </tr>)

                            }
                        </tbody>
                    </table>

                </>
            }


            <h3 className='text-center font-bold text-primary text-xl my-5'>Final Assignment</h3>
            <form onSubmit={handleSubmit(handleAssignStudents)} className='flex flex-col items-center justify-center'>
                {/* Semester selection */}
                <div className='flex items-center justify-between w-full '>
                    <select {...register("course", { required: "Section selection is Required" })} className="select select-primary w-full">
                        <option value=''>Select Course</option>
                        {
                            courses.map(course => <option key={course._id} value={course.value}>{course.code}: {course.title}</option>)
                        }
                    </select>
                </div>
                {errors.course && <span className='text-red-600'>{errors.course?.message}</span>}



                <h3 className='text-center font-bold text-primary text-xl my-5'>Assigned Students</h3>

                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Sl.</th>
                            <th>Delete</th>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            storedStd.map((std, i) => <tr key={std._id}>
                                <th>{i + 1}</th>
                                <td><button onClick={() => handleDeleteStd(std._id)} className='btn btn-sm btn-error'>X</button></td>
                                <td>{std.id}</td>
                                <td>{std.name}</td>
                            </tr>)

                        }
                    </tbody>
                </table>

                <input type="submit" value="Submit" className={`btn btn-primary btn-sm text-white my-5 ${storedStd.length === 0 && 'hidden'}`} />
            </form>

        </div>
    );
};

export default StudentsDistribution;