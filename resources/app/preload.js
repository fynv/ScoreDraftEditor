const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld(
    "api", {   
        req_doc_modified: (func) => 
        {          
            ipcRenderer.on("modified", (event) => func());
        },
        
        rep_doc_modified: (ret) => 
        {            
            ipcRenderer.send("modified", ret);
        },
        
        req_doc_get_text: (func) => 
        {     
            ipcRenderer.on("get_text", (event) => func());
        },
        
        rep_doc_get_text: (text) => 
        {            
            ipcRenderer.send("get_text", text);
        },  
        
        req_doc_set_text: (func) => 
        {            
            ipcRenderer.on("set_text", (event, text) => func(text));
        },
        
        event_file_drop: (filename) => 
        {            
            ipcRenderer.send("file_drop", filename);
        },
        
        req_preview: (func) =>
        {
            ipcRenderer.on("preview", (event, filename) => func(filename));
        }
    }
);

