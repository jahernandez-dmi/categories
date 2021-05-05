const {
  category: {
    category: {
      description: descCat,
      properties: { id }
    },
    categoryDraft: {
      type,
      description: descCatDraft,
      properties: {
        name,
        description,
        slug,
        metaTitle,
        metaDescription,
        metaKeywords,
        orderHint,
        parent,
        ancestors
      }
    }
  },
  httpApi: { searchParams, pagedQueryResult }
} = require('commercetools-entities-schemas');

const customCategoryDraft = {
  description: descCatDraft,
  type,
  properties: {
    name,
    description,
    slug,
    metaTitle,
    metaDescription,
    metaKeywords,
    orderHint,
    parent
  },
  required: ['name']
};

const customCategory = {
  ...customCategoryDraft,
  description: descCat,
  properties: {
    ...customCategoryDraft.properties,
    id,
    ancestors: {
      ...ancestors,
      items: {
        type: 'object',
        properties: {
          id,
          name,
          slug
        }
      }
    },
    children: {
      type: 'array'
    }
  },
  required: [...customCategoryDraft.required, 'id']
};

const errorResponse = {
  type: 'object',
  properties: {
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description:
              'unique identifier for this particular occurrence of the problem'
          },
          code: {
            type: 'string',
            enum: ['001'],
            description: `> an internal specific error code:
             - 001: Request schema validation error
             
             `
          },
          status: {
            type: 'string',
            description: 'the HTTP status code applicable to this problem'
          },
          title: {
            type: 'string',
            description: 'a short, human-readable summary of the problem'
          },
          detail: {
            type: 'string',
            description: 'a human-readable explanation'
          },
          meta: {
            type: 'object',
            description:
              'a meta object containing non-standard meta-information',
            additionalProperties: true
          }
        },
        required: ['status']
      }
    }
  },
  required: ['errors']
};

const defaultResponse = {
  '4XX': {
    description: 'Client Error',
    ...errorResponse
  },
  '5XX': {
    description: 'Internal Server Error',
    ...errorResponse
  }
};

const getBySlugSchema = {
  title: 'Get category by slug',
  description: 'Get category by slug',
  operationId: 'GetCategoryBySlug',
  tags: ['public'],
  querystring: {
    type: 'object',
    properties: {
      locale: { type: 'string', default: 'en-US' },
      getChildren: {
        type: 'boolean',
        description:
          'Indicates whether it is necessary to search for child categories or not',
        default: false
      }
    }
  },
  params: {
    type: 'object',
    properties: {
      slug: { type: 'string', description: 'Category slug' }
    },
    required: ['slug']
  },

  response: {
    200: customCategory,
    ...defaultResponse
  }
};

const getByIdSchema = {
  title: 'Get category by id',
  description: 'Get category by id',
  operationId: 'GetCategoryById',
  tags: ['public'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  querystring: {
    type: 'object',
    properties: {
      getChildren: {
        type: 'boolean',
        description:
          'Indicates whether it is necessary to search for child categories or not',
        default: false
      }
    }
  },
  response: {
    200: customCategory,
    ...defaultResponse
  }
};

const findSchema = {
  title: 'Find categories',
  description: 'Find categories',
  operationId: 'FindCategories',
  tags: ['public'],
  querystring: {
    ...searchParams,
    properties: {
      ...searchParams.properties,
      locale: { type: 'string', default: 'en' },
      isCategoryRoot: {
        type: 'boolean',
        description: 'Search for root categories'
      },
      name: { type: 'string', description: 'Search by name field' },
      slug: { type: 'string', description: 'Search by slug field' },
      getChildren: {
        type: 'boolean',
        description:
          'Indicates whether it is necessary to search for child categories or not',
        default: false
      }
    }
  },
  response: {
    200: {
      ...pagedQueryResult,
      properties: {
        ...pagedQueryResult.properties,
        results: {
          ...pagedQueryResult.properties.results,
          items: customCategory
        }
      }
    },
    ...defaultResponse
  }
};

const createSchema = {
  title: 'Create category',
  description: 'Create category',
  operationId: 'CreateCategory',
  tags: ['private'],
  body: customCategoryDraft,
  response: {
    201: customCategory,
    ...defaultResponse
  }
};

const updateSchema = {
  title: 'Update category',
  description: 'Update category',
  operationId: 'UpdateCategory',
  tags: ['private'],
  body: customCategoryDraft,
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  response: {
    200: customCategory,
    ...defaultResponse
  }
};

const removeSchema = {
  title: 'Delete category',
  description: 'Delete category',
  operationId: 'DeleteCategory',
  tags: ['private'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id']
  },
  response: {
    200: customCategory,
    ...defaultResponse
  }
};

module.exports = {
  getBySlugSchema,
  getByIdSchema,
  findSchema,
  createSchema,
  updateSchema,
  removeSchema
};
