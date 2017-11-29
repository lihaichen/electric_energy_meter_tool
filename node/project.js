/**
 * Created by lhc on 2017/11/19.
 */
const {ipcMain} = require('electron');
const {query} = require('./sqlite3');
const moment = require('moment');
const uuid = require('node-uuid');
const projectPropertyUtils = require('./project_property');
// 获取项目列表
ipcMain.on('getProjectList', async (event, arg) => {
  const res = {};
  try {
    const pageSize = arg.pageSize || 0;
    const page = arg.page || 0;
    if (!pageSize || !page) {
      event.sender.send('getProjectList', {err: '参数错误', res});
    }
    res.page = page;
    res.pageSIze = pageSize;
    const count = await query('SELECT count(*) as count FROM project');
    res.count = count[0].count;
    const offset = (page - 1) * pageSize;
    res.list = await query(`SELECT * FROM project  LIMIT ${pageSize} OFFSET ${offset}`);
    res.list.map(item => item.key = item.id);
    event.sender.send('getProjectList', {err: null, res});
  } catch (err) {
    console.log('getProjectList', err);
    event.sender.send('getProjectList', {err, res});
  }
});
// 添加项目
ipcMain.on('addProject', async (event, arg) => {
  const res = {};
  try {
    const name = arg.name;
    const selectId = arg.selectId;
    const describe = arg.describe;
    const date = moment().unix();
    const id = uuid.v4();
    await query(`INSERT INTO project (id,name,describe,createTime,updateTime) 
    VALUES ('${id}','${name}', '${describe}',${date},${date})`);
    if (selectId) {
      const propertyList = await query(`SELECT * FROM projectProperty WHERE projectId='${selectId}'`);
      propertyList.map(item => item.projectId = id);
      await Promise.all(propertyList.map(item => projectPropertyUtils.insertProjectProperty(item)));
    }
    event.sender.send('addProject', {err: null, res});
  } catch (err) {
    console.log('addProject', err);
    event.sender.send('addProject', {err, res});
  }
});
// 删除项目
ipcMain.on('deleteProject', async (event, arg) => {
  const res = {};
  try {
    const id = arg.id;
    if (!id) {
      event.sender.send('deleteProject', {err: '参数错误', res});
    }
    await query(`DELETE FROM project WHERE id='${id}'`);
    event.sender.send('addProject', {err: null, res});
  } catch (err) {
    console.log('deleteProject', err);
    event.sender.send('deleteProject', {err, res});
  }
});
// 修改项目
ipcMain.on('putProject', async (event, arg) => {
  const res = {};
  try {
    const id = arg.id;
    const name = arg.name;
    const describe = arg.describe;
    const date = moment().unix();
    await query(`UPDATE project SET name='${name}',
    describe='${describe}', updateTime=${date} WHERE id='${id}'`);
    event.sender.send('addProject', {err: null, res});
  } catch (err) {
    console.log('putProject', err);
    event.sender.send('putProject', {err, res});
  }
});
