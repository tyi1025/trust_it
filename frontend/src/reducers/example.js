import actionTypes from '../actions';

const defaultState = {
  selectedManufacturer: '',
  manufacturerListLoading: false,
  manufacturerList: []
};

export default function(state=defaultState, action) {
  switch(action.type) {
  case actionTypes.selectManufacturer:
    return Object.assign({}, state, {
      selectedManufacturer: action.manufacturerId
    });
  case actionTypes.getManufacturerListStart:
    return Object.assign({}, state, {
      manufacturerListLoading: true,
      manufacturerList: []
    });
  case actionTypes.getManufacturerListSuccess:
    return Object.assign({}, state, {
      manufacturerListLoading: false,
      manufacturerList: action.manufacturerList
    });
  case actionTypes.getManufacturerListFail:
    return Object.assign({}, state, {
      manufacturerListLoading: false,
      manufacturerList: []
    });
  default:
    return state;
  }
}
