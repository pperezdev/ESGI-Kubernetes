const express = require('express');
const app = express();
const osUtils = require('os-utils');
const os = require('os');
const cors = require("cors");

const mysql = require('mysql');

var con = mysql.createConnection({
  host: "somewordpress",
  user: "wordpress",
  password: "wordpress",
  database: "wordpress"
});

function connect(name, description, status){
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = `INSERT INTO D_TODO (NAME, DESCRIPTION, STATUS) VALUES ("${name}", "${description}", "${status}")`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
}

app.use(cors());

function isPrime(num) {
  if (num <= 1) {
    return false;
  }
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}

function findPrimes(max) {
  const primes = [];
  for (let i = 2; i <= max; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }
  return primes;
}

// Calculate primes, just to make the life of the CPU a lot harder
app.get('/', (req, res) => {
  const nbr = req.query.n;
  if (!nbr) {
    res.json({ error: 'Please provide a number parameter under the "n" query variable.' });
  } else {
    const result = findPrimes(parseInt(nbr));
    res.json({ primes: result, range: [0, parseInt(nbr)]});
  }
});

// Get info on the actual host (node) who is currently answering the request
app.get('/host-info', async (req, res) => {
  osUtils.cpuUsage((usage) => {
    res.json({ hostname: os.hostname(), cpu: parseInt(usage * 100) });
  });
});

// Global variable to store the todos, it's not sync between pods
let allTodos = [];

// Get all TODOs
app.get('/todos', (req, res) => {
  res.json(allTodos);
});

// Create a TODO
app.get('/create-todo', (req, res) => {
  const status = req.query.status;
  const text = req.query.text;

  if (status && status !== 'done' && status !== 'not-done') {
    res.json({ error: 'Please provide a "status" variable as "done" or "not-done".' });
  }

  if (!status || !text) {
    res.json({ error: 'Please provide a "status" variable as done/not-done and "text" parameter to be able to create a todo.' });
  } else {
    allTodos.push({status, text});
    res.send(allTodos);
  }
});

app.get('/edit-todo', (req, res) => {
  const status = req.query.done;
  const text = req.query.text;
  const id = req.query.id;

  if (!id) {
    res.json({ error: 'Please provide an "id" which should be an index.' });
  } else {
    if (id < allTodos.length && id >= 0) {
      allTodos[id] = {
        status: status !== undefined ? status : allTodos[id].status,
        text: text !== undefined ? text : allTodos[id].text,
      }
      res.json(allTodos);
    } else {
      res.json({ error: 'Id is incorrect.' });
    }
  }
});

app.get('/delete-todos', (req, res) => {
  allTodos = [];
  res.send(allTodos);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});