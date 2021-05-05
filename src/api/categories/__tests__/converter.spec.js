const {
  convertCategory,
  convertQueryToWhere,
  buildChildren
} = require('../converter');

describe('Converter', () => {
  describe('Convert category', () => {
    test('should return only the selected items', () => {
      expect(
        convertCategory({
          id: 'category-1',
          version: 1,
          createdBy: {
            clientId: 'jpU_CeVxwLObZOQL9kFHku6d',
            isPlatformClient: false
          },
          name: {
            'en-US': '60s Knit Fashion Dresses'
          },
          slug: {
            'en-US': '60s_knit_fashion_dresses'
          },
          description: {
            'en-US': ''
          },
          externalId: '3553',
          metaTitle: {
            'en-US': ''
          },
          metaDescription: {
            'en-US': ''
          },
          metaKeywords: {
            'en-US': ''
          },
          orderHint: 'foo',
          ancestors: [{ id: 'foo', obj: { name: 'foo', slug: 'foo' } }]
        })
      ).toEqual({
        id: 'category-1',
        name: {
          'en-US': '60s Knit Fashion Dresses'
        },
        description: {
          'en-US': ''
        },
        slug: {
          'en-US': '60s_knit_fashion_dresses'
        },
        metaTitle: {
          'en-US': ''
        },
        metaDescription: {
          'en-US': ''
        },
        metaKeywords: {
          'en-US': ''
        },
        children: [],
        orderHint: 'foo',
        parent: undefined,
        ancestors: [{ id: 'foo', name: 'foo', slug: 'foo' }]
      });
    });

    test('should return category without expand ancestors,', () => {
      expect(
        convertCategory({
          ancestors: [{ id: 'foo' }]
        })
      ).toEqual({
        children: [],
        ancestors: [{ id: 'foo' }]
      });
    });
  });

  describe('convertQueryToWhere', () => {
    test('should dont have any query', () => {
      expect(convertQueryToWhere({}, 'en')).toEqual([]);
    });

    test('should have name in query', () => {
      expect(convertQueryToWhere({ name: 'foo' }, 'en')).toEqual([
        'name(en="foo")'
      ]);
    });

    test('should have slug in query', () => {
      expect(convertQueryToWhere({ slug: 'foo' }, 'en')).toEqual([
        'slug(en="foo")'
      ]);
    });

    test('should have isCategoryRoot to true', () => {
      expect(convertQueryToWhere({ isCategoryRoot: true }, 'en')).toEqual([
        'parent is not defined'
      ]);
    });

    test('should have isCategoryRoot to false', () => {
      expect(convertQueryToWhere({ isCategoryRoot: false }, 'en')).toEqual([
        'parent is defined'
      ]);
    });
  });

  describe('buildChildren', () => {
    const rawCategories = [
      { id: 'foo', ancestors: [] },
      { id: 'bar', ancestors: [] },
      { id: 'foo-1', ancestors: [{ id: 'foo' }], parent: { id: 'foo' } },
      { id: 'foo-2', ancestors: [{ id: 'foo' }], parent: { id: 'foo' } },
      {
        id: 'foo-1-1',
        ancestors: [{ id: 'foo' }, { id: 'foo-1' }],
        parent: { id: 'foo-1' }
      },
      { id: 'bar-1', ancestors: [{ id: 'bar' }], parent: { id: 'bar' } }
    ];
    const childrenBuilded = [
      {
        id: 'foo',
        ancestors: [],
        children: [
          {
            id: 'foo-1',
            ancestors: [{ id: 'foo' }],
            children: [
              {
                id: 'foo-1-1',
                ancestors: [{ id: 'foo' }, { id: 'foo-1' }],
                parent: { id: 'foo-1' },
                children: []
              }
            ],
            parent: { id: 'foo' }
          },
          {
            id: 'foo-2',
            ancestors: [{ id: 'foo' }],
            children: [],
            parent: { id: 'foo' }
          }
        ]
      },
      {
        id: 'bar',
        ancestors: [],
        children: [
          {
            id: 'bar-1',
            ancestors: [{ id: 'bar' }],
            children: [],
            parent: { id: 'bar' }
          }
        ]
      }
    ];
    it('should build children correctly', () => {
      expect(buildChildren(rawCategories)).toEqual(childrenBuilded);
    });
  });
});
