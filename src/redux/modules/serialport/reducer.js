import * as SERIAL_PORT from './action-type';
import {Map} from 'immutable';

const initialState = Map({
  isOpen: false
});
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SERIAL_PORT.UPDATE_SERIAL_PORT_STATUS:
      return state.merge(action.data);
    default:
      return state;
  }
}

