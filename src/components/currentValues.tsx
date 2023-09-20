import React from "react";
import {Button, Card, Flex, Heading, SelectField, TextField} from "@aws-amplify/ui-react";
import {useGlobal} from "../context/globalContext";


const CurrentValues = () => {


    const {
        globalTemperature,
        setGlobalTemperature,
        globalTimeHH,
        setGlobalTimeHH,
        globalTimeMM,
        setGlobalTimeMM,
        globalTimeMeridiem,
        setGlobalTimeMeridiem,
    } = useGlobal();

    // const currentTimestamp = new Date();
    // const currentHour = Number(formatDate(currentTimestamp, "h"));
    // const currentMinute = currentTimestamp.getMinutes();
    // const currentMeridian = currentTimestamp.getHours() >= 12 ? "PM" : "AM";

    // const [meridianSelectedValue, setMeridianSelectedValue] = useState(currentMeridian);
    // const [hourValue, setHourValue] = useState(currentHour);
    // const [minutesValue, setMinutesValue] = useState(currentMinute);
    // const [currentTemperature, setCurrentTemperature] = useState(72);

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
                        value={globalTemperature}
                        onChange={(e) => setGlobalTemperature(Number(e.target.value))}
                        placeholder="72"
                        label="Outside Temperature (F)"
                    />
                </Card>
                <Card>
                    <Flex direction={"column"}>
                        <label>Set Time</label>
                        <Flex direction={"row"}>
                            <TextField type={"number"} width={"20%"} label={"HH"} value={globalTimeHH}
                                       onChange={(e) => setGlobalTimeHH(Number(e.target.value))}/>
                            <TextField type={"number"} width={"20%"} label={"MM"} value={globalTimeMM}
                                       onChange={(e) => {
                                           setGlobalTimeMM(Number(e.target.value))
                                       }}/>
                            <SelectField
                                label="AM/PM"
                                value={globalTimeMeridiem}
                                onChange={(e) => setGlobalTimeMeridiem(e.target.value)}
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