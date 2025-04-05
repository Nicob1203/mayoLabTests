import React from 'react';
import ReactDOM from 'react-dom/client';
import Trial from './Trial';

function handleResult(data) {
    console.log("Result received:", data);

    fetch('http://10.0.2.2:5000/submit_result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        console.log("Flask Response:", response);
        alert("Result sent back to controller");
    });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Trial width={800} height={600} onFinalized={handleResult} />);