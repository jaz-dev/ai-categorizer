import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MoreVertical, Edit, Trash } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Category {
    id: number;
    name: string;
    color: string;
    code: string;
}
  
interface UserInput {
    id: number;
    input_data: string;
    Categories: Category[];
}

interface InputBoxProps {
  input: UserInput;
  removeInput: (id: number) => Promise<void>;
}
const API_URL = import.meta.env.VITE_USER_INPUTS_API_URL;

const InputBox: React.FC<InputBoxProps> = ({ input, removeInput }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxChars = 150;
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };
  const needsReadMore = input.input_data.length > maxChars;

  return (
    <Card className="w-full mb-4 last:mb-0">
      <CardContent className="p-4">
        <div className="p-2 border-b last:border-b-0 flex justify-between items-center">
          <div>
            <div className={input.Categories.length > 0 ? "flex mb-3 mt-2" : ""}>
              {input.Categories.map((category) => (
                <div
                  key={category.id}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2"
                  style={{ backgroundColor: category.color}}
                >
                  {category.code}
                </div>
              ))}
            </div>
            <div className="pr-10">
              <ScrollArea className={isExpanded ? "h-40" : "h-auto"}>
                <div>
                  <p className={!isExpanded && needsReadMore ? "line-clamp-3" : ""}>
                    {input.input_data}
                  </p>
                </div>
              </ScrollArea>
              {needsReadMore && (
                <div className="mt-2 text-center">
                  <Button variant="link" onClick={toggleReadMore} className="p-0 h-auto font-normal text-blue-500 hover:text-blue-700">
                    {isExpanded ? 'Read less' : 'Read more'}
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className='item-right'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => removeInput(input.id)}>
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Remove</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InputList: React.FC = () => {
  const [userInputs, setUserInputs] = useState<UserInput[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      fetchUserInputs();
  }, []);

  const removeInput = async (id: number): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete category');
        setUserInputs(userInputs.filter(userInput => userInput.id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
  };

  const fetchUserInputs = async () => {
    try {
      const response = await fetch(API_URL);
      const data: UserInput[] = await response.json();
      setUserInputs(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching user inputs');
      setLoading(false);
      console.error('Error fetching categories:', error);
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <ScrollArea className="h-[500px] w-[800px] border rounded-lg p-6">
      {userInputs.map((input) => (
        <InputBox key={input.id} input={input} removeInput={removeInput} />
      ))}
    </ScrollArea>
  );
};

export default InputList;
