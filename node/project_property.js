/**
 * Created by lhc on 17-11-21.
 */
const {ipcMain} = require('electron');
const {query} = require('./sqlite3');
const moment = require('moment');
const uuid = require('node-uuid');

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
