import { not } from "joi";
import { TokenList } from "./tokenList.dto";
import { Test, TestingModule } from "@nestjs/testing";
describe('TokenList', () => {
    let authservice: TokenList;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TokenList],
            imports: []
        }).compile();

        authservice = module.get<TokenList>(TokenList);
    });
    // token is null
    it('should have null token', () => {
        const tokenList = new TokenList();
        tokenList.token = null;
  
        expect(tokenList.token).toBeNull();
      });
      // date is undefined
      it('should have undefined date', () => {
        const tokenList = new TokenList();
        tokenList.date = undefined;
  
        expect(tokenList.date).toBeUndefined();
      });
          // secret is undefined
    it('should have undefined secret', () => {
        const tokenList = new TokenList();
        tokenList.secret = undefined;
  
        expect(tokenList.secret).toBeUndefined();
      });
          // token is undefined
    it('should have undefined token', () => {
        const tokenList = new TokenList();
        tokenList.token = undefined;
  
        expect(tokenList.token).toBeUndefined();
      });
          // All properties are optional
    it('should have optional properties', () => {
        const tokenList = new TokenList();
  
        expect(tokenList.token).toBeUndefined();
        expect(tokenList.secret).toBeUndefined();
        expect(tokenList.date).toBeUndefined();
      });
          // All properties have valid values
    it('should have valid values for all properties', () => {
        const tokenList = new TokenList();
        tokenList.token = 'validToken';
        tokenList.secret = 'validSecret';
        tokenList.date = 'validDate';
  
        expect(tokenList.token).toBe('validToken');
        expect(tokenList.secret).toBe('validSecret');
        expect(tokenList.date).toBe('validDate');
      });
});