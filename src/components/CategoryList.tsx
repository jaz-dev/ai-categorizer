import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  const addCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  return (
    <Card className="w-[300px] p-4">
      <CardContent>
        <ScrollArea className="max-h-[200px] mb-4 rounded border overflow-y-auto">
          {categories.map((item, index) => (
            <div key={index} className="p-2 border-b last:border-b-0">
              {item}
            </div>
          ))}
        </ScrollArea>
        <div className="mt-4">
          <Input
            type="text"
            placeholder="New category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="mb-2"
          />
          <Button onClick={addCategory} className="w-full">
            Add category
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryList;