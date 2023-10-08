# rich-text-astro-renderer

Astro renderer for the Contentful rich text field type.

## Installation

Using [npm](http://npmjs.org/):

```sh
npm install @contentful/rich-text-astro-renderer
```

Using [yarn](https://yarnpkg.com/):

```sh
yarn add @contentful/rich-text-astro-renderer
```

## Usage

```javascript
import { documentToAstroComponents } from '@contentful/rich-text-astro-renderer';

const document = {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Hello world!',
          marks: [],
          data: {},
        },
      ],
    },
  ],
};

documentToAstroComponents(document); // -> <p>Hello world!</p>
```

```javascript
import { documentToAstroComponents } from '@contentful/rich-text-astro-renderer';

const document = {
  nodeType: 'document',
  content: [
    {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'Hello',
          marks: [{ type: 'bold' }],
        },
        {
          nodeType: 'text',
          value: ' world!',
          marks: [{ type: 'italic' }],
        },
      ],
    },
  ],
};

documentToAstroComponents(document);
// -> <p><b>Hello</b><u> world!</u></p>
```

You can also pass custom renderers for both marks and nodes as an optional parameter like so:

```javascript
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToAstroComponents } from '@contentful/rich-text-astro-renderer';

const document = {
  nodeType: 'document',
  content: [
    {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'Hello',
          marks: [{ type: 'bold' }],
        },
        {
          nodeType: 'text',
          value: ' world!',
          marks: [{ type: 'italic' }],
        },
      ],
    },
  ],
};

const Bold = ({ children }) => <p className="bold">{children}</p>;

const Text = ({ children }) => <p className="align-center">{children}</p>;

const options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
  },
  renderText: (text) => text.replace('!', '?'),
};

documentToAstroComponents(document, options);
// -> <p class="align-center"><p class="bold">Hello</p><u> world?</u></p>
```

Last, but not least, you can pass a custom rendering component for an embedded entry:

```javascript
import { BLOCKS } from '@contentful/rich-text-types';
import { documentToAstroComponents } from '@contentful/rich-text-astro-renderer';

const document = {
  nodeType: 'document',
  content: [
    {
      nodeType: 'embedded-entry-block',
      data: {
        target: (...)Link<'Entry'>(...);
      },
    },
  ]
};

const CustomComponent = ({ title, description }) => (
  <div>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
);

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const { title, description } = node.data.target.fields;
      return <CustomComponent title={title} description={description} />
    }
  }
};

documentToAstroComponents(document, options);
// -> <div><h2>[title]</h2><p>[description]</p></div>
```

The `renderNode` keys should be one of the following `BLOCKS` and `INLINES` properties as defined in [`@contentful/rich-text-types`](https://www.npmjs.com/package/@contentful/rich-text-types):

- `BLOCKS`

  - `DOCUMENT`
  - `PARAGRAPH`
  - `HEADING_1`
  - `HEADING_2`
  - `HEADING_3`
  - `HEADING_4`
  - `HEADING_5`
  - `HEADING_6`
  - `UL_LIST`
  - `OL_LIST`
  - `LIST_ITEM`
  - `QUOTE`
  - `HR`
  - `EMBEDDED_ENTRY`
  - `EMBEDDED_ASSET`
  - `EMBEDDED_RESOURCE`

- `INLINES`
  - `EMBEDDED_ENTRY` (this is different from the `BLOCKS.EMBEDDED_ENTRY`)
  - `HYPERLINK`
  - `ENTRY_HYPERLINK`
  - `ASSET_HYPERLINK`

The `renderMark` keys should be one of the following `MARKS` properties as defined in [`@contentful/rich-text-types`](https://www.npmjs.com/package/@contentful/rich-text-types):

- `BOLD`
- `ITALIC`
- `UNDERLINE`
- `CODE`

The `renderText` callback is a function that has a single string argument and returns a Astro node. Each text node is evaluated individually by this callback. A possible use case for this is to replace instances of `\n` produced by `Shift + Enter` with `<br/>` Astro elements. This could be accomplished in the following way:

```javascript
const options = {
  renderText: (text) => {
    return text.split('\n').reduce((children, textSegment, index) => {
      return [...children, index > 0 && <br key={index} />, textSegment];
    }, []);
  },
};
```

#### Preserving Whitespace

The `options` object can include a `preserveWhitespace` boolean flag. When set to `true`, this flag ensures that multiple spaces in the rich text content are preserved by replacing them with `&nbsp;`, and line breaks are maintained with `<br />` tags. This is useful for content that relies on specific formatting using spaces and line breaks.

```javascript
import { documentToAstroComponents } from '@contentful/rich-text-astro-renderer';

const document = {
  nodeType: 'document',
  content: [
    {
      nodeType: 'paragraph',
      content: [
        {
          nodeType: 'text',
          value: 'Hello     world!',
          marks: [],
        },
      ],
    },
  ],
};

const options = {
  preserveWhitespace: true,
};

documentToAstroComponents(document, options);
// -> <p>Hello&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;world!</p>
```

In this example, the multiple spaces between "Hello" and "world!" are preserved in the rendered output.
