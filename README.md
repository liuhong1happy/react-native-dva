# react-native-dva

能在React Native环境使用的dva

## 简单使用

```js
import dva from 'rn-dva'
import dvaLoading from 'dva-loading'
import { 
  createReactNavigationReduxMiddleware
} from 'react-navigation-redux-helpers'
import { applyMiddleware } from 'redux';

import App from './App'
import { name as appName } from "./app.json";

import userModel from './modal/user'
import systemModel from './modal/system'

import nav from './reducer/nav'

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);

const app = dva({
  extraEnhancers: [
    applyMiddleware(middleware)
  ],
  extraReducers: {
    nav
  },
  uses: [
    dvaLoading({ effects: true })
  ],
  models: [
    userModel,
    systemModel,
  ],
});

const MainApp = app.start(<App />);
AppRegistry.registerComponent(appName, () => MainApp);
```

## 加入redux-persist

```js
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native'

const createPersistStore = (rootReducer, createStore)=>{
  const persistConfig = {
    key: 'root',
    storage: AsyncStorage
  }
  const persistedReducer = persistReducer(persistConfig, rootReducer)
  return createStore(persistedReducer);
}

const StoreEnhancer  = () => (createStore)=> (rootReducer, prevState)=> createPersistStore(rootReducer, createStore);

//....
const app = dva({
  extraEnhancers: [
    StoreEnhancer(),
    applyMiddleware(middleware)
  ],
  //...
}
//...
const MainApp = app.start(<App />);

persistStore(app.getStore() , { storage : AsyncStorage }, (err, res)=>{
    console.log(err, res, app);
    const state = app._store.getState();
    const { system : { isFirst, doLogin }} = state;
    if(isFirst) {
      app._store.dispatch({
        type: 'system/resetPage',
        payload: 'Welcome'
      })
    } else if(doLogin) {
      // 未登录
      app._store.dispatch({
        type: 'system/resetPage',
        payload: 'UserLogin'
      })
    }
});
```
