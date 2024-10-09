import { Test, TestingModule } from "@nestjs/testing";
import sanitizeHtml from 'sanitize-html';
import { SanitizeHtml } from "./sanitizeHtml.constraint";
describe('SanitizeHtml', () => {
    let sanitizerInstance: sanitizeHtml;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [sanitizeHtml],
            imports: []
        }).compile();
        sanitizerInstance = module.get<sanitizeHtml>(sanitizeHtml);
    });
        it('should return true when given a string with allowed HTML tags', () => {
            const testObject = {testProperty: '<p>This is a test string with <strong>allowed</strong> HTML tags</p>'};
            SanitizeHtml()(testObject, 'testProperty');
            expect(testObject.testProperty).toBe('<p>This is a test string with <strong>allowed</strong> HTML tags</p>');
        });
        it('should return the same string when it contains only allowed HTML tags', () => {
            const input = '<p>This is a paragraph</p>';
            const expectedOutput = '<p>This is a paragraph</p>';
            const actualOutput = sanitizeHtml(input);
            expect(actualOutput).toEqual(expectedOutput);
        });
    it('should return true when given a string containing only allowed HTML tags', () => {
        const testObject = {testProperty: '<p>This is a test paragraph</p>'};
        SanitizeHtml()(testObject, 'testProperty');
        expect(testObject.testProperty).toBe('<p>This is a test paragraph</p>');
    });
    it('should return true when given an empty string', () => {
            const customSen = SanitizeHtml();
            expect(customSen('', '')).toBe(undefined);
    });
        it('should sanitize a valid input string containing only allowed HTML tags', () => {
            const input = '<p>This is a paragraph.</p>';
            const expectedOutput = '<p>This is a paragraph.</p>';
            const sanitizedValue = sanitizeHtml(input, {
              allowedTags: ['html','head','title','body','p','address','article',
                'aside','footer','header','h1','h2','h3','h4','h5','h6','hgroup',
                'main','nav','section','blockquote','dd','div','dl','dt','figcaption',
                'figure','hr','li','main','ol','p','pre','ul','a','abbr','b','bdi','bdo','br','cite',
                'code','data','dfn','em','i','kbd','mark','q','rb','rp','rt','rtc','ruby','s','samp',
                'small','span','strong','sub','sup','time','u','var','wbr','caption','col','colgroup',
                'table','tbody','td','tfoot','th','thead','tr']
            });
            expect(sanitizedValue).toEqual(expectedOutput);
          });
});