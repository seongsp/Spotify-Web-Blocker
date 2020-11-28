
chrome.storage.sync.get('blockList', function(result) {
    var blockArray = result.blockList;
    var blockString = '<table>';
    if(blockArray != undefined) {
        for (let index = 0; index < blockArray.length; index++) {
            blockString += '<tr class="tablerow">' + 
                '<td><button class="delBut" id="' + blockArray[index] + '">X</button><td>' +
                '<td class="songtitle">' + blockArray[index] + '</td></tr>';    
        };
            
        blockString += '</table>';
        document.getElementById("blockList").innerHTML = blockString;
    }
});

function clearBlockedList() {
    chrome.storage.sync.clear( function(){
        console.log("CLEARED");
    });
};

function deleteSong(songTitle) {
    chrome.storage.sync.get('blockList', function(result) {
        var blockArray = result.blockList;
        const index = blockArray.indexOf(songTitle);
        if(index >= 0) {
            blockArray.splice(index, 1);
        }
        chrome.storage.sync.set({'blockList': blockArray}, function() {
            console.log('removed ' + songTitle);
        });
    });
};

// deletes the nearby table row
$(document).ready(function() {
    $("button").click(function(){
        $(this).closest("tr").remove();
        deleteSong(this.id);
    });
});