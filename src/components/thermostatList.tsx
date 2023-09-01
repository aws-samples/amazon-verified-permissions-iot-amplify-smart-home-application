import React, {useState} from "react";

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

export type ThermostatItem = {
    readonly deviceId: string;
    readonly primaryOwner: string;
}

export type ThermostatProps = {
    readonly items: ThermostatItem[];
};

const ThermostatList = (props: ThermostatProps) => {

    const {items} = props;
    const [selectedTemperature, setSelectedTemperature] = useState(0);
    const [selectedModeValue, setSelectedModeValue] = useState("Auto");

    const [currentTemperature, setCurrentTemperature] = useState(0);
    const [currentMode, setCurrentMode] = useState("Auto");
    const [currentPower, setCurrentPower] = useState(true);
    const [tags, setTags] = useState<string[]>([]);

    const {tokens} = useTheme();

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
                )}
            </Collection>
        </Card>
    )
}


export default ThermostatList;