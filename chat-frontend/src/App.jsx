import { useState } from 'react'
import Login from "./components/Login";
import Chat from "./components/Chat";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
         {user ? (
        <Chat currentUser={user} />
      ) : (
        <Login onLoginSuccess={setUser} />
      )}
      </div>
    </>
  )
}

export default App
