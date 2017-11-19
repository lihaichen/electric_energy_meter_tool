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
const db = new sqlite3.Database(file, createTable);

function createTable() {
  db.run(`CREATE TABLE IF NOT EXISTS project (id CHAR(255) PRIMARY KEY NOT NULL,
  name CHAR(255) NOT NULL,
  describe TEXT,
  createTime INTEGER NOT NULL,
  updateTime INTEGER NOT NULL)`);

  db.run(`CREATE TABLE IF NOT EXISTS projectProperty (id CHAR(255) PRIMARY KEY NOT NULL,
  name CHAR(255) NOT NULL,
  projectId CHAR(255) NOT NULL,
  describe TEXT,
  value CHAR(255),
  valueType CHAR(255),
  dateIndicate CHAR(255),
  createTime INTEGER NOT NULL,
  updateTime INTEGER NOT NULL)`);

  db.run(`CREATE TABLE IF NOT EXISTS record (id CHAR(255) PRIMARY KEY NOT NULL,
  name CHAR(255) NOT NULL,
  projectId CHAR(255) NOT NULL, 
  describe TEXT,
  createTime INTEGER NOT NULL)`);

  db.run(`CREATE TABLE IF NOT EXISTS recordProperty (id CHAR(255) PRIMARY KEY NOT NULL,
  name CHAR(255) NOT NULL,
  recordId CHAR(255) NOT NULL,
  describe TEXT,
  value CHAR(255),
  valueType CHAR(255),
  dateIndicate CHAR(255),
  createTime INTEGER NOT NULL)`);
}

function query(sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  query
};
