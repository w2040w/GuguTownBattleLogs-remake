let jsdom = require('jsdom');
let Dexie = require('dexie');
const {JSDOM} = jsdom;
const myJSDom = new JSDOM (`<button type="button" class="btn btn-lg" onclick="window.location.href='fyg_index.php#'">user</button>`);
const $ = require('jquery')(myJSDom.window);
global.$ = $;
global.document = myJSDom.window.document;
global.Dexie = Dexie;
global.unsafeWindow = global;
class LocalStorageMock {
    store = {};
    getItem(key){
        return this.store[key] || null;
    }
    setItem(key, value){
        this.store[key] = String(value);
    }
    clear(){
        this.store = {};
    }
}
global.GM_getValue = jest.fn();
global.localStorage = new LocalStorageMock;
