import { formateaRut } from "./formatRut";
describe('formatRut', () => {
    it('should return the input when it is not a valid RUT', () => {
        const rut = '12345678-9';
        const result = formateaRut(rut);
        expect(result).not.toEqual('12345678-9');
      });
      it('should return the input when it is not a string', () => {
        const rut = 123456789;
        const result = formateaRut(rut);
        expect(result).not.toEqual(123456789);
      });
      it('should return an empty string when the input is empty', () => {
        const rut = '';
        const result = formateaRut(rut);
        expect(result).toBe('');
      });
      it('should correctly format a valid RUT with leading zeros', () => {
        const rut = '0000123456789';
        const result = formateaRut(rut);
        expect(result).toBe('12.345.678-9');
      });
      it('should correctly format a valid RUT without dots and dash', () => {
        const rut = '123456789';
        const result = formateaRut(rut);
        expect(result).toBe('12.345.678-9');
      });
});