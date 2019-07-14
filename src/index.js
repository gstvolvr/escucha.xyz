import React from 'react'
import ReactDOM from 'react-dom'
import Recommender from './components/Recommender'
import Firebase from './components/Firebase'
import FirebaseContext from './components/FirebaseContext'

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <FirebaseContext.Consumer>{firebase =>
      <Recommender firebase={firebase} />}
    </FirebaseContext.Consumer>
  </FirebaseContext.Provider>,
  document.getElementById('root')
)
