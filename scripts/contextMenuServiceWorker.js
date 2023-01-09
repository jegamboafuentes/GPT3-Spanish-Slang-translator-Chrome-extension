const getKey = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['openai-key'], (result) => {
            if (result['openai-key']) {
                const decodedKey = atob(result['openai-key']);
                resolve(decodedKey);
            }
        });
    });
};


const sendMessage = (content) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0].id;

        chrome.tabs.sendMessage(
            activeTab,
            { message: 'inject', content },
            (response) => {
                if (response.status === 'failed') {
                    console.log('injection failed.');
                }
            }
        );
    });
};

const generate = async (prompt) => {
    // Get your API key from storage
    const key = await getKey();
    const url = 'https://api.openai.com/v1/completions';

    // Call completions endpoint
    const completionResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 255,
            temperature: 0.7,
        }),
    });

    // Select the top choice and send back
    const completion = await completionResponse.json();
    return completion.choices.pop();
}

/////

var mySelectFrom = ""
//var mySelectTo = ""

function getExtensionParameters()  {
    chrome.storage.local.get(['settingFrom'], (results) => {
        console.log("AQUI WE!!");
        console.log(results.settingFrom);
        //mySelectFrom = results.settingFrom;
        mySelectFrom =  results.settingFrom;
    });
}

getExtensionParameters();

// const getExtensionParameters = () => {
//     return new Promise((resolve, reject) => {
//         chrome.storage.local.get(['settingFrom'], (result) => {
//             if (result['settingFrom']) {
//                 //const decodedKey = atob(result['openai-key']);
//                 const returnded = result['openai-key']
//                 resolve(returnded);
//             }
//         });
//     });
// };


//getExtensionParameters();
//console.log(mySelectFrom);

// old
// const getParameters = () => {
//     return new Promise((resolve, reject) => {
//         chrome.storage.local.get(['myCountryFrom'], (result) => {
//             console.log("getParameters function")
//             console.log(result['myCountryFrom'])
//             // if (result['myCountryFrom']) {
//             //     resolve(result['myCountryFrom']);
//             // }
//         });
//     });
// };
/////

const generateCompletionAction = async (info) => {
    await getExtensionParameters();
    try {
        sendMessage('generating...');
        console.log('the var:');
        console.log(mySelectFrom);
        const { selectionText } = info;
        const basePromptPrefix = `
        Translate this phrase from ` + 'Mexico' + ` Spanish (Slang) to ` + mySelectFrom + ` Spanish (Slang), making the phrase very neutral and understandable.
        Phrase in Mexican Spanish:`;
        const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`);

        sendMessage(baseCompletion.text);

        // Let's see what we get!
        console.log(baseCompletion.text)
    } catch (error) {
        console.log(error);
    }
};

// Add this in scripts/contextMenuServiceWorker.js
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'context-run',
        title: 'Spanish Slang Translator',
        contexts: ['selection'],
    });
});

chrome.contextMenus.onClicked.addListener(generateCompletionAction);
