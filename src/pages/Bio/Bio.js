import React from 'react';
import profilePhoto from '../../asset/pp.jpeg';
import { VscGithubInverted } from "react-icons/vsc";
import { BsFacebook, BsFillTelephoneFill, BsLinkedin } from "react-icons/bs";
import { GrMail } from "react-icons/gr";


const Bio = () => {
    return (
        <div className='flex items-center'>
            <div className="avatar p-2">
                <div className="w-36 h-44 rounded-xl">
                    <img src={profilePhoto} alt="" />
                </div>
            </div>
            <div className='ml-4 leading-7'>
                <p className='text-lg font-bold'>Zakir Hossain</p>
                <p>Lecturer of CSE Department</p>
                <p>Bangladesh University</p>
                <p>15/1 Iqbal Road, Mohammadpur, Dhaka-1207</p>
                <p>Bangladesh</p>
                <p className='text-2xl mt-2 flex space-x-5'>
                    <VscGithubInverted />
                    <BsLinkedin />
                    <BsFacebook />
                    <GrMail />
                    <BsFillTelephoneFill />
                </p>
            </div>
        </div>
    );
};

export default Bio;