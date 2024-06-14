function getStoredRecords(username) {
    return JSON.parse(localStorage.getItem(username)) || [];
}

function storeRecords(username, records) {
    localStorage.setItem(username, JSON.stringify(records));
}

document.getElementById('wakeupButton').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter your name.');
        return;
    }
    let now = new Date();
    let records = getStoredRecords(username);
    records.push({type: 'Wakeup', time: now.toLocaleString()});
    storeRecords(username, records);
    alert('Wakeup time recorded for ' + username + ': ' + now.toLocaleString());
});

document.getElementById('bedtimeButton').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter your name.');
        return;
    }
    let now = new Date();
    let records = getStoredRecords(username);
    records.push({type: 'Bedtime', time: now.toLocaleString()});
    storeRecords(username, records);
    alert('Bedtime time recorded for ' + username + ': ' + now.toLocaleString());
});

document.getElementById('downloadPDF').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter your name.');
        return;
    }
    let records = getStoredRecords(username);
    if (records.length === 0) {
        alert('No records to download.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const uniqueId = Date.now();
    const qr = new QRious({
        value: `User: ${username}, ID: ${uniqueId}`,
        size: 100
    });

    doc.text(`Wakeup and Bedtime Records for ${username}`, 10, 10);
    doc.text(`ID: ${uniqueId}`, 10, 20);
    doc.addImage(qr.toDataURL(), 'PNG', 150, 10, 50, 50);

    let y = 40;
    records.forEach(record => {
        doc.text(`${record.type}: ${record.time}`, 10, y);
        y += 10;
    });

    doc.save(`${username}_wakeup_bedtime_records.pdf`);
});
