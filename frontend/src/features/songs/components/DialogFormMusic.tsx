import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormMusic } from "./FormMusic";

interface DialogFromMusicProps {
  open: boolean;
  setOpen: () => void;
}
export function DialogFormMusic({ open, setOpen }: DialogFromMusicProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Form Create Music</DialogTitle>
          <DialogDescription>Uploud Dulu ya wkwkwk</DialogDescription>
          <FormMusic />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
