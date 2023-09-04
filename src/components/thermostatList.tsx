import React, {useEffect, useState} from "react";

import {
    Badge,
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

export type ThermostatItem = {
    readonly deviceId: string;
    readonly primaryOwner: string;
}

export type ThermostatProps = {
    readonly items: ThermostatItem[];
};

const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    setStateFunction: React.Dispatch<React.SetStateAction<any[]>>,
    isBoolean: boolean = false
  ) => {
    const newValue = isBoolean ? e.target.isChecked : e.target.value;
    const newState = [...(setStateFunction as any)];
    newState[index] = newValue;
    setStateFunction(newState);
  };

const ThermostatList = (props: ThermostatProps) => {

    const {items} = props;
    const [selectedTemperature, setSelectedTemperature] = useState<number[]>([0]);
    const [currentTemperature, setCurrentTemperature] = useState<number[]>([0]);
    const [currentMode, setCurrentMode] = useState<string[]>(["Auto"]);
    const [currentPower, setCurrentPower] = useState<boolean[]>([false]);
    // const [tags, setTags] = useState<string[]>([]);
    const [jwt, setJWT] = useState<string>("");

    const {tokens} = useTheme();

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
                                level={2}
                            >
                                {currentTemperature}
                            </Heading>
                        </Flex>
                        <Flex display={"flex"} direction={"row"} justifyContent={'center'}>
                            <Heading
                                level={5}
                            >
                                {item.deviceId}
                            </Heading>
                        </Flex>
                        <View padding="xs">
                            <Divider padding="xs"/>
                            <SliderField
                                label="Desired Temperature: "
                                onChange={handleInputChange}
                                value={selectedTemperature}
                                max={100}
                            />

                            <Card>
                                <SelectField
                                    label="Mode"
                                    value={currentMode}
                                    onChange={(e) => handleInputChange(e.target.value)}
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
                                    isChecked={currentPower}
                                    onChange={() => {
                                        setCurrentPower(!currentPower)
                                    }}
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
                            <Card>
                                <Flex direction={"column"} justifyContent={"space-between"}>
                                    <Button width={"100%"} variation={"primary"} colorTheme={"success"}>
                                        setTemperature
                                    </Button>
                                    <Button width={"100%"} variation={"primary"} colorTheme={"success"}>
                                        getTemperature
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