import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const EntryStudents = () => {

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

    const countryCodes = [
        {
            _id: 1,
            code: '+880',
            country: 'Bangladesh',
            flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Flag_of_Bangladesh.svg/1200px-Flag_of_Bangladesh.svg.png"
        },
        {
            _id: 2,
            code: '+7',
            country: 'Russia',
            flag: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/640px-Flag_of_Russia.svg.png"
        },
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

    const { register, handleSubmit, formState: { errors } } = useForm();

    const imageHostKey = process.env.REACT_APP_imgbb_key;

    const handleStudentEntry = data => {

        // image uploading handling
        // console.log(data.image.length);
        if (data.image.length === 0) {
            toast.error('Image Upload Required')
        }

        else {
            const image = data.image[0];
            const formData = new FormData();
            // console.log(formData);
            formData.append('image', image);
            const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;

            fetch(url, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(imgData => {
                    if (imgData.success) {
                        const studentData = {
                            batch: parseInt(data.batch),
                            id: parseInt(data.studentId),
                            name: data.name,
                            section: data.section,
                            program: data.program,
                            email: data.email,
                            countryCode: parseInt(data.countryCode),
                            phone: parseInt(data.phone),
                            photo: imgData.data.url,
                            semester: data.semester,
                            course: []
                        }

                        fetch('http://localhost:5000/student-list')
                            .then(res => res.json())
                            .then(allStudents => {
                                const alreadyEntry = allStudents.find(student => student.id === studentData.id && student.semester === studentData.semester && student.batch === studentData.batch);

                                if (alreadyEntry) {
                                    toast.error(`This ID Already Entered for ${studentData.semester}`);
                                }

                                else {
                                    fetch('http://localhost:5000/student-list', {
                                        method: 'POST',
                                        headers: {
                                            'content-type': 'application/json'
                                        },
                                        body: JSON.stringify(studentData)
                                    })
                                        .then(res => res.json())
                                        .then(result => {
                                            // console.log(result);
                                            if (result.acknowledged) {
                                                toast.success('Entry Successful');
                                            }
                                        })
                                }
                            })
                    }
                })
        }
    }


    return (
        <div className='min-h-screen'>

            <h1 className='text-center text-3xl font-bold my-5 '>Student Entry</h1>
            <form onSubmit={handleSubmit(handleStudentEntry)} className=' flex items-center justify-center flex-col space-y-5 w-1/2 mx-auto my-5'>

                {/* Student name Field  */}
                <input type="text" {...register("name", { required: "Name is Required" })} placeholder="Name" className="input input-bordered input-primary w-full " />
                {errors.name && <span className='text-red-600'>{errors.name?.message}</span>}

                {/* Student ID Field */}
                <input type="number" {...register("studentId", {
                    required: "ID required",
                    minLength: { value: 12, message: "ID must be 12 Digit" },
                    maxLength: { value: 12, message: "ID must be 12 Digit" },
                })} placeholder="ID" className="input input-bordered input-primary w-full" />
                {errors.studentId && <span className='text-red-600'>{errors.studentId?.message}</span>}

                {/* semester selection  */}
                <select {...register("semester", { required: "Semester selection is Required" })} className="select select-primary w-full ">
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
                        <option value=''>Select Current Section</option>
                        {
                            sections.map(sections => <option key={sections._id} value={sections.section}>{sections.section}</option>)
                        }
                    </select>
                </div>

                {errors.batch && <span className='text-red-600'>{errors.batch?.message}</span>}
                {errors.program && <span className='text-red-600'>{errors.program?.message}</span>}
                {errors.section && <span className='text-red-600'>{errors.section?.message}</span>}

                {/* Student Email Field  */}
                <input type="email" {...register("email", { required: "Email is Required" })} placeholder="Email" className="input input-bordered input-primary w-full " />
                {errors.email && <span className='text-red-600'>{errors.email?.message}</span>}

                <div className='w-full'>
                    <div className=''>
                        <select {...register("countryCode")} className="select select-primary w-[30%] ">
                            {/* <option value=''>Country Code</option> */}
                            {
                                countryCodes.map(code => <option key={code._id} value={code.code}>{code.code}</option>)
                            }
                        </select>

                        <input type="number"

                            {
                            ...register("phone", {
                                required: "This field is required",
                                minLength: { value: 10, message: "Phone Number must be 10 Digit" },
                                maxLength: { value: 10, message: "Phone Number must be 10 Digit" },
                            })
                            }

                            placeholder='1XXXXXXXXX' className='input input-bordered input-primary w-[66%] ml-5' />

                    </div>

                    {errors.phone && <p className='text-red-500'>{errors.phone.message}</p>}



                </div>
                <div className='w-full'>
                    <label className="label">
                        <span className="label-text">Upload Photo (size not more than 15MB)</span>
                    </label>
                    <input type="file" {...register("image")} className="file-input file-input-bordered file-input-primary w-full" />
                </div>

                <input type="submit" value="Enter" className='btn btn-primary w-full text-white' />
            </form>

        </div>
    );
};

export default EntryStudents;