import React, { Fragment } from 'react';

import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';

function App() {
  return (
    <Fragment>
      <SignupForm />
      <LoginForm />
    </Fragment>
  );
}

export default App;
