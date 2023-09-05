const myMap = new Map();

function doSomething() {
  console.log('doSomething');
}

const obj = {
  name: 'obj',
};

myMap.set(doSomething, obj);

for (let key of myMap.keys()) {
  key();
}

const asyncFoo = async () => {
  let res;
  if (true) {
    res = await new Promise((resolve) => {
      setTimeout(() => {
        resolve('asyncFoo');
      }, 1000);
    });
  }

  console.log(res);
};

asyncFoo();
