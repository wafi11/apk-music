import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormAlbum } from "./FormAlbum";

interface DialogFormAlbumProps {
  open: boolean;
  setOpen: () => void;
}

export function DialogFormAlbum({ open, setOpen }: DialogFormAlbumProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Album</DialogTitle>
          <DialogDescription>Create Album</DialogDescription>
        </DialogHeader>
        <FormAlbum onCancel={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
