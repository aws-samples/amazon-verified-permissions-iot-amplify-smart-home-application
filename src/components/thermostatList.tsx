import React, {Dispatch, useEffect, useState} from "react";

import {
    Button,
    Card,
    Collection,
    Divider,
    Flex,
    Heading,
    SelectField,
    SliderField,
    SwitchField,
    View,
    useTheme,
} from "@aws-amplify/ui-react";
import {Auth} from "@aws-amplify/auth";
import {useGlobal} from "../context/globalContext";

const {REACT_APP_API_URI} = process.env;

export type ThermostatItem = {
    readonly deviceId: string;
    readonly primaryOwner: string;
}

export type ThermostatProps = {
    readonly items: ThermostatItem[];
    setAlert: Dispatch<React.SetStateAction<string>>
};


interface temperatureAPIPayload {
    temperature: number;
    power: boolean;
    mode: string;
}

const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | number,
    index: number,
    currentArray: any[],
    setStateFunction: React.Dispatch<React.SetStateAction<any[]>>
) => {
    let newValue: string | number | boolean;

    if (typeof e === 'number') {
        newValue = e;
    } else {
        if (e.target.type === 'checkbox') {
            newValue = (e.target as HTMLInputElement).checked;
        } else if (e.target.type === 'number') {
            newValue = Number((e.target as HTMLInputElement).value);
        } else {
            newValue = e.target.value;
        }
    }

    const newState = [...currentArray];
    newState[index] = newValue;
    setStateFunction(newState);
};

//handle input change without element; simply get current array and udpate the specific index
const handleInputChangeNoElement = (
    newValue: string | number | boolean,
    index: number,
    currentArray: any[],
    setStateFunction: React.Dispatch<React.SetStateAction<any[]>>
) => {

    console.log(`${currentArray}, ${newValue}`);
    const newState = [...currentArray];
    newState[index] = newValue;
    setStateFunction(newState);
}


