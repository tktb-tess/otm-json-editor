import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import rehypeStringify from 'rehype-stringify';
import DOMPurify from 'dompurify';

const purifier = DOMPurify(window);

const mdToHtml = async (markdown: string): Promise<string> => {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(rehypeStringify)
    .process(markdown)
    .then((v) => purifier.sanitize(v.toString()));
};

export default mdToHtml;
