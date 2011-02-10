var results = [];

function resultReceiver(event) {
  //results.push(parseInt(event.data));
  postMessage(event.data);
}

function errorReceiver(event) {
  console.log(event.data);
  throw event.data;
}