const ThermostatList = (props: ThermostatProps) => {

    const {
        globalTemperature,
        globalTimeHH,
        globalTimeMM,
        globalTimeMeridiem,
    } = useGlobal();

    const {items, setAlert} = props;
    const [selectedTemperature, setSelectedTemperature] = useState<number[]>([0]);
    const [currentTemperature, setCurrentTemperature] = useState<number[]>([0]);
    const [currentMode, setCurrentMode] = useState<string[]>(["Auto"]);
    const [currentPower, setCurrentPower] = useState<boolean[]>([false]);
    const [jwt, setJWT] = useState<string>("");

    const {tokens} = useTheme();

    const makeSetTemperatureAPICall = (deviceId: string, index: number, payload: temperatureAPIPayload,) => {
        fetch(`${REACT_APP_API_URI}/control/${deviceId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                action: "SetTemperature",
                globalTemperature,
                globalTime: `${globalTimeHH}:${globalTimeMM} ${globalTimeMeridiem}`,
                ...payload
            })
        })
            .then(res => {
                res.json()
                    .then(data => {
                        console.log(data);
                        // set the appropriate state
                        // handleInputChangeNoElement(data.temperature, index, selectedTemperature, setSelectedTemperature);
                        // handleInputChangeNoElement(data.power, index, currentPower, setCurrentPower);
                        // handleInputChangeNoElement(data.mode, index, currentMode, setCurrentMode);
                        // alert("SetTemperature API called successfully");
                        setAlert(JSON.stringify(data.evaluation, null, 2));
                    })
                    .catch(e => {
                        console.log("Failed to decode JSON");
                        console.log(e);
                    })
            })
            .catch(err => {
                console.log("Failed to make API call");
                console.log(err);
            })
    }

    const makeGetTemperatureAPICall = (deviceId: string, index: number) => {
        fetch(`${REACT_APP_API_URI}/control/${deviceId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                action: "GetTemperature",
                globalTemperature,
                globalTime: `${globalTimeHH}:${globalTimeMM} ${globalTimeMeridiem}`,
            })
        })
            .then(res => {
                res.json()
                    .then(data => {
                        console.log(data);
                        // set the appropriate state
                        handleInputChangeNoElement(data.payload.reportedTemperature, index, currentTemperature, setCurrentTemperature);
                        handleInputChangeNoElement(data.payload.power, index, currentPower, setCurrentPower);
                        handleInputChangeNoElement(data.payload.mode, index, currentMode, setCurrentMode);
                        // alert(`GetTemperature API called successfully`);
                        setAlert(JSON.stringify(data.evaluation, null, 2));
                    })
                    .catch(e => {
                        console.log("Failed to decode JSON");
                        console.log(e);
                    })
            })
            .catch(err => {
                console.log("Failed to make API call");
                console.log(err);
            })
    }

    useEffect(() => {

        Auth.currentSession()
            .then(response => {
                let accessToken = response.getAccessToken()
                setJWT(accessToken.getJwtToken());
            })
            .catch(e => {
                console.log("Unable to get current session")
                console.log(e)
            });

    }, [])

    return (
        <Card variation="elevated">
            <Collection
                items={items}
                type="list"
                direction="row"
                gap="20px"
                wrap="nowrap"
            >
                {(item, index) => (
                    
                    <Card
                        key={index}
                        borderRadius="medium"
                        maxWidth="20rem"
                        variation="outlined"
                    >
                        
                        <Flex display={"flex"} direction={"row"} justifyContent={'center'}>
                            <Heading
                                level={5}
                            >
                                {item.deviceId}
                            </Heading>
                        </Flex>
                        <Flex display={"flex"} direction={"row"} justifyContent={'center'}>
                            <Heading
                                level={2}
                            >
                                {currentTemperature[index]}
                            </Heading>
                        </Flex>
                        <View padding="xs">
                            <Divider padding="xs"/>
                            <SliderField
                                label="Desired Temperature: "
                                value={selectedTemperature[index]}
                                onChange={e => {
                                    handleInputChange(e, index, selectedTemperature, setSelectedTemperature)
                                }}
                                max={100}
                            />

                            <Card>
                                <SelectField
                                    label="Mode"
                                    value={currentMode[index]}
                                    onChange={
                                        (e) =>
                                            handleInputChange(e, index, currentMode, setCurrentMode)}
                                >
                                    <option value="Auto">Auto</option>
                                    <option value="Heat">Heat</option>
                                    <option value="Cool">Cool</option>
                                </SelectField>
                            </Card> 
 
                            <Card>
                                <SwitchField
                                    label="Thermostat Power"
                                    trackCheckedColor={tokens.colors.green[60]}
                                    isChecked={currentPower[index]}
                                    onChange={(e) => {
                                        handleInputChange(e, index, currentPower, setCurrentPower)
                                        // setCurrentPower(!currentPower)
                                    }}
                                    defaultChecked={true}
                                />
                            </Card>
                            {/*<Card>*/}
                            {/*    <Flex>*/}
                            {/*        {tags.map((badge) => (*/}
                            {/*            <Badge*/}
                            {/*                key={badge}*/}
                            {/*                backgroundColor={*/}
                            {/*                    badge === 'Waterfront' ? 'blue.40'*/}
                            {/*                        : badge === 'Mountain' ? 'green.40' : 'yellow.40'}*/}
                            {/*            >*/}
                            {/*                {badge}*/}
                            {/*            </Badge>*/}
                            {/*        ))}*/}
                            {/*    </Flex>*/}
                            {/*</Card>*/}
                            <Card>
                                <Flex direction={"column"} justifyContent={"space-between"}>
                                    <Button
                                        width={"100%"}
                                        variation={"primary"}
                                        colorTheme={"success"}
                                        onClick={() => {
                                            makeSetTemperatureAPICall(item.deviceId, index, {
                                                temperature: selectedTemperature[index],
                                                power: currentPower[index],
                                                mode: currentMode[index],
                                            })
                                        }}
                                    >
                                        SetTemperature
                                    </Button>
                                    <Button
                                        width={"100%"}
                                        variation={"primary"}
                                        colorTheme={"success"}
                                        onClick={() => {

                                            makeGetTemperatureAPICall(item.deviceId, index)

                                        }}
                                    >
                                        GetTemperature
                                    </Button>
                                </Flex>
                            </Card>
                        </View>
                    </Card>
                )}
            </Collection>
        </Card>
    )
}


export default ThermostatList;