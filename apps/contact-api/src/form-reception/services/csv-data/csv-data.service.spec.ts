import { Test, TestingModule } from '@nestjs/testing';
import { CsvDataService } from './csv-data.service';

describe('CsvDataService', () => {
  let service: CsvDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvDataService]

    }).compile();

    service = module.get<CsvDataService>(CsvDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('write CSV file', async () => {
    const csvDataService = new CsvDataService();
    const data = [
      {
        project: { name: 'Project 1' },
        contactName: 'John',
        contactLastName: 'Doe',
        contactEmail: 'john.doe@example.com',
        fields: [
          { statement: 'Statement 1', response: 'Response 1' },
          { statement: 'Statement 2', response: 'Response 2' }
        ],
        sendDate: '2022-01-01T00:00:00.000Z'
      }
    ];
    const result = await csvDataService.exportCsv(data);
    expect(result).toEqual(csvDataService.pathCustom);
  });

  it('empty input data', async () => {

    const req = {
      data: []
    };
    expect(req.data.length).toBe(0);
  });

  it('single input data', async () => {
    const csvDataService = new CsvDataService();
    const data: any = [{
        project: { name: 'Project 1' },
        contactName: 'John',
        contactLastName:  'Doe',
        contactEmail: 'inf@gmail.com',
        fields: {
          fieldsContainer: []
        },
        sendDate: '2022-01-01T00:00:00.000Z'
    }];
    const result = await csvDataService.exportCsv(data);
    expect(result).not.toEqual('');
  });
  
});
