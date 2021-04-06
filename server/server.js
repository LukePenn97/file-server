const net = require('net');
const fs = require('fs');
const server = net.createServer();

server.on('connection', (client) => {
  console.log('New client connected!');
  //client.write('Hello there!');
  client.setEncoding('utf8');
  client.on('data', (data) => {
    
    fs.readdir(process.cwd(), (err, files) => {
      if (err) {
        console.log(err);
        return;
      }
      let flatData = data.replace(/\r?\n|\r/,"");
      if (flatData === 'list') {
        console.log("sent file list to client");
        let list = "";
        for (const fName in files) {
          list += files[fName] + " ";
        }
        client.write(`list:::${list}`);
      } else if (flatData === 'server.js') {
        client.write(`error:Hey, you cant just download my server file, who do you think you are?`);
      } else {
        for (const fName in files) {
          //console.log(flatData, "and ",fName);
          if (files[fName] === flatData) {
            
            //console.log("file name is ",files[fName]);
            fs.readFile(files[fName], 'utf8', function(err, data) {
              if (err) throw err;
              console.log(data);
              let dataString = `${files[fName]}:::${data}`;
              //console.log(typeof dataString, dataString);
              client.write(dataString);
              console.log(`Uploaded ${files[fName]} to client`);
            });
            
          }
        }
      }
    });
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000!');
});

