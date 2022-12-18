import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../shared/Footer/Footer';
import Header from '../shared/Header/Header';

const Main = () => {
    const [theme, setTheme] = useState('night');

    const handleDarkMode = () => {
        if (theme === 'night') {
            setTheme('winter');
        } else {
            setTheme('night');
        }
    }

    return (
        <div data-theme={theme}>
            <Header handleDarkMode={handleDarkMode}></Header>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Main;