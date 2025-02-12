import { useState } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

interface PromptProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  onConfirm?: () => void | Promise<void>;
}

const Prompt: React.FC<PromptProps> = ({
  title = "Are you sure?",
  description = "This action could not be reversible",
  children,
  onConfirm,
}) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant={"destructive"}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Prompt;
