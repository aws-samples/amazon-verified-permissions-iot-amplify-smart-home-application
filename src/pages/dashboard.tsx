import React, { useEffect, useState } from "react";
import {
    Flex,
    Grid,
    Card,
    Alert,
} from "@aws-amplify/ui-react";
import ThermostatList from "../components/thermostatList";
import Header from "../components/header";
import CurrentValues from "../components/currentValues";
import { Auth } from "@aws-amplify/auth"

const { REACT_APP_API_URI } = process.env;

interface DashboardProps {
}

const Dashboard = (props: DashboardProps) => {

    const [items, setItems] = React.useState([]);
    const [infoAlert, setInfoAlert] = React.useState("");

    useEffect(() => {
        Auth.currentSession()
            .then(response => {
                let accessToken = response.getAccessToken()
                let jwt = accessToken.getJwtToken();

                fetch(`${REACT_APP_API_URI}/items`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                    .then(
                        response =>
                            response.json()
                                .then(data => {
                                    setItems(data)
                                })
                                .catch(e => {

                                    console.log("Unable to decode JSON")
                                    console.log(e);
                                }
                                ))
                    .catch(e => {
                        console.log("Unable to get items")
                        console.log(e);
                    })
            })
            .catch(e => {
                console.log("Unable to get current session")
                console.log(e)
            });

    }, [])

    return (
        <Grid
            columnGap="0.5rem"
            rowGap="0.5rem"
        >
        
            <Header
                username={"primaryOwner"}
            />

            {infoAlert && <Alert
                    isDismissible={true}
                    heading="Policy evaluation decision"
                    >
                    {infoAlert}
                </Alert>}

            <Flex
                direction="row"
                wrap="nowrap"
                justifyContent={"space-between"}
                gap="1rem"
            >                
                <Flex direction={"row"}>
                    <ThermostatList
                        setAlert={setInfoAlert}
                        items={items}
                    />
                </Flex>

                <CurrentValues />

            </Flex>


        </Grid>
    )
}

export default Dashboard;