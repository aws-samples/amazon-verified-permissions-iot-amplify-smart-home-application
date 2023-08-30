import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import {
  Authenticator,
  View,
  Button,
  useAuthenticator,
  Flex,
  Heading,
  Card,
} from '@aws-amplify/ui-react';
import awsExports from './aws-exports';
import Dashboard from './pages/dashboard';
Amplify.configure(awsExports);

export default function App() {

  const components = {
    SignIn: {
      Header() {
        return (
          <Heading level={2} textAlign="center">
            AWS IoT AVP Demo Dashboard
          </Heading>
        )
      },
      Footer() {
        const { toResetPassword } = useAuthenticator();
        return (
          <div />
        );
      },
    },
  };

  return (

    <Flex justifyContent={"center"} display={"flex"} alignItems={"center"}>
      <Card>
        <Authenticator hideSignUp components={components}>
          <Dashboard />
        </Authenticator>
      </Card>
    </Flex>

  );
}