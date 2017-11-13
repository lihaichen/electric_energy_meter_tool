/**
 * Created by lhc on 2017/11/13.
 */

const fs = require('fs');
const file = './sqlite3.db';
const exists = fs.existsSync(file);

if (!exists) {
  console.log('Creating DB file.');
  fs.openSync(file, 'w');
}
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(file);

function createTable() {
  console.log('createTable test');
  db.run('CREATE TABLE IF NOT EXISTS test (id INT PRIMARY KEY     NOT NULL,' +
    'name CHAR(128) NOT NULL)',
    insertRows
  );
}

function insertRows() {
  const stmt = db.prepare("INSERT INTO test (id,name) VALUES (?,?)");

  for (const i = 0; i < 10; i++) {
    stmt.run(i, 'lhc' + i);
  }

  stmt.finalize();
}
