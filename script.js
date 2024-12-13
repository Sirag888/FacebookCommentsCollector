// פונקציה להצגת סטטוס
function showStatus(message, isError = false) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = isError ? 'error' : 'active';
}

// פונקציה להתחלת התהליך
function startCollection() {
    const urls = document.getElementById('urlsInput').value
        .trim()
        .split('\n')
        .filter(url => url.trim());

    if (urls.length === 0) {
        showStatus('נא להכניס לפחות URL אחד', true);
        return;
    }

    window.pendingUrls = urls;
    processNextUrl();
}

// פונקציה לעיבוד URL הבא
function processNextUrl() {
    if (window.pendingUrls && window.pendingUrls.length > 0) {
        const url = window.pendingUrls.shift();
        showStatus(`מעבד URL ${window.pendingUrls.length + 1}`);
        const newWindow = window.open(url, '_blank');
        
        // הפעלת הקוד המקורי
        setTimeout(() => {
            newWindow.eval(`
                // הקוד המקורי מתחיל כאן
                let todo = 6;
                const EXPAND_POST = 1;
                const EXPAND_COMMENTS = 2;
                const EXPAND_REPLIES = 4;
                const EXPAND_XLAT = 8;
                const EXPAND_FILTER = 16;
                const WAIT_TIME = 100;
                const MAX_WAIT = 20;
                const END_DELAY = 3.0;
                const POST_ARTICLE = "[class=\\"x1a2a7pz\\"][role=\\"article\\"]";
                const FS_ARTICLE = "[role=\\"complementary\\"]";
                const ANY_ARTICLE = POST_ARTICLE + "," + FS_ARTICLE;
                const VIDEO_FEED = "#watch_feed";
                const ROLE_MAIN = "[role=\\"main\\"]";
                const POST_ACTION = ".xt7dq6l[role=\\"button\\"],.xu9j1y6";
                const RESPONSE_COUNTER = "[aria-label][role=\\"article\\"]";
                const GET_CONTENT = ".xsyo7zv[role=\\"button\\"]";
                const GET_COMMENTS = ".x13a6bvl " + GET_CONTENT;
                const FILTER = ".xe0p6wg > [role=\\"button\\"]";
                const FILTER_MENU = "[role=\\"menu\\"]";
                const FILTER_ITEM = "[role=\\"menuitem\\"]";
                const FILTER_ITEM_INNER = "span";
                const CSS_LOGIN_STUFF = "._5hn6,[data-nosnippet]";
                const SM_COMMENT = "[dir=\\"auto\\"] [role=\\"button\\"]";
                const SEE_MORE_COMMENT = RESPONSE_COUNTER + " " + SM_COMMENT;
                const SM_BASE = "div.x1s688f.xt0b8zv";
                const SEE_MORE_BASE = POST_ARTICLE + " " + SM_BASE + "," + FS_ARTICLE + " " + SM_BASE;
                const _NONE = "no-value";
                const _COMMENTS = "-comments";
                const _REPLIES = "-replies";
                const SETTINGS_KEY = "expand-all-todo";

                function bind(obj, fn) {
                    return function() {
                        fn.apply(obj, arguments);
                    };
                }

                let Global = null;

                // [כל שאר הקוד המקורי נשאר בדיוק אותו דבר, רק משנים את trulyEnd]

                class Session {
                    // [כל הפונקציות הקודמות נשארות אותו דבר]

                    static trulyEnd() {
                        if (Global.cfg) {
                            Global.cfg.hide();
                            delete Global.cfg;
                        }
                        Global.escHandler.off();
                        Global.cfgHandler.off();
                        Global.logger.hide();
                        delete window.Global;
                        Global = null;

                        // קריאה לפונקציה שתטפל ב-URL הבא
                        window.opener.processNextUrl();
                    }
                }

                // שינוי בפונקציית Actions.setUpActions
                class Actions {
                    constructor() {
                        this.i = 0;
                        this.setUpActions();
                    }

                    setUpActions() {
                        this.actions = [];
                        this.actions.push(onDone => ensureCommentsShowing(onDone));
                        if ((todo & EXPAND_FILTER) == 0) {
                            this.actions.push(onDone => setFilter(onDone));
                        }
                        this.actions.push(onDone => clickClass(SEE_MORE_BASE, onDone));
                        
                        function seeMore(o) {
                            o.actions.push(onDone => clickClass(SEE_MORE_COMMENT, onDone));
                        }
                        
                        seeMore(this);
                        this.actions.push(onDone => pumpOnce(onDone));
                        seeMore(this);
                        
                        // שינוי בחלון התוצאות
                        this.actions.push(onDone => {
                            const commentsContainer = Global.root.query(ROLE_MAIN);
                            const extractedComments = extractComments(commentsContainer);
                            const formattedComments = formatComments(extractedComments);
                            
                            // שימוש בחלון משותף
                            if (!window.opener.commentsWindow || window.opener.commentsWindow.closed) {
                                window.opener.commentsWindow = window.open("", "Facebook Comments", "width=800,height=600");
                                window.opener.commentsWindow.document.write(\`
                                    <html dir="rtl">
                                    <head>
                                        <title>תגובות פייסבוק</title>
                                        <style>
                                            body { font-family: Arial; padding: 20px; }
                                            pre { white-space: pre-wrap; }
                                        </style>
                                    </head>
                                    <body>
                                        <pre></pre>
                                    </body>
                                    </html>
                                \`);
                            }
                            
                            // הוספת התגובות לחלון הקיים
                            window.opener.commentsWindow.document.querySelector("pre").innerHTML += formattedComments;
                            onDone();
                        });
                        
                        this.actions.push(Session.endSession);
                        this.actions.push(null);
                    }

                    doAction() {
                        if (this.actions[this.i] !== null) {
                            this.actions[this.i](() => window.setTimeout(bind(this, this.doAction), 50));
                            this.i++;
                        }
                    }

                    kickOff() {
                        this.i = 0;
                        this.doAction();
                    }
                }

                Session.init();
            `);
        }, 2000);
    } else {
        showStatus('סיום איסוף התגובות');
    }
}
