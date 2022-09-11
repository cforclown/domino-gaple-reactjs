import {createStore} from 'redux'
import UIReducer from '../GameObject/UIManager/Reducer/UIReducer';

const store = createStore(UIReducer);

export default store;