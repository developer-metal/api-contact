import { not } from "joi";
import { Csrf } from "./csrf.dto";
import { Test, TestingModule } from "@nestjs/testing";
describe('Csrf', () => {
    let authservice: Csrf; // Use a different variable name and type annotation
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Csrf],
            imports: []
        }).compile();

        authservice = module.get<Csrf>(Csrf);
    });

    it('should have a default code value of 200', () => {
        const csrf = new Csrf();
        expect(csrf.code).toBe(200);
    });

    it('should allow setting a non-200 code value', () => {
        const csrf = new Csrf();
        csrf.code = 404;
        expect(csrf.code).toBe(404);
    });

    it('should allow setting an empty string as payload value', () => {
        const csrf = new Csrf();
        csrf.payload = '';
        expect(csrf.payload).toBe('');
    });

    it('should allow setting a negative number as code value', () => {
        const csrf = new Csrf();
        csrf.code = -1;
        expect(csrf.code).toBe(-1);
    });

    it('should allow setting a string with special characters as payload value', () => {
        const csrf = new Csrf();
        csrf.payload = 'abc!@#';
        expect(csrf.payload).toBe('abc!@#');
    });
  
});