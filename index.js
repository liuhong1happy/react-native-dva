import React from 'react'
import { create } from 'dva-core'
import { Provider, connect } from 'react-redux'

export { connect }

export default function(options) {
  const app = create(options)
  
  // HMR workaround
  if (!global.registered) options.models.forEach(model => app.model(model))
  global.registered = true

  options.uses.forEach(use=>{
    app.use(use);
  })
  
  app.start()

  const store = app._store;

  app.start = container => () =>{
    return  (<Provider store={store}>
              {container}
            </Provider>)
  }
  app.getStore = () => store
  return app
}