/**
 * Created by lhc on 17-11-21.
 */
const {ipcMain} = require('electron');
const {query} = require('./sqlite3');
const moment = require('moment');
const uuid = require('node-uuid');

async function insertProjectProperty(property) {
  const date = moment().unix();
  const sql = 'INSERT INTO projectProperty (id,name,projectId,describe,value, ' +
    'valueType,dateIndicate,createTime,updateTime) VALUES ' +
    `('${uuid.v4()}','${property.name}','${property.projectId}','${property.describe}', ` +
    `'${property.value}','${property.valueType}','${property.dateIndicate}',${date},${date})`;
  return await query(sql);
}

// 获取项目列表
ipcMain.on('getProjectPropertyList', async (event, arg) => {
  const res = {};
  try {
    const pageSize = arg.pageSize || 0;
    const page = arg.page || 0;
    const projectId = arg.projectId;
    if (!pageSize || !page || !projectId) {
      event.sender.send('getProjectPropertyList', {err: '参数错误', res});
    }
    res.page = page;
    res.pageSIze = pageSize;
    res.projectId = projectId;
    const count = await query('SELECT count(*) as count FROM projectProperty');
    res.count = count[0].count;
    const offset = (page - 1) * pageSize;
    res.list = await query(`SELECT * FROM projectProperty  LIMIT ${pageSize} OFFSET ${offset}`);
    res.list.map(item => item.key = item.id);
    event.sender.send('getProjectPropertyList', {err: null, res});
  } catch (err) {
    console.log('getProjectPropertyList', err);
    event.sender.send('getProjectPropertyList', {err, res});
  }
});
// 添加项目
ipcMain.on('addProjectProperty', async (event, arg) => {
  const res = {};
  try {
    const name = arg.name;
    const projectId = arg.projectId;
    const dateIndicate = arg.dateIndicate;
    let sql = 'SELECT * FROM projectProperty WHERE ' +
      `projectId='${projectId}' AND (name='${name}' OR dateIndicate='${dateIndicate}')`;
    console.log('addProjectProperty:', sql);
    const findResult = await query(sql);
    if (findResult && findResult.length) {
      event.sender.send('addProjectProperty', {err: '名字或者数据标识已经存在', res});
      return;
    }
    await insertProjectProperty(arg);
    event.sender.send('addProjectProperty', {err: null, res});
  } catch (err) {
    console.log('addProjectProperty', err);
    event.sender.send('addProjectProperty', {err, res});
  }
});

// 修改项目属性
ipcMain.on('putProjectProperty', async (event, arg) => {
  const res = {};
  try {
    const name = arg.name;
    const id = arg.id;
    const projectId = arg.projectId;
    const value = arg.value;
    const valueType = arg.valueType;
    const dateIndicate = arg.dateIndicate;
    const describe = arg.describe;
    const date = moment().unix();
    let sql = 'SELECT * FROM projectProperty WHERE ' +
      `projectId='${projectId}' AND id != '${id}' AND (name='${name}' OR dateIndicate='${dateIndicate}')`;
    const findResult = await query(sql);
    if (findResult && findResult.length) {
      event.sender.send('putProjectProperty', {err: '名字或者数据标识已经存在', res});
      return;
    }
    sql = 'UPDATE projectProperty ' +
      `SET name='${name}', describe='${describe}', ` +
      `value='${value}',valueType='${valueType}', ` +
      `dateIndicate='${dateIndicate}',updateTime=${date} ` +
      ` WHERE id='${id}'`;
    console.log('putProjectProperty:', sql);
    await query(sql);
    event.sender.send('putProjectProperty', {err: null, res});
  } catch (err) {
    console.log('putProjectProperty', err);
    event.sender.send('putProjectProperty', {err: err.toString(), res});
  }
});

// 删除项目属性
ipcMain.on('deleteProjectProperty', async (event, arg) => {
  const res = {};
  try {
    const id = arg.id;
    if (!id) {
      event.sender.send('deleteProjectProperty', {err: '参数错误', res});
    }
    await query(`DELETE FROM projectProperty WHERE id='${id}'`);
    event.sender.send('deleteProjectProperty', {err: null, res});
  } catch (err) {
    console.log('deleteProjectProperty', err);
    event.sender.send('deleteProjectProperty', {err, res});
  }
});

module.exports = {
  insertProjectProperty
};
