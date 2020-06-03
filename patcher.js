const fs = require('fs')
var randomHexColor = require('random-hex-color')
const removeItems = require('remove-array-items')



let patch = JSON.parse(fs.readFileSync('../gitshow2/patch.vcv'))
let modules = patch.modules
let cables = patch.cables

//TODO 
// ? can you set the output device of all instances of CoreAudio Output to blackhole, 
// ? so that each time a patch is launched the audio gets piped into, say, Max, once signal 
// ? is tripped once, it starts recording. If signal isn't tripped within 10 seconds, lets 
// ? then say its a patch that the bot can't play, and the bot goes back and tries another 
// ? patch variation from the patch.vcv file. 

// !
// TODO randomly remove modules from a patch. 
// TODO test to see if it throws no errors and just removes the patch cables
// TODO if throws error, then use the removeCables() function afterward.  
function removeModules(){
    // let index = Math.floor(Math.random * cables.length / 2)
    // let remove = Math.floor(Math.random * cables.length / 4)
    // let index = Math.floor(Math.random * cables.length)
    // removeItems(cables, index, Math.random(cables.length))
    
    for(var i = modules.length-1;i>=0;i--){
        cables.splice(Math.floor(Math.random()*modules.length * (Math.random() + 1)), 1);
        console.log(modules.length)
    }
    patch.modules = modules
    console.log(patch.modules, modules.length);
    fs.writeFileSync('../gitshow2/patch2.vcv', JSON.stringify(patch, null, 2))
    // for (i = 0; i < modules.length; i++){
    //     console.log(modules[i].plugin, cables, cables.length)
}
removeModules()

function removeCables(){
    let index = Math.floor(Math.random * cables.length / 2)
    // let remove = Math.floor(Math.random * cables.length / 4)
    // let index = Math.floor(Math.random * cables.length)
    // removeItems(cables, index, Math.random(cables.length))

    for(var i = cables.length-1;i>=0;i--){
        cables.splice(Math.floor(Math.random()*cables.length * (Math.random() + 1)), 1);
        
    }
    patch.cables = cables
    console.log(patch, cables.length);
    fs.writeFileSync('../gitshow2/patch2.vcv', JSON.stringify(patch, null, 2))
    // for (i = 0; i < modules.length; i++){
    //     console.log(modules[i].plugin, cables, cables.length)
}
    

// }
// console.log(modules, randomHexColor())


// get module names, delete some of the cables, save as patch2 and compare
