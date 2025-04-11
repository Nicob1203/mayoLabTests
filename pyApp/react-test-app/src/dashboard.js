function startStimulus(){
    fetch('/startStimulus', {method: "POST"}).then(res=>res.json()).then(data=>alert("Test Started!"));
}