import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
}
const API_URL = import.meta.env.VITE_USER_INPUTS_API_URL;

const InputBox: React.FC<InputBoxProps> = ({ input }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxChars = 150;
    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };
    const needsReadMore = input.input_data.length > maxChars;

    return (
        <Card className="w-full mb-4 last:mb-0">
        <CardContent className="p-4">
            <div className="flex items-center mb-3 mt-2">
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
            <ScrollArea className={isExpanded ? "h-40" : "h-auto"}>
            <p className={!isExpanded && needsReadMore ? "line-clamp-3" : ""}>
                {input.input_data}
            </p>
            </ScrollArea>
            {needsReadMore && (
            <div className="text-center mt-2">
                <Button variant="link" onClick={toggleReadMore} className="p-0 h-auto font-normal text-blue-500 hover:text-blue-700">
                {isExpanded ? 'Read less' : 'Read more'}
                </Button>
            </div>
            )}
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
        <ScrollArea className="h-[500px] w-[600px] border rounded-lg p-6">
            {userInputs.map((input) => (
                <InputBox key={input.id} input={input} />
            ))}
        </ScrollArea>
    );
};

export default InputList;
