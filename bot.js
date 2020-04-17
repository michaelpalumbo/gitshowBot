// for experimenting with the git repo /gitshowBot

const fs = require('fs')
const compose = require('word-vomit')
const {exec} = require('child_process')
const git = require('simple-git/promise')

let workingDir = '../gitshow1'
// should pick a hash from the history. create a branch, and then do the following:

// analyze the recording write in the reflections.md
// At first I got hung up on needing the bot to by musically intelligent. then reading David Cope's book "Computer Models of Musical Creativity", considered that the rules of git show don't really require much (if at all) music knowledge. instead, you just have to understand and follow the rules in the README.md. Which means that the bot only needs some way of following the rules. For the moment, i'm having it analyze a spectrogram of the recording.wav 

// analyse the score, add more to the reflections
// async function log() {  
//     let statusSummary = null;
//     try {
//        show = await git(workingDir).show(['HEAD:score.md']);
//        let lines = show.split('\n')
//     //    counter++
//     //    console.log(compose(statusSummary, 0.5))
//     // console.log(show.split('\n'))
//     //    getLogs()
//     }
//     catch (e) {
//        // handle the error
//        console.log(e)
//     }
    
//     return statusSummary;
//   }
// log()

// take some content from the reflections to modify the score. 
// let variation = 0.5 // note the variation can be from 0. - 1. 
// console.log(compose(inputText, variation))
// // for this use the 

// make changes to the patch
// record the patch

// ? possible question: are the instructions (that I provided in the README.md for git show) 
// ? sufficient pseudocode for a computer agent?

// ? when should the agent commit changes?

const repos = ['gitshow1', 'gitshow2', 'gitshow3', 'gitshow8', 'gitshow9', 'gitshow10', 'gitshow11', 'gitshow12', 'gitshow13' ]
const bots = [{showbot1: 'showbot1@email.com'}, {showbot2: 'showbot2@email.com'}, {showbot3: 'showbot3@email.com'}, {showbot4: 'showbot4@email.com'}]
// const numRepos = gitshowRepos.length

// // // // // GIT SHOW README.md AS PSEUDOCODE \\ \\ \\ \\ \\ 

// 1. Clone the repository you've been assigned and open it on your computer
// * bot takes a repository number, switches that to workingDirectory
let repoDir;
function stepOne(){
    let repoNum = repos[Math.floor(Math.random() * 9)];
    // let repoDir = '../' + repoNum + '/'
    repoDir = '../gitshow1/'
    console.log('working on ' + repoDir)
    stepTwo()
}
stepOne()

// 2. open *reflections.md* in a markdown editor, erase all of the content, and save the file. Leave this document open. 

function stepTwo(){
    fs.truncate(repoDir + 'reflections.md', 0, function(){
        stepThree("HEAD:score.md")
    })
}


// 3. open *score.md*, and read it at least once. 
// * here the bot reads the score, and stores each line in a variable.
let show;
let lines; 
async function stepThree(target) { 
   
    try {
        show = await git(repoDir).show([target]);
        lines = show.split('\n')
        stepFour()
    }
    catch (e) {console.log(e)} 
    return show;
  }



// 4. listen to recording.wav several times and follow along with *score.md*
// * for now the bot just reports some MIR data about the file
// TODO also add a spectrogram
// TODO then modify the spectrogram with some kind of graphics manipulation lib, and use that in the score. 

let averages = {
    zcr: null,
    mfcc: null,
    fft: null,
    centroid: null,
    centroidViaRolloff: null,
    rolloffPoint: null,
    remarkableEnergyRate: null
}

function stepFour(){
    const arrayMeans = require("array-means");




    let MIRConfig = {
        fftSize: 32,
        bankCount: 24,
        lowFrequency: 1,
        highFrequency: 22500, // samplerate/2 here
        sampleRate: 44100
    };

    console.log('analyzing ' + repoDir + 'recording.wav')
    
    exec('sox --i ' + repoDir + 'recording.wav', (stdout, stderr, err)=>{
        MIRConfig.sampleRate = stderr.split('\n')[3].split(': ')[1]
        MIRConfig.highFrequency = MIRConfig.sampleRate / 2
        let precision = stderr.split('\n')[4].split(': ')[1]
        console.log('sample rate: ' + MIRConfig.sampleRate + '\nprecision: ' + precision)
        // get the mir data from file next
        console.log('starting MIR, please wait')
        const {getParamsFromFile} = require('sound-parameters-extractor');

        getParamsFromFile(repoDir + 'recording.wav', MIRConfig, 16)
        .then(params => {

            averages.zcr = arrayMeans.a(params.zcr);
            averages.mfcc = arrayMeans.a(params.mfcc);
            averages.fft = arrayMeans.a(params.fft)
            averages.centroid = arrayMeans.a(params.sc)
            averages.centroidViaRolloff = arrayMeans.a(params.sc2)
            averages.rolloffPoint = arrayMeans.a(params.srf)
            averages.remarkableEnergyRate = arrayMeans.a(params.rer)

            console.log('finished MIR')
            stepSeven()
        // arrayToRaw(params.spectralCentroid, repoDir + 'recording.raw');
        });
    })
}

