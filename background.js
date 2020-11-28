
console.log('start program');

// Called when the user inputs commands
function onCommand(command) {
    console.log('onCommand');
    chrome.tabs.query({ url: 'https://open.spotify.com/*' }, function(tabs) {

        for (var tab of tabs) {
            if (tab.url.startsWith('https://open.spotify.com')) {
                
                if (command === 'skip') {
                    console.log('SKIP');
                    chrome.tabs.executeScript(tab.id, {code: 'document.querySelector(".spoticon-skip-forward-16").click()'});

                } else if (command === 'previous') {
                    console.log('PREVIOUS');
                    chrome.tabs.executeScript(tab.id, {code: 'document.querySelector(".spoticon-skip-back-16").click()'});

                } else if (command === 'play-pause') {
                    console.log('PLAY-PAUSE');
                    chrome.tabs.executeScript(tab.id, {code: '(document.querySelector(".spoticon-pause-16") || document.querySelector(".spoticon-play-16")).click()'});
               
                } else { //BLOCKS and SKIPS SONG
                    // does not block if the song is paused
                    if(!tab.title.startsWith('Spotify')) {
                        console.log('BLOCKS and SKIPS SONG: ' + tab.title);
                        chrome.tabs.executeScript(tab.id, {code: 'document.querySelector(".spoticon-skip-forward-16").click()'});
                        setBlockedSong(tab.title);
                    }
                    else {
                        console.log('Song is currently paused, cannot block.');
                    }
                }                
                break;
            }  
        }   
    });
};

// Adds songTitle to the list of blocked songs
function setBlockedSong(songTitle) {
    chrome.storage.sync.get('blockList', function(result) {

            var blockArray =  result.blockList;
            if (typeof blockArray === 'undefined') {
                chrome.storage.sync.set({'blockList': [songTitle,]}, function() {
                    console.log('blockList is ' + [songTitle,] + " (1) ")
                }); 

            } else {
                blockArray.push(songTitle);
                chrome.storage.sync.set({'blockList': blockArray}, function() {
                    console.log('blockList is ' + blockArray + " (" + blockArray.length  + ") ")
                }); 
            }
    });
};

function getBlockList() {
    chrome.storage.sync.get('blockList', function(result) {
        var blockArray = result.blockList;
        return blockArray;
    });
};

// skips songs that are blocked
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    
    if(tab.url.startsWith('https://open.spotify.com')) {
        chrome.storage.sync.get('blockList', function(result) {
            var blockArray = result.blockList;
            console.log(blockArray);
            if (typeof blockArray !== 'undefined' && blockArray.includes(tab.title)) {
                //skips song
                console.log('Previously Blocked Song is Skipped: ' + tab.title);
                chrome.tabs.executeScript(tab.id, {code: 'document.querySelector(".spoticon-skip-forward-16").click()'});
                console.log('song skipped');
                
            } else {
                console.log('Nothing');
            }
        });
    };
    console.log('Not Spotify');
    
});

// If commmand inputs are inputted by the user, onCommand is called
chrome.commands.onCommand.addListener(onCommand);