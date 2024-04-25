import React, { useContext, createContext, useState } from 'react';

const BlocklyDataContext = createContext();

export const useBlocklyData = () => useContext(BlocklyDataContext);

export const BlocklyDataProvider = ({ children }) => {
    const [blockResponse, setBlockResponse] = useState('');

    return (
        <BlocklyDataContext.Provider value={{ blockResponse, setBlockResponse }}>
            {children}
        </BlocklyDataContext.Provider>
    );
};