// 5. in score.md, copy (NOT CUT) the entire markdown code (not the rendered preview) of the document and paste it into the newly blank *reflections.md*. 
// * skip to step seven for bot

// 6. Close *score.md*.  
// * skip to step seven for bot

// 7. In *reflections.md*, using markdown formatting, place the entire score in blockquotes by inserting the > symbol at the start of each line of the score, including line breaks. (in MacDown you can select entire text and type Shift-CMD-B). This will add a threadline in the rendered document i.e. a score with the > added to each line becomes:
function stepSeven(show){
    for (i = 0; i < lines.length; i++){
        fs.appendFileSync(repoDir + 'reflections.md', '> ' + lines[i] + '\n')
    }
    console.log('placing score into reflections.md, saving...')
    stepEight()
}

// 8. Save *reflections.md*, and make a commit
// * combining steps 8 and 9 for sake of code order of operations
// function stepEight(){
//     // add the object 'averages' to the reflections doc, save, and commit. 
//     fs.appendFileSync(repoDir + 'reflections.md', "\n\n\`\`\`javascript\n" + JSON.stringify(averages, null, 2) + "\`\`\`\n")
//     console.log('added MIR to reflections.md')
//     git(repoDir).commit('contributed MIR averages', ['reflections.md'])    
//     console.log('committed reflections.md')
// }

async function stepEight() { 
   
    try {
        fs.appendFileSync(repoDir + 'reflections.md', "\n\n\`\`\`javascript\n" + JSON.stringify(averages, null, 2) + "\`\`\`\n")

        // })
    }
    catch (e) {console.log(e)} 
    console.log('added MIR to reflections.md')
    git(repoDir).commit('contributed MIR averages', ['reflections.md'])    
    console.log('committed reflections.md')
    // return show;
  }

// 9. With the score now in blockquotes, continue to listen to the recording, but now insert your own reflections on the score and recording, making specific notes below areas of interest, and also noting the time(s) in the recording.
// * see step 8
// 10. Save and commit your changes **very often**, be generously descriptive in your commit messages!
// * noted for bot
// 11. continue to listen to the score and make notes. Some suggestions for what you could focus on: 
// 	- general reactions to the piece
// 	- reactions to the score and recording
// 	- how close is the recorded performance to what was written in the composition?
// 	- what sound elements are particularly of interest, what time(s) do they occur, experiment with describing them
//! 	- some scores may be entirely technical in the writing (like an instruction manual), while at another extreme others are representations of the recordings, others still more abstract. Does the approach appeal to you? Is it effective? You can respond to this directly. 
// 	- remember to save and commit your changes **very often**, be generously descriptive in your commit messages!

// 12. Reopen the *score.md*, and then open the file *patch.vcv* in VCV Rack, and experiment with performing the score several times. Add notes about this process in the *reflections.md* document, remembering to save & commit your changes. 

// 13. Begin to compose a new version of the score in *score.md* and make a newer version of *patch.vcv*:
// 	- you can include as much or as little of the previous version of the score as you like. 
// 	- drawing from your own notes, add, duplicate, remove, or refine compositional elements
// 	- consider that markdown files can embed images and other content, so a score doesn't have to be limited to text... 
// 	- see the file markdown_examples.md for all that can be achieved in markdown!
// 	- Add new patch cables, add/remove modules, etc. 
// 	- remember to save and commit your changes **very often**, be generously descriptive in your commit messages!

// 14. Practice performing the score (maximum length is 90 seconds!). 

// 15. To record yourself, locate the record module in the patch (or add one if it isn't there). Right-click it, and ensure the following settings:
// 	- under 'Output File':
// 		- Click the /path/to/the/recording.wav (might be 'Select...'), and ensure that this path is pointing to **the 'recording.wav' in this week's repository, not the one from last week** i.e. the same folder that this readme.md is located in... 
// 		-  ensure that 'Append -001, -002, etc.' is **not enabled** (i.e. no checkmark)
// 	- under 'audio formats':
// 		- .wav is selected
	
// 16. Each time you record using this module, it will overwrite the previous recording.wav, so remember to commit each version of recording.wav.

// 17. When the score, recording, and patch are completed, save and commit any last changes, and update the remote github repo:

// 	```shell
// 	git commit -am "type a message about this commit..."
	
// 	git pull
	
// 	git push
//     ```> 
    