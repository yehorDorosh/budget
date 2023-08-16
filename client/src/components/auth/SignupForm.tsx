import { useState } from 'react';
import axios from 'axios';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function emailHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function passwordHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const { data, status } = await axios.post(
        '/api/user/signup',
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(data, status);
    } catch (error) {
      console.log(error);
    }
    setEmail('');
    setPassword('');
  }

  return (
    <form onSubmit={submitHandler}>
      <input
        type="email"
        placeholder="email"
        name="email"
        onChange={emailHandler}
        value={email}
      />
      <input
        type="password"
        placeholder="password"
        name="password"
        onChange={passwordHandler}
        value={password}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
