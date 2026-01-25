import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { PostSong, useCreatePost } from "../api/api";
import { toast } from "sonner";

export function FormMusic() {
  const { mutate, isPending } = useCreatePost();
  const form = useForm<PostSong>({
    defaultValues: {
      linkSpotify: "",
      linkYtMusic: "",
    },
  });

  const onSubmit = (values: PostSong) => {
    mutate(values, {
      onSuccess: (ctx) => {
        toast.success(ctx);
      },
      onError: (ctx) => {
        toast.error(ctx.message ?? ctx);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          name="linkSpotify"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link Spotify</FormLabel>
              <FormControl>
                <Input
                  placeholder="Link Spotify"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>Copy Link From Spotify</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="linkYtMusic"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link Youtube Music</FormLabel>
              <FormControl>
                <Input
                  placeholder="Link Youtube Music"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>Copy Link From Youtube Music</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between gap-2">
          <Button
            type="button"
            variant={"ghost"}
            className="w-full border-2"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" className="w-full" disabled={isPending}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
