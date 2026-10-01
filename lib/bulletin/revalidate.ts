import { revalidatePath } from "next/cache";

/** Make the public pages pick up a publish/edit immediately. */
export function revalidateBulletin(date: string) {
  revalidatePath("/bulletin");
  revalidatePath("/bulletin/archive");
  revalidatePath(`/bulletin/${date}`);
}
