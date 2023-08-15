import React, { Fragment, useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState({ message: 'Loading...' });

  useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      });
  }, []);

  return (
    <Fragment>
      <h1>Hello World!</h1>
      <p>{data.message}</p>
    </Fragment>
  );
}

export default App;
