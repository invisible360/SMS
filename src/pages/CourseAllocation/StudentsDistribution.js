import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const StudentsDistribution = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate ()

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

    const handleAssignStudents = data => {

    }

    return (
        <div className='p-5'>
            <h3 className='text-center font-bold text-primary text-xl my-5'>Assigned Students</h3>
            <form>
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Sl.</th>
                            <th className='flex items-center space-x-3'>Delete</th>
                            <th>Name</th>
                            <th>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>1</th>
                            <td><button className='btn btn-circle btn-error text-white btn-sm'>X</button></td>
                            <td>akash</td>
                            <td>1205</td>
                        </tr>
                    </tbody>
                </table>

            </form>

            <h3 className='text-center font-bold text-primary text-xl my-5'>Final Assignment</h3>
            <form onSubmit={handleSubmit(handleAssignStudents)} className='flex flex-col items-center justify-center'>
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

                {errors.program && <span className='text-red-600'>{errors.program?.message}</span>}
                {errors.batch && <span className='text-red-600'>{errors.batch?.message}</span>}
                {errors.section && <span className='text-red-600'>{errors.section?.message}</span>}

                <input type="submit" onClick={()=> navigate (0)} value="Submit" className='btn btn-primary btn-sm text-white my-5' />
            </form>

        </div>
    );
};

export default StudentsDistribution;