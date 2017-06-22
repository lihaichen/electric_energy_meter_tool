import * as SERIAL_PORT from './action-type';
import {update} from '../../../utils/action_common';

export function updateSerialPortStatus(data) {
  return update(SERIAL_PORT.UPDATE_SERIAL_PORT_STATUS)(data);
}
