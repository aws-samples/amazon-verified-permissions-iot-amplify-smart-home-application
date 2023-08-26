import React from "react";
import {
    Flex,
    Grid,
} from "@aws-amplify/ui-react";
import Thermostat from "../components/thermostat";
import Header from "../components/header";
import CurrentStats from "../components/currentStats";

const Dashboard = () => {

    // get this from api
    const items = [{
            name: 'thermostat1',
            currentTemperature: 72,
            tags: ['Home1', 'Smart Thermostat'],
        }];

    return (
        <Grid
            columnGap="0.5rem"
            rowGap="0.5rem"
        >
            <Header
                username={"primaryOwner"}
            />
            <CurrentStats />
            <Flex
                direction="row"
                wrap="nowrap"
                gap="1rem"
            >
                <Thermostat
                    items={items}
                />
            </Flex>

        </Grid>
    )
}

export default Dashboard;