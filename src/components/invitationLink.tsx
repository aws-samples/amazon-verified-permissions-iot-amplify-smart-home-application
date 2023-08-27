import { useState } from "react";

import { Button, Card, Flex, Heading, Radio, RadioGroupField, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@aws-amplify/ui-react";

const InvitationLink = () => {

    const [radioValue, setRadioValue] = useState('guest');


    return (
        <Card variation="elevated">
            <Flex direction="column" gap={"1rem"}>
                <Heading level={2}>Invite A New User</Heading>
                <TextField
                    placeholder="Email"
                    label="Invite a new user"
                    errorMessage="There is an error"
                />
                <RadioGroupField
                    label="User Type"
                    name="userType"
                    value={radioValue}
                    onChange={(e) => { setRadioValue(e.target.value) }}
                >
                    <Radio value="guest">Guest</Radio>
                    <Radio value="powercompany">Power company</Radio>
                </RadioGroupField>
                <Button onClick={() => { console.log("clicked") }}>Send Invitation</Button>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>User Type</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    </TableBody>
                </Table>
            </Flex>

        </Card>
    )
}

export default InvitationLink;