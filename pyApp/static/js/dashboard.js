const expandedItems = new Set();

function startStimulus(){
    fetch('/startStimulus', {method: "POST"})
        .then(res => res.json())
        .then(data => alert("Test Started!"));
}

function sendCommand(cmd){
    // Placeholder for your other buttons if you want to add them later
    alert(`Command sent: ${cmd}`);
}

function toggleDetails(id) {
    const el = document.getElementById(id);
    const isVisible = el.style.display === 'block';

    el.style.display = isVisible ? 'none' : 'block';

    if (isVisible) {
        expandedItems.delete(id);
    } else {
        expandedItems.add(id);
    }
}

function fetchResults() {
    fetch('/results')
        .then(res => res.json())
        .then(results => {
            const container = document.getElementById('resultsList');
            container.innerHTML = '';

            results.forEach((item, i) => {
                const detailId = `detail-${i}`;
                const isExpanded = expandedItems.has(detailId);

                const li = document.createElement('li');
                li.style.marginBottom = "10px";
                li.innerHTML = `
                    <div style="cursor: pointer; font-weight: bold;" onclick="toggleDetails('${detailId}')">
                        ${item.timestamp_human || item.timestamp} — Stimulus Test
                    </div>
                    <div id="${detailId}" style="display: ${isExpanded ? 'block' : 'none'}; padding-left: 10px;">
                        <pre>${JSON.stringify(item, null, 2)}</pre>
                    </div>
                `;
                container.appendChild(li);
            });
        });
}

setInterval(fetchResults, 3000);