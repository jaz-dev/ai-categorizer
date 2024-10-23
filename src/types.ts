interface Category {
  id: number;
  name: string;
  color: string;
  code: string;
}
  
export interface UserInputType {
  id: number;
  input_data: string;
  Categories: Category[];
}
