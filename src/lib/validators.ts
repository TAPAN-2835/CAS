import { z } from 'zod'

export const eventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    date: z.string(),
    time: z.string(),
    location: z.string().min(3, 'Location is required'),
    price: z.number().min(0),
    category: z.string(),
    image: z.string().url().optional(),
})

export const communitySchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.string(),
    location: z.string().min(3, 'Location is required'),
    image: z.string().url().optional(),
})

export const organizerSchema = z.object({
    org_name: z.string().min(3, 'Organization name must be at least 3 characters'),
    bio: z.string().optional(),
    phone: z.string().optional(),
    logo_url: z.string().url().optional(),
})
