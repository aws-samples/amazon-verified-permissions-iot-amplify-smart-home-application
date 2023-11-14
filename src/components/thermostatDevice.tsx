import React, {useEffect, useState} from "react";

import {
    Badge,
    Button,
    Card,
    Divider,
    Flex,
    Heading,
    SelectField,
    SliderField,
    SwitchField,
    useTheme,
    View
} from "@aws-amplify/ui-react";
import {Auth} from "@aws-amplify/auth";

const {REACT_APP_API_URI} = process.env;

interface ThermostatDeviceProps {
    deviceId: string;
    primaryOwner: string;
}

const ThermostatDevice = ({deviceId, primaryOwner}: ThermostatDeviceProps) => {

    const [selectedTemperature, setSelectedTemperature] = useState(0);
    const [selectedModeValue, setSelectedModeValue] = useState("Auto");

    const [currentTemperature, setCurrentTemperature] = useState(0);
    const [currentMode, setCurrentMode] = useState("Auto");
    const [currentPower, setCurrentPower] = useState(true);
    const [tags, setTags] = useState<string[]>([]);
    const [name, setName] = useState("");

    setTags(["Smart Thermostat", "Home1"]);

    const {tokens} = useTheme();

    useEffect(() => {
        console.log("Use effect called under ThermostatDevice");
        setName(deviceId);
        setTags(["Smart Thermostat", "Home1"]);
    
        Auth.currentSession()
            .then(response => {
                let accessToken = response.getAccessToken()
                let jwt = accessToken.getJwtToken();
    
                console.log(`Sending JWT ${jwt}`);
    
                fetch(`${REACT_APP_API_URI}/control/${deviceId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    },
                    body: JSON.stringify({
                        deviceId,
                        action: "GetTemperature",
                    })
    
                })
                    .then(res => {
                        console.log(res);
                        return res.json()
                            .then(data => {
                                console.log(data);
                                setCurrentTemperature(data.state.reported.temperature);
                                setCurrentMode(data.state.reported.data.mode);
                                setCurrentPower(data.state.reported.data.power);
                            })
                            .catch(e => {
                                console.log(e);
                            });
                    })
                    .catch(e => {
                        console.log(e);
    
                    }).catch(e => {
                    console.log(e);
                });
    
            })
            .catch(e => {
                console.log("Error getting current session");
                console.log(e)
            });
    }, []);

    return <Card
        borderRadius="medium"
        maxWidth="20rem"
        variation="outlined"
    >
        <Flex display={"flex"} direction={"row"} justifyContent={'center'}>
            <Heading
                level={2}
            >
                {currentTemperature}
            </Heading>
        </Flex>
        <Flex display={"flex"} direction={"row"} justifyContent={'center'}>
            <Heading
                level={5}
            >
                {name}
            </Heading>
        </Flex>

        <View padding="xs">
            <Divider padding="xs"/>
            <SliderField
                label="Set temperature"
                onChange={setSelectedTemperature}
                value={selectedTemperature}
                max={100}
            />

            <Card>
                <SelectField
                    label="Mode"
                    value={selectedModeValue}
                    onChange={(e) => setSelectedModeValue(e.target.value)}
                >
                    <option value="Auto">Auto</option>
                    <option value="Heat">Heat</option>
                    <option value="Cool">Cool</option>
                </SelectField>
            </Card>
            <Card>
                <Button width={"100%"} variation={"primary"} colorTheme={"success"}>
                    Set values
                </Button>
            </Card>
            <Card>
                <SwitchField
                    label="Thermostat Power"
                    trackCheckedColor={tokens.colors.green[60]}
                    defaultChecked={true}
                />
            </Card>
            <Card>
                <Flex>
                    {tags.map((badge) => (
                        <Badge
                            key={badge}
                            backgroundColor={
                                badge === 'Waterfront' ? 'blue.40'
                                    : badge === 'Mountain' ? 'green.40' : 'yellow.40'}
                        >
                            {badge}
                        </Badge>
                    ))}
                </Flex>
            </Card>
        </View>
    </Card>
}

export default ThermostatDevice;