import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const UserInput = () => {
  const [inputType, setInputType] = useState<'text' | 'csv'>('text');

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
      <div className="border border-gray-300 p-4 rounded-b-lg  min-w-[800px]">
        {inputType === 'text' ? (
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your text here..."
              className="w-full h-32"
            />
            <Button className="w-full">Submit</Button>
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

const TabButton: React.FC<{
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}> = ({ children, active, onClick }) => (
  <button
    className={`px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none ${
      active
        ? 'bg-white text-blue-600 border-t border-l border-r border-gray-300'
        : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-50'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default UserInput;