const { app, BrowserWindow, ipcMain, Menu, dialog, shell } = require('electron')
const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  const exe_path = path.dirname(app.getPath("exe"));
  const project_page = "https://fynv.github.io/ScoreDraft/"
 
  
  var current_filename = "";
  var demo_auto_build = false;
  
  const update_preview = () => {
    if (current_filename=="")
    {
        win.webContents.send("preview", project_page);        
    }
    else
    {    
        var parse_path = path.parse(current_filename);
        var noext = path.format({ root: parse_path['root'], dir: parse_path['dir'], name: parse_path['name']});        
        if (demo_auto_build)
        {                        
            win.webContents.send("preview", noext + '.html');
        }
        else
        {
            win.webContents.send("preview", noext + '.pdf');
        }
    }
  }
  
  const update_title = () => {
      if (current_filename == "")
      {
          win.setTitle("ScoreDraft - Untitled");
      }
      else
      {
          var name = path.parse(current_filename).name;
          win.setTitle("ScoreDraft - "+name);          
      }         
  } 
  
  
  const _doc_save = (filename) => {
    win.webContents.send("get_text");
    ipcMain.once("get_text", 
    async (event, text) => 
    {
        await fs.writeFile(filename, text, (err) => 
            {
                if (err)
                {
                    console.log(err);
                    return;
                }               
            }       
        );
        if(demo_auto_build)
        {
            var child = exec('scoredraft_build_demo '+current_filename, { 'cwd': exe_path});
            await new Promise( (resolve) => 
                {
                    child.on('close', resolve)
                }
            )
        }
        else
        {                
            var child = exec('scoredraft_build_pdf '+current_filename, { 'cwd': exe_path});
            await new Promise( (resolve) => 
                {
                    child.on('close', resolve)
                }
            )
        }
        update_preview();
       
    });      
  }
  
  const _doc_open = async (filename) => {
        await fs.readFile(filename, 'utf8', (err, data) => 
            {
              if (err)
              {
                  console.log(err);
                  return;
              }
              win.webContents.send("set_text", data);   
            }
        )
  }
  
  const doc_save_as = async () => {
        var res = await dialog.showSaveDialog({filters: [{ name: 'YAML file', extensions: ['yaml'] }]});        
        if (!res.canceled)
        {
            current_filename = res.filePath;
            _doc_save(current_filename);
            update_title();
            return true;
        }
        else
        {
            return false;
        }     
  }
  
  const doc_save = async() => {
      if (current_filename !="")
      {
          _doc_save(current_filename);
          return true;
      }
      else
      {
          return await doc_save_as();
      }      
      
  }
  
  const doc_close = (next = undefined) => {
     win.webContents.send("modified");
     ipcMain.once("modified", 
        async (event, ret) => 
        {        
            var closed = false;    
            if (ret)
            {
                const options = {
                    type: 'question',
                    buttons: ['Cancel', 'Yes', 'No'],
                    defaultId: 2,
                    title: 'Question',
                    message: 'File has been modified. Save it?',                
                  };
                  
                  var response = (await dialog.showMessageBox(null, options)).response;
                
                    if (response == 1)
                    {
                        closed = await doc_save();
                    }
                    else if (response == 2)
                    {
                        closed = true;
                    }                
            }
            else
            {
                closed = true;
            }
            
            if (closed && next != undefined)
            {
                next();
            }            
        }
    );      
  }
  
  const doc_new = () => {
      doc_close( () =>
          {
              win.webContents.send("set_text", "");
              current_filename = "";
              update_title();
              update_preview();
          }
      );
  }
  
  const doc_open = () => {
      doc_close( async () =>
          {
            var result = await dialog.showOpenDialog({properties: ['openFile'], filters: [{ name: 'YAML file', extensions: ['yaml'] }]});                           
            if (!result.canceled)
            {
                await _doc_open(result.filePaths[0]);
                current_filename = result.filePaths[0];                        
                update_title(); 
                update_preview();    
            }               
          }
      );
  }
  
  
  const template = [
      {
        label: '&File',
        submenu:[
            { 
                label: '&New',
                click: () => {                    
                     doc_new();                                
                },     
                accelerator: 'CommandOrControl+N'           
            },
            { 
                label: '&Open',
                click: () => {
                    doc_open();
                },     
                accelerator: 'CommandOrControl+O'
            },
            { 
                label: '&Save',
                click: () => {                          
                    doc_save();                     
                },     
                accelerator: 'CommandOrControl+S'
            },
            { 
                label: 'Save as',
                click: () => {
                    doc_save_as();
                },                     
            },
            { type: 'separator' },
            { role: 'quit'}
        ] 
      },
      {
        label: '&Edit',
        submenu:[
            { role: 'undo'},
            { role: 'redo'},
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
                label: 'Toggle comment',
                click: () => {
                     win.webContents.executeJavaScript('editor.execCommand("togglecomment");');
                },
                accelerator: 'CommandOrControl+/'
            },
            {
                label: 'Change to Upper Case',
                click: () => {
                     win.webContents.executeJavaScript('editor.execCommand("touppercase");');
                },
                accelerator: 'CommandOrControl+U'
            },
            {
                label: 'Change to Lower Case',
                click: () => {
                     win.webContents.executeJavaScript('editor.execCommand("tolowercase");');
                },
                accelerator: 'CommandOrControl+Shift+U'
            }
        ]
      },
      {
          label: '&Search',
          submenu:[
            {
                label: '&Find',
                click: () => {
                     win.webContents.executeJavaScript('editor.execCommand("find");');
                },
                accelerator: 'CommandOrControl+F'
            },
            {
                label: 'Find &Next',
                click: () => {
                     win.webContents.executeJavaScript('editor.execCommand("findnext");');
                },
                accelerator: 'CommandOrControl+K'
            },
            {
                label: 'Find &Previous',
                click: () => {
                     win.webContents.executeJavaScript('editor.execCommand("findprevious");');
                },
                accelerator: 'CommandOrControl+Shift+K'
            },
            {
                label: '&Replace',
                click: () => {
                     win.webContents.executeJavaScript('editor.execCommand("replace");');
                },
                accelerator: 'CommandOrControl+H'
            },
            {
                label: 'Go to &Line',
                click: () => {
                     win.webContents.executeJavaScript('editor.execCommand("gotoline");');
                },
                accelerator: 'CommandOrControl+L'
            }
          ]
      },     
      {
          label: '&Demo Page',
          submenu :[
            {
                label: '&Build',
                click: async () => { 
                    // save file
                    if (current_filename !="")
                    {
                        win.webContents.send("get_text");
                        ipcMain.once("get_text", 
                        async (event, text) => 
                        {
                            await fs.writeFile(current_filename, text, (err) => 
                                {
                                    if (err)
                                    {
                                        console.log(err);
                                        return;
                                    }               
                                }       
                            );
                            var child = exec('python build_demo.py '+current_filename, { 'cwd': exe_path});
                            await new Promise( (resolve) => 
                                {
                                    child.on('close', resolve)
                                }
                            )
                            var parse_path = path.parse(current_filename);
                            var noext = path.format({ root: parse_path['root'], dir: parse_path['dir'], name: parse_path['name']});
                            shell.openExternal(noext + '.html');
                            update_preview();                            
                        }); 
                    }
                    else
                    {
                        var res = await dialog.showSaveDialog({filters: [{ name: 'YAML file', extensions: ['yaml'] }]});       
                        if (!res.canceled)
                        {
                            current_filename = res.filePath;
                            win.webContents.send("get_text");
                            ipcMain.once("get_text", 
                            async (event, text) => 
                            {
                                await fs.writeFile(current_filename, text, (err) => 
                                    {
                                        if (err)
                                        {
                                            console.log(err);
                                            return;
                                        }               
                                    }       
                                );
                                var child = exec('python build_demo.py '+current_filename, { 'cwd': exe_path});
                                await new Promise( (resolve) => 
                                    {
                                        child.on('close', resolve)
                                    }
                                )
                                var parse_path = path.parse(current_filename);
                                var noext = path.format({ root: parse_path['root'], dir: parse_path['dir'], name: parse_path['name']});
                                shell.openExternal(noext + '.html');
                                update_title();                                
                            });                             
                        }                                      
                    }
                },
                accelerator: 'F5'
            },
            {
                type: 'checkbox',
                label: '&Auto Build',
                click: (item) => {                    
                    demo_auto_build = item.checked;
                    update_preview();                    
                },
                
            }
         ]
      },
      {
        role: 'help',
        submenu:[
            {
                label: '&System Information',
                click: async () => 
                {
                    var child = exec('scoredraft_sys_detect', { 'cwd': exe_path});
                    await new Promise( (resolve) => 
                        {
                            child.on('close', resolve)
                        }
                    )                    
                    shell.openExternal(exe_path + "/sys_detect.html");
                }
            },
            {
                label: '&Learn More',
                click: () => 
                {                 
                  shell.openExternal(project_page);
                }
            },
            
        ]
      }
      
  ]
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu);  
  
  ipcMain.on("file_drop", 
    (event, filename) => 
    {
        doc_close( async () =>
        {
            await _doc_open(filename);
            current_filename = filename;
            update_title();    
        });        
    });      

  win.loadFile('index.html')
  // win.webContents.openDevTools()

}

app.whenReady().then(() => {
  createWindow()
  
   app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
