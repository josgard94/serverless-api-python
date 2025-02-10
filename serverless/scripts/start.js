const { spawn } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');
const yml = require('js-yaml');

API_PORT = 3000;
const initLambdaPort = 4000;
const initAPIPort = 5000;
const paths = new Array();

function getPaths(servicePath){
  let yaml = yml.load(fs.readFileSync('./services/'+servicePath+"/serverless.yml"));
  let servicePaths = new Array();
  for(var fun in yaml.functions)
  {
    if(yaml.functions[fun].events[0].http){
      servicePaths.push(yaml.functions[fun].events[0].http.path);
      paths.push(yaml.functions[fun].events[0].http.path);
    }
  }
  return servicePaths;
}

function getServices() {
  const services = fs.readdirSync('./services');
  const temp=Array();
  services.forEach(function(service){
    if(!service.startsWith(".")){
      temp.push(service)
    }
  })
  const servicesList = temp.map((service, index) => {
    return {
      name: service,
      route: `${service}`,
      path: `services/${service}`,
      port: `${initAPIPort + index + 1}`,
      lambdaPort: `${initLambdaPort + index + 1}`,
      paths: getPaths(service)
    }
  });
  return servicesList;
}

const services = getServices();
const info = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// services.unshift({
//   name: info.name || 'serverless',
//   route: '/', path: '.',
//   port: `${initAPIPort}`,
//   lambdaPort: `${initLambdaPort}`
// });

services.forEach(service => {
  if(!service.name.startsWith(".")){
    const renameChild = spawn(
      "sed",
      ['-i', '-e', `'s/service:.*/service: ${service.name}'/g`, 'serverless.yml'],
      { cwd: service.path, shell: true }
    );

    renameChild.stdout.setEncoding('utf8');
    renameChild.stdout.on('data', chunk => console.log(chunk));
    renameChild.stderr.on('data', chunk => console.log(chunk.toString()));

    const child = spawn(
      "nodemon -e py,yml --exec serverless",
      ["offline", "start"],
      { cwd: service.path, shell: true }
    );

    child.stdout.setEncoding('utf-8');
    child.stdout.on('data', chunk => console.log(chunk));
    child.stderr.on('data', chunk => console.log(chunk.toString()));
    child.on('close', code => console.log(`child exited with code ${code}`));
  }
});

function getPortForPath(serviceString)
{
  let port = false;
  for(let service of services)
  {
    for(let path in service.paths)
    {
      if(service.paths[path].startsWith("/"+serviceString))
      {
        port = service.port;
      }
    }
  }
  return port;
}

const proxy = httpProxy.createProxyServer({});
const server = http.createServer((req, res) => {
  const serviceString = req.url.split('/')[1];
  const port = getPortForPath(serviceString)
  if (port) {
    proxy.web(req, res, { target: `http://localhost:${port}`});
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': '*'});
  res.write(`Url path ${req.url} does not match routes defined in services\n`);
  res.end();
});

server.listen(API_PORT, () => {
  console.log(`API Listening on port ${API_PORT} ---|>`);
});

