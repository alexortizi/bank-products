import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
  let pipe: DateFormatPipe;

  beforeEach(() => {
    pipe = new DateFormatPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null value', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined value', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return empty string for empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should format date correctly', () => {
    const result = pipe.transform('2024-01-15');
    expect(result).toBe('15/01/2024');
  });

  it('should format date with single digit day and month', () => {
    const result = pipe.transform('2024-05-05');
    expect(result).toBe('05/05/2024');
  });
});
