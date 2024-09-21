import React, { useState, useCallback, ReactElement, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MoreVertical, Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Category {
  name: string;
  color: string;
  code: string;
}

const CategoryList: React.FC = (): ReactElement => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [hasNewAddition, setHasNewAddition] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const generateRandomColor = useCallback((): string => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
    const lightness = Math.floor(Math.random() * 30) + 35; // 35-65%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }, []);

  const generateNextCode = useCallback((): string => {
    if (categories.length === 0) return 'A00';
    const lastCode = categories[categories.length - 1].code;
    let letter = lastCode[0];
    let number = parseInt(lastCode.slice(1), 10);

    if (number === 99) {
      letter = String.fromCharCode(letter.charCodeAt(0) + 1);
      number = 0;
    } else {
      number++;
    }

    if (letter > 'Z') {
      console.warn('Exceeded maximum code Z99');
      return 'Z99';
    }

    return `${letter}${number.toString().padStart(2, '0')}`;
  }, [categories]);

  const addCategory = (): void => {
    if (newCategory.trim() !== '') {
      const newCode = generateNextCode();
      setCategories([...categories, {
        name: newCategory.trim(),
        color: generateRandomColor(),
        code: newCode
      }]);
      setNewCategory('');
      setHasNewAddition(true);
    }
  };

  useEffect(() => {
    if (hasNewAddition && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      setHasNewAddition(false);
    }
  }, [hasNewAddition]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addCategory();
    }
  };

  const removeCategory = (index: number): void => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const startEditing = (index: number): void => {
    setEditingIndex(index);
    setEditText(categories[index].name);
  };

  const saveEdit = (): void => {
    if (editingIndex !== null && editText.trim() !== '') {
      const updatedCategories = [...categories];
      updatedCategories[editingIndex].name = editText.trim();
      setCategories(updatedCategories);
      setEditingIndex(null);
      setEditText('');
    }
  };

  const cancelEdit = (): void => {
    setEditingIndex(null);
    setEditText('');
  };

  return (
    <Card className="w-[300px] p-4">
      <CardContent>
        <ScrollArea className="max-h-[200px] mb-4 rounded border overflow-y-auto" ref={scrollAreaRef}>
          {categories.map((item, index) => (
            <div key={index} className="p-2 border-b last:border-b-0 flex justify-between items-center">
              <div className="flex items-center flex-1">
                <div
                  className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.code}
                </div>
                {editingIndex === index ? (
                  <Input
                    value={editText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        saveEdit();
                      }
                    }}
                    autoFocus
                    className="flex-1"
                  />
                ) : (
                  <span className="flex-1">{item.name}</span>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => startEditing(index)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => removeCategory(index)}>
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Remove</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </ScrollArea>
        <div className="mt-4">
          {editingIndex === null ? (
            <>
              <Input
                type="text"
                placeholder="New category"
                value={newCategory}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
                onKeyPress={handleKeyPress}
                className="mb-2"
              />
              <Button onClick={addCategory} className="w-full">
                Add category
              </Button>
            </>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={saveEdit} className="flex-1">
                Save Edit
              </Button>
              <Button onClick={cancelEdit} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryList;