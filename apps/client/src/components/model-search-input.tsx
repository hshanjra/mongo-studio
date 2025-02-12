import { Search } from "lucide-react";
import { Input } from "./ui/input";

const ModelSearchInput = () => {
  return (
    <div className="relative flex items-center">
      <Search className="fixed ml-2 text-muted-foreground" size={16} />
      <Input placeholder="Search models" className="pl-8" />
    </div>
  );
};

export default ModelSearchInput;
