import React from "react";
import { Button } from "./ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { LIMIT_MESSAGE } from "@/lib/constant";
import { getFromAndTo } from "@/lib/utils";
import { useMessage } from "@/lib/store/messages";
import { toast } from "sonner";

export default function LoadMoreMessages() {
  const page = useMessage((state) => state.page);
  const setMessage = useMessage((state) => state.setMessage);
  const hasMore = useMessage((state) => state.hasMore);

  const { from, to } = getFromAndTo(page, LIMIT_MESSAGE);

  const fetchMore = async () => {
    const supabase = supabaseBrowser();

    const { data, error } = await supabase
      .from("messages")
      .select("*,users(*)")
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      // console.log(data);
      setMessage(data.reverse());
    }
  };

  if (hasMore) {
    return (
      <Button variant="outline" className="w-full text-white bg-gradient-to-r from-pink-600 to-blue-600" onClick={fetchMore}>
        Load More
      </Button>
    );
  } else {
    return <></>;
  }
}
