import React, {useState} from "react";

import {
    Badge,
    Button,
    Card,
    Collection,
    Divider,
    Flex,
    Heading, Icon, SelectField,
    SliderField, SwitchField, useTheme,
    View
} from "@aws-amplify/ui-react";


export type ThermostatItem = {
    readonly name: string;
    readonly currentTemperature: number;
    readonly tags: string[];
}

export type ThermostatProps = {
    readonly items: ThermostatItem[];
};


const Thermostat = (props: ThermostatProps) => {

    const {items} = props;
    const [selectedTemperature, setSelectedTemperature] = useState();
    const [selectedModeValue, setSelectedModeValue] = useState("Auto");
    const {tokens} = useTheme();

    return (
        <Card>
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
                                {item.currentTemperature}
                            </Heading>
                        </Flex>
                        <Flex display={"flex"} direction={"row"} justifyContent={'center'}>
                            <Heading
                                level={5}
                            >
                                {item.name}
                            </Heading>
                        </Flex>

                        <View padding="xs">
                            <Divider padding="xs"/>
                            <SliderField
                                label="Set temperature"
                                onChange={selectedTemperature}
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
                                    {item.tags.map((badge) => (
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


export default Thermostat;