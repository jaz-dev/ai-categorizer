import './App.css'
import InputList from './components/InputList'
import CategoryList from './components/CategoryList'
import UserInput from './components/user-inputs/UserInput'

function App() {
  return (
    <>
      <div className="flex">
        <CategoryList/>
        <UserInput/>
      </div>
      <InputList/>
    </>
  )
}

export default App
