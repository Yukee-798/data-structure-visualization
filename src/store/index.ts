import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducer';
import rootSaga from './sagas';
import { composeWithDevTools } from 'redux-devtools-extension'


const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    reducer, composeWithDevTools(applyMiddleware(sagaMiddleware))
)
sagaMiddleware.run(rootSaga);

export default store;