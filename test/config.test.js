import {setflashtime, refreshMaxtime, setBanpveFlag, banpveFlag} from '../src/config.js';

test('setflashtime', () =>{
    let newtime = 50;
    setflashtime(newtime);
    expect(refreshMaxtime).toBe(newtime);
    expect(localStorage.getItem('flashtime')).toBe('50');
});
test('setflashtimeNeg', () =>{
    let newtime = -10;
    setflashtime(newtime);
    expect(refreshMaxtime).toBe(-1);
    expect(localStorage.getItem('flashtime')).toBe('-10');
});
test('setBanpveFlag', () => {
    setBanpveFlag(false);
    expect(banpveFlag).toBe(false);
    expect(localStorage.getItem('banpveFlag')).toBe('false');
});
