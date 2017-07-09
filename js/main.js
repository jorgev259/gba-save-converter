var sav = undefined;
var bin = undefined;
var b1 = undefined;
var b2 = undefined;
var classicInput = false;
var names = {}

$(document).ready(function(){
    $("#p2").hide();
    $("#p3").hide();
    $("#next").hide();
    $("#sav").hide();
    $("#bin").hide();

    var dropZone = document.getElementById('filesBox');
  dropZone.addEventListener('dragover', handleDragOver, false);
    document.getElementById('file').addEventListener('change', normalFile, false);
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', fileAdd, false);
})


function change(actual, go){
    $("#p"+actual).hide();
    $("#p"+go).show();
}

function normalFile(){
    classicInput = true;
    readFiles(this.files);
}

function fileAdd(evt){
    if($("#filemsg").is(":visible") && !classicInput){
        $("#filemsg").hide();
        $("#file2").hide();

        $("#sav").show();
        $("#bin").show();
    }

    evt.stopPropagation();
    evt.preventDefault();

    readFiles(evt.dataTransfer.files);
}

function readFiles(files){
    for (var i = 0;i<files.length; i++) {
        var f= files[i];
        var reader = new FileReader();

        if(f.name.endsWith(".bin")){
            $("#bin").hide();
        }else if(f.name.endsWith(".sav")){
            $("#sav").hide();
        }else{
            return;
        }

      // Closure to capture the file information.
     reader.onload = function(data){
         storeData(data);
     };

      // Read in the image file as a data URL.
      reader.readAsArrayBuffer(f);
    }
}

function storeData(data){
     var u = new Uint8Array(data.target.result),
        a = new Array(u.length),
        i = u.length;
    while (i--) // map to hex
        a[i] = (u[i] < 16 ? '0' : '') + u[i].toString(16);
    u = null; // free memory

    if(b1 == undefined){
        b1 = a;
    }else if(b1 !== a){
        b2 = a
    }

    if(b1 !== undefined && b2 !== undefined){
        $("#next").show();
    }
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

function execute(option){
    if(b1>b2){
        bin = b1;
        sav = b2;
    }else{
        bin = b2;
        sav = b1;
    }

    //free memory
    b1 = null;
    b2 = null;

    var i = 0;
    switch(option){
        case 1:
            for (i = 0; i < sav.Length; i++){
                sav[i] = bin[(hextoint("4080") + i)];
            }
            out = sav;
            name = "converted_save.sav";
            break;

        case 2:
            for (i = 0; i < sav.Length; i++){
                bin[(hextoint("4080") + i)] = sav[i];
            }

            out = bin;
            name = "data_008_0000.bin";
            break;
    }

    bin = null;
    sav = null;

    saveAs(new Blob([out]), name);
}

function hextoint(hex){
    return parseInt(hex, 16);
}
