import React from "react";
import {
    Card,
    Divider,
    Flex,
    Heading,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    Text,
    View
} from "@aws-amplify/ui-react";
import {BsCaretDown} from "react-icons/bs"

export interface HeaderProps {
    readonly username: string;
}


const Header = ({ username }: HeaderProps ) => {
    return (
        <Flex
            direction="row"
            justifyContent="space-between"
            alignContent="flex-start"
            wrap="nowrap"
            gap="1rem"
        >
            <Card
                columnStart="1"
                columnEnd="-1"
            >
                <Heading
                    level={1}
                >
                    AWS AVP IoT Demo Dashboard
                </Heading>

            </Card>
            <Card
                columnStart="-2"
                columnEnd="-1"
            >
                <Menu
                    trigger={
                        <MenuButton variation="primary" size="large" width="100%">
                            <Flex direction="row" gap="1rem">
                                <View>
                                    Logged in as {username}
                                </View>
                                <View>
                                    <Icon as={BsCaretDown}/>
                                </View>
                            </Flex>

                        </MenuButton>
                    }
                >
                    <Divider/>
                    <MenuItem onClick={() => alert('Signed out')}>
                        Log out
                    </MenuItem>
                </Menu>
            </Card>
        </Flex>
    )
}

export default Header;