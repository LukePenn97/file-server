const net = require('net');
const fs = require('fs');
const stdin = process.stdin;
const conn = net.createConnection({
  host: 'localhost', // change to IP address of computer or ngrok host if tunneling
  port: 3000 // or change to the ngrok port if tunneling
});

conn.on('data', (dataString) => {
  let dataArray;
  if (dataString.startsWith('list')) {
    dataArray = dataString.split(":::");
    console.log("the files in this server are: ", dataArray[1]);
  } else if (dataString.startsWith('error')) {
    dataArray = dataString.split(":::");
    console.log(dataArray[1]);
  } else {
    dataArray = dataString.split(":::");
    fs.writeFile(dataArray[0], dataArray[1], (error) => {
      if (!error) {
        console.log(`\nDownloaded and saved ${dataArray[0]}`);
        console.log("\nGreat! Now download another one! Which ones do we have? Type list to find out!");
      }
    });
  }
  //console.log(dataArray, typeof dataArray[0],typeof dataArray[1]);
  
});

stdin.on('data', (key) => {
  conn.write(key);
});

conn.on('connect', () => {
  console.log("Welcome to Files Galore, where you can download a file just by typing the name!");
  console.log("Try it now! Type test.txt, or type list to see all files");
});

conn.setEncoding('utf8');