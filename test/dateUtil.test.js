import {getDateString} from '../src/dateUtil';

test('getDateString', () => {
    let date = new Date('Mon Jul 24 2023 07:12:43');
    expect(getDateString(date)).toBe('2023/7/24');
    date.setMonth(10);
    date.setDate(5);
    expect(getDateString(date)).toBe('2023/11/5');
});
