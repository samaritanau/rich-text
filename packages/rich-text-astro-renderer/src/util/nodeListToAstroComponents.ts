
import { helpers, Mark } from '@contentful/rich-text-types';
import { CommonNode, Options } from '../index.ts';
import { appendKeyToValidElement } from './appendKeyToValidElement';
import base from './base.astro';

export function nodeListToAstroComponents(nodes: CommonNode[], options: Options): Fragment {
  return nodes.map((node: CommonNode, index: number): Fragment => {
    return appendKeyToValidElement(nodeToAstroComponent(node, options), index);
  });
}

export function nodeToAstroComponent(node: CommonNode, options: Options): Fragment {
  const { renderNode, renderMark, renderText, preserveWhitespace } = options;

  if (helpers.isText(node)) {
    let nodeValue: Fragment = renderText ? renderText(node.value) : node.value;

    if (preserveWhitespace) {
      // Preserve multiple spaces.
      nodeValue = (nodeValue as string).replace(/ {2,}/g, (match) => '&nbsp;'.repeat(match.length));

      // Preserve line breaks.
      let lines = (nodeValue as string).split('\n');
      let jsxLines: (string | Fragment)[] = [];
      lines.forEach((line, index) => {
        jsxLines.push(line);
        if (index !== lines.length - 1) {
          jsxLines.push(<base><br /></base>);
        }
      });
      nodeValue = jsxLines;
    }

    return node.marks.reduce((value: Fragment, mark: Mark): Fragment => {
      if (!renderMark[mark.type]) {
        return value;
      }
      return renderMark[mark.type](value);
    }, nodeValue);
  } else {
    const children: Fragment = nodeToAstroComponent(node.content, options);
    if (!node.nodeType || !renderNode[node.nodeType]) {
      return <Fragment>{children}</Fragment>;
    }
    return renderNode[node.nodeType](node, children);
  }
}
