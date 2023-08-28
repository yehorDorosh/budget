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
