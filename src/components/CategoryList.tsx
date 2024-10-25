import React, { useState, useCallback, ReactElement, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MoreVertical, Trash } from 'lucide-react';
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

const API_URL = import.meta.env.VITE_CATEGORIES_API_URL;

const CategoryList: React.FC = (): ReactElement => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [hasNewAddition, setHasNewAddition] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateRandomColor = useCallback((): string => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 70;
    const lightness = Math.floor(Math.random() * 30) + 35;
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

  const addCategory = async (): Promise<void> => {
    if (newCategory.trim() !== '') {
      const newCategoryData = {
        name: newCategory.trim(),
        color: generateRandomColor(),
        code: generateNextCode()
      };

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCategoryData)
        });

        if (!response.ok) throw new Error('Failed to add category');

        const addedCategory = await response.json();
        setCategories([...categories, addedCategory]);
        setNewCategory('');
        setHasNewAddition(true);
      } catch (error) {
        console.error('Error adding category:', error);
      }
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

  const removeCategory = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete category');
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const saveEdit = async (): Promise<void> => {
    if (editingId && editText.trim() !== '') {
      try {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: editText.trim() })
        });

        if (!response.ok) throw new Error('Failed to update category');

        const updatedCategory = await response.json();
        setCategories(categories.map(c => c.id === editingId ? updatedCategory : c));
        setEditingId(null);
        setEditText('');
      } catch (error) {
        console.error('Error updating category:', error);
      }
    }
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <Card className="w-[500px] p-4 text-center">
      <CardContent>
        <ScrollArea className="max-h-[200px] mb-4 rounded border overflow-y-auto" ref={scrollAreaRef}>
          {categories.map((item) => (
            <div key={item.id} className="p-2 border-b last:border-b-0 flex justify-between items-center">
              <div className="flex items-center flex-1">
                <div
                  className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.code}
                </div>
                <span className="flex-1">{item.name}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => removeCategory(item.id)}>
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Remove</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </ScrollArea>
        <div className="mt-4">
          {editingId === null ? (
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
