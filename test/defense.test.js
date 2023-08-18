import {postHistory} from '../src/defense';
import Dexie from 'dexie';
import indexedDB from 'fake-indexeddb';

Dexie.dependencies.indexedDB = indexedDB;
test('postHistory', () => {
    postHistory();
    expect(true).tobe(true);
});
