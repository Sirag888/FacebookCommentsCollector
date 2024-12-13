// משתנה גלובלי לחלון התוצאות
let commentsWindow = null;

// פונקציה ראשית להתחלת התהליך
function startCollection() {
    const urls = document.getElementById('urlsInput').value
        .trim()
        .split('\n')
        .filter(url => url.trim());

    if (urls.length === 0) {
        showStatus('נא להכניס לפחות URL אחד', true);
        return;
    }

    // יצירת חלון התוצאות אם לא קיים
    if (!commentsWindow || commentsWindow.closed) {
        commentsWindow = window.open('', 'Facebook Comments', 'width=800,height=600');
        commentsWindow.document.write(`
            <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>Facebook Comments</title>
                <style>
                    body { font-family: Arial; padding: 20px; }
                    pre { white-space: pre-wrap; }
                </style>
            </head>
            <body>
                <pre id="comments"></pre>
            </body>
            </html>
        `);
    }

    window.pendingUrls = urls;
    processNextUrl();
}

// פונקציה לעיבוד URL הבא ברשימה
function processNextUrl() {
    if (window.pendingUrls && window.pendingUrls.length > 0) {
        const url = window.pendingUrls.shift();
        showStatus(`מעבד URL ${window.pendingUrls.length + 1}`);
        const newWindow = window.open(url, '_blank');
        
        setTimeout(() => {
            // הקוד המקורי מתוך Cloude.js
            newWindow.eval(`
                let todo=6;
                const EXPAND_POST=1;
                // [... כל הקוד המקורי ...]
            `);
        }, 2000);
    } else {
        showStatus('סיום איסוף התגובות');
    }
}

// פונקציה להצגת סטטוס
function showStatus(message, isError = false) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = isError ? 'error' : 'active';
}
