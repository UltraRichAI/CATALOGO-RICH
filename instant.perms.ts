// instant.perms.ts
// Reglas de permisos para InstantDB en producción
import type { InstantRules } from '@instantdb/react';

const rules = {
  $users: {
    allow: {
      view: 'auth.id != null',
      create: 'false',
      delete: 'false',
      update: 'auth.id == data.id',
    },
  },
  categories: {
    allow: {
      // Público puede consultar categorías para navegar el catálogo
      view: 'true',
      // Solo usuarios autenticados pueden crear, modificar o eliminar
      create: 'auth.id != null',
      delete: 'auth.id != null',
      update: 'auth.id != null',
    },
  },
  products: {
    allow: {
      // Público puede consultar productos para navegar el catálogo
      view: 'true',
      // Solo usuarios autenticados pueden crear, modificar o eliminar
      create: 'auth.id != null',
      delete: 'auth.id != null',
      update: 'auth.id != null',
    },
  },
} satisfies InstantRules;

export default rules;
