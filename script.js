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

    // 一意のIDを生成
    const uniqueId = Date.now();

    // QRコードのデータを生成
    const qrData = `User: ${username}, ID: ${uniqueId}`;
    console.log(qrData);  // QRコードの内容をコンソールに出力

    // QRコードを生成
    const qr = new QRious({
        value: qrData,
        size: 100
    });

    // QRコードのデータURLを取得して検証
    const qrDataURL = qr.toDataURL();
    console.log(qrDataURL); // データURLをコンソールに出力

    // PDFにユーザー情報とQRコードを追加
    doc.text(`Wakeup and Bedtime Records for ${username}`, 10, 10);
    doc.text(`ID: ${uniqueId}`, 10, 20);
    doc.addImage(qrDataURL, 'PNG', 10, 30, 50, 50);

    // 記録をPDFに追加
    let y = 90;
    records.forEach(record => {
        doc.text(`${record.type}: ${record.time}`, 10, y);
        y += 10;
    });

    // PDFを保存
    doc.save(`${username}_wakeup_bedtime_records.pdf`);
});
