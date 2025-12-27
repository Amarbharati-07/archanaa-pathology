import { z } from 'zod';
import { insertBookingSchema, tests, packages, reviews, bookings } from './schema';

export const api = {
  tests: {
    list: {
      method: 'GET' as const,
      path: '/api/tests',
      responses: {
        200: z.array(z.custom<typeof tests.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/tests/:id',
      responses: {
        200: z.custom<typeof tests.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
  },
  packages: {
    list: {
      method: 'GET' as const,
      path: '/api/packages',
      responses: {
        200: z.array(z.custom<typeof packages.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/packages/:id',
      responses: {
        200: z.custom<typeof packages.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
  },
  reviews: {
    list: {
      method: 'GET' as const,
      path: '/api/reviews',
      responses: {
        200: z.array(z.custom<typeof reviews.$inferSelect>()),
      },
    },
  },
  bookings: {
    create: {
      method: 'POST' as const,
      path: '/api/bookings',
      input: insertBookingSchema,
      responses: {
        201: z.custom<typeof bookings.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
