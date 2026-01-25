import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useState } from "react";
import { DialogFormMusic } from "./DialogFormMusic";
import { DialogFormAlbum } from "@/features/albums/components/DialogFormAlbums";

interface DropdownCreateMusicOrAlbumsProps {
  children: ReactNode;
}

export function DropdownCreateMusicOrAlbums({
  children,
}: DropdownCreateMusicOrAlbumsProps) {
  const [openSong, setOpenSong] = useState<boolean>(false);
  const [openAlbum, setOpenAlbum] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpenSong(!openSong)}>
            Tambahkan Music
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenAlbum(!openAlbum)}>
            Tambahkan Album
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {openSong && (
        <DialogFormMusic
          open={openSong}
          setOpen={() => setOpenSong(!openSong)}
        />
      )}
      {openAlbum && (
        <DialogFormAlbum
          open={openAlbum}
          setOpen={() => setOpenAlbum(!openAlbum)}
        />
      )}
    </>
  );
}
