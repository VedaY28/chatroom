import { createServerClient } from "@supabase/ssr";
import { cookies } from 'next/headers';
import { Database } from "../types/supabase";

export const supabaseServer = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase URL or anon key is not provided.");
    }

    const cookieStore = cookies();

    return createServerClient<Database>(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );
};
