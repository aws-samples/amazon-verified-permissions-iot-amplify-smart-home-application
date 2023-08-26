import React from "react";
import { Amplify } from 'aws-amplify';
import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsconfig from './aws-exports';
import Dashboard from "./pages/dashboard";
Amplify.configure(awsconfig);

function App({ signOut, user }: WithAuthenticatorProps) {
  return (
    <>
      <Dashboard />

    </>
  );
}

export default withAuthenticator(App);

// const App = () => {
//     return <Dashboard />
// }


// export default App;