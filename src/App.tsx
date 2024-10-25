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
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="flex flex-col items-center gap-8 p-8">
          <h1 className="text-4xl font-bold text-indigo-600">
            LLM Classifier
          </h1>
          
          <div className="w-full flex justify-center gap-12">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
                Categories
              </h2>
              <CategoryList />
            </div>
            
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
                Inputs
              </h2>
              <UserInput addUserInput={addUserInput} />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
              Results
            </h2>
            <InputList userInputs={userInputs} setUserInputs={setUserInputs} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
