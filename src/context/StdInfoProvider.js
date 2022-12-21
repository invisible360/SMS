import React, { createContext, useState } from 'react';

export const StdInfoProviderContext = createContext();

const StdInfoProvider = ({ children }) => {

    const value = {
        value: useState([]),
        list: useState(false)
    }

    return (
        <StdInfoProviderContext.Provider value={value}>
            {children}
        </StdInfoProviderContext.Provider>
    );
};

export default StdInfoProvider;