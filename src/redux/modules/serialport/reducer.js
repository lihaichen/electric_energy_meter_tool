import * as SERIAL_PORT from './action-type';
import {Map} from 'immutable';

const initialState = Map({
  // 串口是否打开
  isOpen: false,
  // 串口列表
  serialPortList: [],
  // 串口波特率列表
  baudrateList: ['1200', '2400', '4800', '9600', '115200'],
  // 串口的校验列表
  parityList: [{key: 'none', name: '无校验'}, {key: 'even', name: '偶校验'}, {key: 'odd', name: '奇校验'}],

});
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SERIAL_PORT.UPDATE_SERIAL_PORT_STATUS:
      return state.merge(action.data);
    default:
      return state;
  }
}

