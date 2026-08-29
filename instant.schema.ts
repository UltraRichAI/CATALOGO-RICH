import { i } from '@instantdb/react';

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    categories: i.entity({
      name: i.string(),
      description: i.string().optional(),
      imageUrl: i.string().optional(),
      active: i.boolean(),
      createdAt: i.number(),
      order: i.number().optional(),
    }),
    products: i.entity({
      name: i.string(),
      description: i.string(),
      price: i.number(),
      comparePrice: i.number().optional(),
      imageUrl: i.string(),
      category: i.string().optional(),
      categoryId: i.string().optional(),
      active: i.boolean(),
      featured: i.boolean(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
  },
  links: {
    productCategory: {
      forward: {
        on: 'products',
        has: 'one',
        label: 'categoryLink',
      },
      reverse: {
        on: 'categories',
        has: 'many',
        label: 'products',
      },
    },
  },
});

type AppSchema = typeof _schema;
export default _schema;
export type { AppSchema };
