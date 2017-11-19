/**
 * Created by lhc on 2017/11/19.
 */
const {ipcMain} = require('electron');
const {query} = require('./sqlite3');

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
    event.sender.send('getProjectList', {err: null, res});
  } catch (err) {
    console.log('getProjectList', err);
    event.sender.send('getProjectList', {err, res});
  }
});


