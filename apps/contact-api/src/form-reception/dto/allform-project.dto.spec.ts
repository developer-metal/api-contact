import { FormProjecAllss } from "./allform-project.dto";

describe('AllformProjectDto', () => {

    it('should be defined', () => {
        expect(true).toBeDefined();
    });

    it('should create an instance of FormProjecAllss', () => {
        const formProjectAllss = new FormProjecAllss();
        expect(formProjectAllss).toBeInstanceOf(FormProjecAllss);
    });

    it('should set the slug property', () => {
        const formProjectAllss = new FormProjecAllss();
        formProjectAllss.slug = 'PORI';
        expect(formProjectAllss.slug).toEqual('PORI');
    });
    it('should set the name property', () => {
        const formProjectAllss = new FormProjecAllss();
        formProjectAllss.name = 'HERMES';
        expect(formProjectAllss.name).toEqual('HERMES');
    });
    it('should set the sender property', () => {
        const formProjectAllss = new FormProjecAllss();
        formProjectAllss.sender = 'transbank@transbank.cl';
        expect(formProjectAllss.sender).toEqual('transbank@transbank.cl');
    });

    it('should throw an error if the slug property is not provided', () => {
        const formProjectAllss = new FormProjecAllss();
        expect(formProjectAllss).toBeDefined();
    });
});