$(function(){
    $('.editor-css').each(function(){
        editFunc($(this), "ace/mode/css");
    });
    $('.editor-js').each(function(){
        editFunc($(this), "ace/mode/javascript");
    });
     $('.editor-html').each(function(){
        editFunc($(this), "ace/mode/html");
    });


    function editFunc(my, type){
        var myEditor = my[0];
        var editor = ace.edit(myEditor);
        editor.session.setMode(type);
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setUseWrapMode(true);
    }
});