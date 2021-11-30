var editor = ace.edit("editor");
editor.setTheme("ace/theme/dawn");
editor.session.setMode("ace/mode/yaml");
editor.setFontSize(16)

saved_text = editor.getValue();

function doc_modified()
{
    return editor.getValue() != saved_text;
}

function doc_get_text()
{
    saved_text = editor.getValue();    
    return saved_text;    
}

function doc_set_text(text)
{    
    saved_text = text;
    editor.setValue(text);
    editor.session.getUndoManager().reset();
}


window.api.req_doc_modified(() => {
   window.api.rep_doc_modified(doc_modified());
});

window.api.req_doc_get_text(() => {
   window.api.rep_doc_get_text(doc_get_text());
});

window.api.req_doc_set_text((text) => {
   doc_set_text(text);
});

document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
  
    for (const f of event.dataTransfer.files) 
    {
       window.api.event_file_drop(f.path);
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });         
  
window.api.req_preview((filename) => {
    preview = document.getElementById('preview');
    preview.src = filename;
});
