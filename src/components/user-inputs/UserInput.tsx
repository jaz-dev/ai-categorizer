import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import TabButton from "./TabButton";

const API_URL = import.meta.env.VITE_USER_INPUTS_API_URL;

const UserInput = () => {
  const [inputType, setInputType] = useState<'text' | 'csv'>('text');
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      setError('Please enter some text before submitting.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_data: textInput }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Submitted successfully:', data);
      setTextInput(''); // Clear the input after successful submission
    } catch (err) {
      console.error('Error submitting input:', err);
      setError('Failed to submit input. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex">
        <TabButton 
          active={inputType === 'text'} 
          onClick={() => setInputType('text')}
        >
          Text
        </TabButton>
        <TabButton 
          active={inputType === 'csv'} 
          onClick={() => setInputType('csv')}
        >
          CSV
        </TabButton>
      </div>
      <div className="border border-gray-300 p-4 rounded-b-lg min-w-[800px]">
        {inputType === 'text' ? (
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your text here..."
              className="w-full h-32"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button 
              className="w-full" 
              onClick={handleTextSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <Input
                type="file"
                accept=".csv"
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">Upload CSV File</p>
            </div>
            <Button className="w-full">Submit</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInput;