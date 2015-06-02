$(function(){
    $('.editor-css').each(function(){
        var myEditor = $(this)[0];
        var editor = ace.edit(myEditor);
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/css");
        editor.getSession().setUseWrapMode(true);
    });
    $('.editor-js').each(function(){
        var myEditor = $(this)[0];
        var editor = ace.edit(myEditor);
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");
        editor.getSession().setUseWrapMode(true);
    });
     $('.editor-html').each(function(){
        var myEditor = $(this)[0];
        var editor = ace.edit(myEditor);
        editor.session.setMode("ace/mode/html");
        editor.setTheme("ace/theme/monokai");
        // editor.getSession().setUseWrapMode(true);
        // 
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: false
        });
    });
    
});