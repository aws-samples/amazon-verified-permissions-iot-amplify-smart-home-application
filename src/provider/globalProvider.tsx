import React, {useState} from "react";
import {GlobalContext} from "../context/globalContext";
import {format as formatDate} from "date-fns";


interface GlobalProviderProps {
    children: React.ReactNode;
    // Any other props you might need
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({children}: GlobalProviderProps) => {


    const currentTimestamp = new Date();
    const currentHour = Number(formatDate(currentTimestamp, "h"));
    const currentMinute = currentTimestamp.getMinutes();
    const currentMeridian = currentTimestamp.getHours() >= 12 ? "PM" : "AM";

    const [globalTemperature, setGlobalTemperature] = useState<number>(78);
    const [globalTimeHH, setGlobalTimeHH] = useState<number>(currentHour);
    const [globalTimeMM, setGlobalTimeMM] = useState<number>(currentMinute);
    const [globalTimeMeridiem, setGlobalTimeMeridiem] = useState<string>(currentMeridian);

    return (
        <GlobalContext.Provider value={{
            globalTemperature,
            setGlobalTemperature,
            globalTimeHH,
            setGlobalTimeHH,
            globalTimeMM,
            setGlobalTimeMM,
            globalTimeMeridiem,
            setGlobalTimeMeridiem
        }}>
            {children}
        </GlobalContext.Provider>
    );
};