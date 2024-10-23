import './App.css'
import InputList from './components/InputList'
import CategoryList from './components/CategoryList'
import UserInput from './components/user-inputs/UserInput'
import { UserInputType } from './types'
import { useState } from 'react';

function App() {

  const [userInputs, setUserInputs] = useState<UserInputType[]>([]);

  const addUserInput = (newInput: UserInputType) => {
    setUserInputs(prevInputs => [newInput, ...prevInputs]);
  };

  return (
    <>
      <div className="flex">
        <CategoryList/>
        <UserInput addUserInput={addUserInput}/>
      </div>
      <InputList userInputs={userInputs} setUserInputs={setUserInputs}/>
    </>
  )
}

export default App
