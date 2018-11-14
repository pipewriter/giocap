
const fs = require('fs');
const shelljs = require('shelljs');
const GIOCAP_VERSION = 0.1;

if(process.argv.length != 3){
    console.log('usage: giocap <capture name>');
    return; //abort
}

const captureName = process.argv[2];

if(!fs.existsSync('./index.html')){
    console.log('ERROR: no index.html was found to link. Bailing out...');
    return;
}

const cwd = process.cwd();
const now = new Date();

if(!fs.existsSync('docs')){
    console.log('no docs folder found, creating...');
    fs.mkdirSync('docs');
}

const initialIndexText = 
`
<h1>giocap v${GIOCAP_VERSION}</h1>
<a href="https://www.npmjs.com/package/giocap">npm link</a>
<br>
<a href="https://github.com/pipewriter/giocap">github link</a>
`;

if(!fs.existsSync('docs/index.html')){
    console.log('no index file found, creating...');
    shelljs.ShellString(initialIndexText).to('docs/index.html');
}

// const capFolderName = now.toISOString();
const capFolderName = now.valueOf();
const capFolderPath = 'docs/' + capFolderName;
fs.mkdirSync(capFolderPath);
const files = fs.readdirSync('./');

files.forEach((file) => {
    if(file !== 'docs' && file !== '.git'){
        shelljs.cp('-R', file, capFolderPath + '/' + file);
    }
});

const indexPath =  + '/index.html';
const fancyDate = now.toString();
const captureText = 
`<h3>
<a href="${'./'+capFolderName + '/index.html'}">${captureName}</a>
</h3>
Captured on: <span style="color:blue;">${fancyDate}</span>
<hr>`;

const oldIndexFile = cat('docs/index.html');
shelljs.ShellString(captureText).to('docs/index.html');
oldIndexFile.toEnd('docs/index.html');
