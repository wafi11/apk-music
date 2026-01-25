import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useUpdateSong } from "../api/api";

interface DropdownChoiceSongProps {
  id: number;
}
export function DropdownChoiceSong({ id }: DropdownChoiceSongProps) {
  const { mutate, isPending } = useUpdateSong(id);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Ellipsis />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem disabled={isPending} onClick={() => mutate()}>
          Update Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
