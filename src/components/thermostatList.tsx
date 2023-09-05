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
                                value={selectedTemperature[index]}
                                onChange={e => {handleInputChange(e, index, selectedTemperature, setSelectedTemperature)}}
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

                                        }}
                                    >
                                        SetTemperature
                                    </Button>
                                    <Button
                                        width={"100%"}
                                        variation={"primary"}
                                        colorTheme={"success"}
                                        onClick={() => {

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