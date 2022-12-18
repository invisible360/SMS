import React from 'react';
import { Link } from 'react-router-dom';

const Feature = ({ feature }) => {
    return (
        <Link to={feature.route} className=" transition ease-in-out delay-50 bg-primary hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300">
            <div className="card-body">
                <h2 className="card-title place-content-center text-white">{feature.name}</h2>
            </div>
        </Link>
    );
};

export default Feature;