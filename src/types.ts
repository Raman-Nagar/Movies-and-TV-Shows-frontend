import z from "zod";

export interface Entry {
    id: number;
    title: string;
    type: 'movie' | 'tv-show';
    director: string;
    budget: number;
    location: string;
    duration: string;
    year: number;
    createdAt: string;
}

export const insertEntrySchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    type: z.enum(["movie", "tv-show"]),
    director: z.string().min(1, { message: "Director is required." }),
    budget: z.string().min(0, { message: "Budget must be a positive string." }),
    location: z.string().min(1, { message: "Location is required." }),
    duration: z.string().min(1, { message: "Duration is required." }),
    year: z.string(),
});

export type InsertEntry = z.infer<typeof insertEntrySchema>;
