import React, {createContext, useContext} from 'react';

import {format as formatDate} from "date-fns";

// create a context called GlobalContext
// It will have 2 values, first one will be temperature which is a number
// and second will be string HH:MM:AM/PM
type GlobalContextType = {
    globalTemperature: number;
    setGlobalTemperature: React.Dispatch<React.SetStateAction<number>>;
    globalTimeHH: number;
    setGlobalTimeHH: React.Dispatch<React.SetStateAction<number>>;
    globalTimeMM: number;
    setGlobalTimeMM: React.Dispatch<React.SetStateAction<number>>;
    globalTimeMeridiem: string;
    setGlobalTimeMeridiem: React.Dispatch<React.SetStateAction<string>>;
}

const currentTimestamp = new Date();
const currentHour = Number(formatDate(currentTimestamp, "h"));
const currentMinute = currentTimestamp.getMinutes();
const currentMeridian = currentTimestamp.getHours() >= 12 ? "PM" : "AM";

const defaultContextValue: GlobalContextType = {
    globalTemperature: 78,
    setGlobalTemperature: () => {
    },  // dummy function as placeholder
    globalTimeHH: currentHour,
    setGlobalTimeHH: () => {
    },  // dummy function as placeholder
    globalTimeMM: currentMinute,
    setGlobalTimeMM: () => {
    },
    globalTimeMeridiem:  currentMeridian,
    setGlobalTimeMeridiem: () => {
    }
}

export const GlobalContext = createContext<GlobalContextType>(defaultContextValue);

export const useGlobal = () => {
    return useContext(GlobalContext);
};

