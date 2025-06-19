import { supabase } from "./client";

export const fetchGames = async () =>
    supabase.from("game").select(`id, name, illustration`).order("name", { ascending: true });
