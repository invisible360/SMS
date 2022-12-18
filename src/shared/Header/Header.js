import React from 'react';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';

const Header = ({ handleDarkMode }) => {

    return (
        <div>
            <div className="">
                <div className="container mx-auto">
                    <div className="mb-10 shadow-lg px-2">
                        <div className='flex items-center justify-between pt-5'>
                            <Link to='/'>
                                <h2 className="text-4xl tracking-widest font-bold">STUDENT MANAGEMENT SYSTEM</h2>
                            </Link>
                            <p className='space-x-2 items-center flex'>
                                <span>Dark</span><input onClick={handleDarkMode} type="checkbox" className="toggle" /><span>Light</span>
                            </p>
                        </div>
                        <div className="space-x-2 py-3">
                            <Typewriter
                                options={{
                                    strings: [`Develeoped by- <b>Zakir Hossain<sub className="text-xs ml-1">_invisible_360</sub></b>`],
                                    autoStart: true,
                                    loop: true,
                                    delay: 200
                                }}
                            />
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default Header;