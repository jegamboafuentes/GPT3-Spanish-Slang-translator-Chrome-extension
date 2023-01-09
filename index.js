const checkForKey = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['openai-key'], (result) => {
            resolve(result['openai-key']);
        });
    });
};

//// Extension Parameters
// Select From Country
var selectFrom = document.querySelector(".selectFrom");
//var selectFromOption = selectFrom.options[selectFrom.selectedIndex];
var lastSelectedFrom = localStorage.getItem('selectFrom');
//countrySelectFromText = selectFrom.options[selectFrom.selectedIndex].text;

if (lastSelectedFrom) {
    selectFrom.value = lastSelectedFrom;
}

selectFrom.onchange = function () {
    lastSelectedFrom = selectFrom.options[selectFrom.selectedIndex].value;
    lastSelectedFromText = selectFrom.options[selectFrom.selectedIndex].text;
    localStorage.setItem('selectFrom', lastSelectedFrom);
    chrome.storage.local.set({ 'settingFrom': lastSelectedFromText }, () => {
    });
}

//End good //clean from here

//countrySelectFrom = document.getElementById('countryFrom');
//countrySelectFromText = countrySelectFrom.options[countrySelectFrom.selectedIndex].text;


// saveParametersButton = document.getElementById('parametersButton');


// saveParametersButton.addEventListener('click', () => {
//     chrome.storage.local.set({ 'settingFrom': countrySelectFromText }, () => {
//         console.log('data had been stored');
//         getExtensionParameters();
//     });
// });

// //
// const getExtensionParameters = () => {
//     const countrySelectFrom = document.getElementById('countryFrom');
//     chrome.storage.sync.set({ "myCountryFrom": countrySelectFrom }, function () {
//     });
// };

////

const saveKey = () => {
    const input = document.getElementById('key_input');

    if (input) {
        const { value } = input;

        // Encode String
        const encodedValue = encode(value);

        // Save to google storage
        chrome.storage.local.set({ 'openai-key': encodedValue }, () => {
            document.getElementById('key_needed').style.display = 'none';
            document.getElementById('key_entered').style.display = 'block';
        });
    }
};

const encode = (input) => {
    return btoa(input);
};

const changeKey = () => {
    document.getElementById('key_needed').style.display = 'block';
    document.getElementById('key_entered').style.display = 'none';
};

document.getElementById('save_key_button').addEventListener('click', saveKey);
document
    .getElementById('change_key_button')
    .addEventListener('click', changeKey);

checkForKey().then((response) => {
    if (response) {
        document.getElementById('key_needed').style.display = 'none';
        document.getElementById('key_entered').style.display = 'block';
    }
});

//document.getElementById('parametersButton').addEventListener('click', getExtensionParameters);

