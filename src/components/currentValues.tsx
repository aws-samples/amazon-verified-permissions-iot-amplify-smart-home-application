import React, {useState} from "react";
import {Button, Card, Flex, Heading, SelectField, TextField} from "@aws-amplify/ui-react";
import {format as formatDate} from "date-fns";


const CurrentValues = () => {

    const currentTimestamp = new Date();
    const currentHour = Number(formatDate(currentTimestamp, "h"));
    const currentMinute = currentTimestamp.getMinutes();
    const currentMeridian = currentTimestamp.getHours() >= 12 ? "PM" : "AM";

    const [meridianSelectedValue, setMeridianSelectedValue] = useState(currentMeridian);
    const [hourValue, setHourValue] = useState(currentHour);
    const [minutesValue, setMinutesValue] = useState(currentMinute);
    const [currentTemperature, setCurrentTemperature] = useState(72);

    return (
        <Card width={"40%"} variation="elevated">
            <Heading level={2} margin={0} padding={0}>World Settings</Heading>
            <p>This is where we update the time of day and optionally the temperature of the outside world</p>

            <Flex
                direction="column"
            >
                <Card>
                    <TextField
                        type="number"
                        value={currentTemperature}
                        onChange={(e) => setCurrentTemperature(Number(e.target.value))}
                        placeholder="72"
                        label="Outside Temperature (F)"
                    />
                </Card>
                <Card>
                    <Flex direction={"column"}>
                        <label>Set Time</label>
                        <Flex direction={"row"}>
                            <TextField type={"number"} width={"20%"} label={"HH"} value={hourValue}
                                       onChange={(e) => setHourValue(Number(e.target.value))}/>
                            <TextField type={"number"} width={"20%"} label={"MM"} value={minutesValue}
                                       onChange={(e) => {
                                           setMinutesValue(Number(e.target.value))
                                       }}/>
                            <SelectField
                                label="AM/PM"
                                value={meridianSelectedValue}
                                onChange={(e) => setMeridianSelectedValue(e.target.value)}
                            >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </SelectField>

                        </Flex>
                    </Flex>


                </Card>
                <Card>
                    <Flex direction={"column"}>
                        <label>Update world settings</label>
                        <Button variation="primary" onClick={() => {
                            console.log("clicked")
                        }}>
                            Submit
                        </Button>

                    </Flex>
                </Card>
            </Flex>
        </Card>
    )
}

export default CurrentValues;