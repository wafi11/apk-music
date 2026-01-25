import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useCreateAlbum } from "../api/api";

interface FormAlbumProps {
  onCancel?: () => void;
}

export function FormAlbum({ onCancel }: FormAlbumProps) {
  const { mutate, isPending } = useCreateAlbum();
  const form = useForm({
    defaultValues: {
      id: "",
    },
  });

  const handleSubmit = (values: { id: string }) => {
    mutate(values.id);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Your Album Id Spotify</FormLabel>
              <Input {...field} placeholder="e.g., 6vV5UrXcfyQD1wu4Qo2I9K" />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 justify-between items-center">
          <Button
            className="w-full"
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
