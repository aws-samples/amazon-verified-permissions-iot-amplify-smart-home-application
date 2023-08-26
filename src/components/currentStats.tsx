import React, {useState} from "react";
import {Card, Flex, SelectField, TextField} from "@aws-amplify/ui-react";
// import {FaSnowflake} from "react-icons/fa";
// import {BsFire} from "react-icons/bs";

interface TemperatureIconProps {
    readonly temperature: number;
}

// const TemperatureIcon = ({temperature}: TemperatureIconProps) => {
//     if (temperature >= 80) {
//         return <Icon color={"yellow.60"} as={BsFire} viewBox={{width: 300, height: 300}}/>
//     } else if (temperature <= 69 ) {
//         return <Icon color={"blue.80"} as={FaSnowflake} viewBox={{width: 300, height: 300}}/>
//     }
// }

const CurrentStats = () => {
    const [meridianSelectedValue, setMeridianSelectedValue] = useState('');
    return (
        <Flex
            direction="row"
            wrap="nowrap"
            gap="1rem"
        >
            <Card>
                <TextField
                    placeholder="72"
                    label="Outside Temperature (F)"
                />
            </Card>
            <Card>
                <Flex direction={"row"}>
                    <TextField type={"number"} width={"15%"} label={"HH"}></TextField>
                    <TextField type={"number"} width={"15%"} label={"MM"}></TextField>
                    <SelectField
                        label="AM/PM"
                        value={meridianSelectedValue}
                        onChange={(e) => setMeridianSelectedValue(e.target.value)}
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </SelectField>
                </Flex>
            </Card>


        </Flex>
    )
}

export default CurrentStats;