'use strict';

const path = require('path');
const repl = require('repl');
const figlet = require('figlet');
const DLogsAPI = require('./DLogsAPI.js');

const dlogs = new DLogsAPI(
    {
       "appName": "DLogs",
       "artifactDir": "/home/jasonlin/Proj/Playground/dlogs/build/contracts",
       "conditionDir": "/home/jasonlin/Proj/Playground/ethsf_dlogs/conditions",
       "contracts": [{ "ctrName": "DLogs", "conditions": ["Sanity"] }],
       "networkID": 4,
       "version": "1.0"	
    }
);

// Temporary solution before UI is migrated...
dlogs.cfgObjs.geth = require('/home/jasonlin/.rinkeby/config.json');
dlogs.cfgObjs.ipfs = require('/home/jasonlin/.rinkeby/ipfsserv.json');
dlogs.connectRPC(3000)();

// ASCII Art!!!
const ASCII_Art = (word) => {
        const _aa = (resolve, reject) => {
                figlet(word, {font: 'Big'}, (err, data) => {
                        if (err) return reject(err);
                        resolve(data);
                })
        }

        return new Promise(_aa);
}

// electron window global object
let win;

if (process.argv[2] === '--gui' || '__GUI__' in process.env) {
	const { execFile } = require('child_process');

        if (path.basename(process.argv[0]) === 'node') {
                execFile('./node_modules/.bin/electron', ['.'], {env: {'__GUI__': true, ...process.env}}, (error, stdout, stderr) => {
                        if (error) throw error;
                });
        } else if (path.basename(process.argv[0]) === 'electron') {
		// electron main.js 
		const {app, BrowserWindow, ipcMain} = require('electron');
		const url = require('url');
		const createWindow = () => {
		  // Create the browser window.
		  dlogs.init('masterpass').then((rc) => {
		    win = new BrowserWindow({minWidth: 1280, minHeight: 960, resizable: true, icon: path.join(__dirname, 'public', 'assets', 'icon', '11be_logo.png')});
		    win.setMenu(null);
		
		    // and load the index.html of the app.
		    win.loadURL(url.format({
		      pathname: path.join(__dirname, '/public/index.html'),
		      protocol: 'file:',
		      slashes: true
		    }))
		
		    global.dlogs  = dlogs;
		
		    // Open the DevTools.
		    win.webContents.openDevTools()
		
		    // Emitted when the window is closed.
		    win.on('closed', () => {
		      // Dereference the window object, usually you would store windows
		      // in an array if your app supports multi windows, this is the time
		      // when you should delete the corresponding element.
		      win = null
		    })
		  })
		}
	
		app.on('ready', createWindow)
	
		// Whole process reloader via ipcRenderer for config reload
		ipcMain.on('reload', (e, args) => {
		        app.relaunch();
		        app.exit();
		});
		
		// Quit when all windows are closed.
		app.on('window-all-closed', () => {
		  // On macOS it is common for applications and their menu bar
		  // to stay active until the user quits explicitly with Cmd + Q
		  if (process.platform !== 'darwin') {
		    app.quit()
		  }
		})
		
		app.on('activate', () => {
		  // On macOS it's common to re-create a window in the app when the
		  // dock icon is clicked and there are no other windows open.
		  if (win === null) {
		    createWindow()
		  }
		})
	}
} else if (process.argv[2] === '--cli') {
	// Handling promises in REPL (for node < 10.x)
	const replEvalPromise = (cmd,ctx,filename,cb) => {
	  let result=eval(cmd);
	  if (result instanceof Promise) {
	    return result.then(response=>cb(null,response));
	  }
	  return cb(null, result);
	}
	
	// REPL main function
	const terminal = (slogan = 'ElevenBuckets :  BladeIron') => {
	  return dlogs.init('masterpass')  // should use readline to get master pass here
	        .then((rc) => {
			 if (rc.result) return ASCII_Art(slogan)
		})
	        .then((art) => {
	          console.log(art + "\n");
	
	          let r = repl.start({ prompt: '[-= ElevenBuckets@Web3_Summit_2018 =-]$ ', eval: replEvalPromise });
	          r.context = {dlogs};
	
	          r.on('exit', () => {
	                  console.log("\n" + 'Stopping CLI...');
	                  process.exit(0);
	          })
	    })
	    .catch((err) => {
	        console.log(err);
	        process.exit(12);
	    })
	}
	
	// Main
	terminal('DLogs  by  ElevenBuckets');
}
