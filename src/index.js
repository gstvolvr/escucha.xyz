import React from 'react'
import { createRoot } from 'react-dom/client'
import Recommender from './components/Recommender'
import Firebase from './components/Firebase'
import FirebaseContext from './components/FirebaseContext'

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <FirebaseContext.Consumer>{firebase =>
      <Recommender firebase={firebase} />}
    </FirebaseContext.Consumer>
  </FirebaseContext.Provider>
)
