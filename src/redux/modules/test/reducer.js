import * as TEST from './action-type';
import requestStatus from '../../requestStatus';
import {Map} from 'immutable';

const initialState = Map({
  fetchData: Map({
    status: requestStatus.LOAD_INIT,
    data: {}
  }),
});
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TEST.GET_API_TEST:
      return state.setIn(['fetchData', 'status'], requestStatus.LOAD_LOADING);
    case TEST.GET_API_TEST + '_SUCCESS':
      return state.setIn(['fetchData', 'status'], requestStatus.LOAD_SUCCESS);
    case TEST.GET_API_TEST + '_FAIL':
      return state.setIn(['fetchData', 'status'], requestStatus.LOAD_ERROR);
    default:
      return state;
  }
}

