import {infunc} from '../src/makeDetail';

test('strWhenBool', () => {
    expect(infunc.strWhenBool(true, 'str')).toBe('str');
    expect(infunc.strWhenBool(false, 'str')).toBe('');
});

test('fillzero', () => {
    expect(infunc.fillzero(5, 2)).toBe('05');
    expect(infunc.fillzero(15, 2)).toBe('15');
});
