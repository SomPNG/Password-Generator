const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');
const passwordDisplay =document.querySelector('[data-passwordDisplay]');

const copyBtn= document.querySelector("[data-copy]");
const copyMsg= document.querySelector("[data-copyMsg]");

const uppercaseCheck= document.querySelector("#Uppercase");
const lowercaseCheck= document.querySelector("#Lowercase");
const numbersCheck= document.querySelector("#Numbers");
const symbolsCheck= document.querySelector("#Symbols");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()-_=+[{]}\|;:",<.>/?';

let password= "";
let passwordLength= 10;
let checkCount = 1;

handleSlider();
setIndicator("#fff");


// set length of password
function handleSlider(){
    inputSlider.value= passwordLength;
    lengthDisplay.innerHTML=passwordLength;
    const min= inputSlider.min;
    const max= inputSlider.max;
    inputSlider.style.backgroundSize= (passwordLength-min)*100/(max - min) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


function getRndInteger(min, max){
    return Math.floor(Math.random() * (max-min) + min);
}

function generateInteger(){
    return getRndInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols(){
    return symbols[getRndInteger(0,29)];
}

function calcStrength(){
    let hasUpper= false;
    let hasLower= false;
    let hasNum= false;
    let hasSym= false;

    if(uppercaseCheck.checked) hasUpper= true;
    if(lowercaseCheck.checked) hasLower= true;
    if(numbersCheck.checked) hasNum =true;
    if(symbolsCheck.checked) hasSym= true;

    if(hasUpper &&  hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText= "Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    // To make copy wala span visible
    copyMsg.classList.add("active");
    
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// Event Listeners

// Password Length change with slider
inputSlider.addEventListener("input",(e)=>{
    passwordLength=inputSlider.value;
    handleSlider();
});

// Copy Button
copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

// CheckBoxes listeners
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    // special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}


allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);  
});


function shufflePassword(array){
    // Fisher Yates Method -for shuffling
    for(let i= array.length-1;i>0;i--){
        const j= Math.floor(Math.random() * (i+1));
        const temp= array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str="";
    array.forEach((el) => (str+=el));
    return str;

}

generateBtn.addEventListener('click',()=>{
    // None of the the checkbox ticked
    if(checkCount<=0) return;


    if(passwordLength< checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // Let's start the journey to find new password

    // removing old password
    password="";

    // let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password+=generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowercase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateInteger();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbols();
    // }


    // new trick

    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateInteger);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }

    // compulsory addition
    for(let i=0; i<funcArr.length;i++){
        password+= funcArr[i]();
    }

    // remaining addition
    for(let j=0;j<passwordLength-funcArr.length;j++){
        let rndIndex= getRndInteger(0,funcArr.length-1);
        password+=funcArr[rndIndex]();
    }

    // shuffling the password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value= password;

    // calculate strength
    calcStrength();
});
