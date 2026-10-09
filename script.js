
// ================================================
// LAST MESSAGE | CASE 001
// محرك اللعبة الكامل
// ================================================

"use strict";

// ---------- بيانات الأدلة ----------
const evidenceData = {
    phone: {
        title: "الجوال — آخر رسالة",
        description: `
            <p>عُثر على جوال آدم ضمن أغراضه.</p>
            <blockquote>«لا تأتي إلى المكان المعتاد. تغيّر كل شيء.»</blockquote>
            <p>لا يظهر اسم المرسل بوضوح، ولا يمكن تأكيد وقت إرسال الرسالة من هذه المعلومة وحدها.</p>
        `,
        essential: true
    },

    photo: {
        title: "الصورة القديمة",
        description: `
            <p>تُظهر الصورة شخصين أمام مبنى مهجور.</p>
            <p>توجد علامة مكتوبة على طرف الصورة، لكن لا يمكن تحديد صاحب الخط من الصورة وحدها.</p>
            <p>قد تساعد الصورة في معرفة المكان الذي كان آدم يبحث عنه.</p>
        `,
        essential: true
    },

    paper: {
        title: "الورقة الغامضة",
        description: `
            <p>وُجدت ورقة بين أغراض آدم، وعليها العبارة التالية:</p>
            <blockquote>«إذا حدث لي شيء، ابحثي عن المكان الذي بدأ فيه كل شيء.»</blockquote>
            <p>لا تحدد الورقة المكان المقصود، لكنها توحي بأن للماضي علاقة بما حدث.</p>
        `,
        essential: true
    },

    clock: {
        title: "الساعة المتوقفة",
        description: `
            <p>ساعة متوقفة عند وقت محدد.</p>
            <p>لا يوجد دليل يؤكد أنها توقفت لحظة اختفاء آدم، لذلك لا يمكن اعتمادها وحدها لتحديد وقت الحادثة.</p>
        `,
        essential: false
    },

    key: {
        title: "المفتاح القديم",
        description: `
            <p>عُثر على مفتاح معدني قديم بالقرب من أغراض آدم.</p>
            <p>لا توجد عليه علامة واضحة، لكن العثور على القفل المناسب قد يساعد في تحديد وجهته.</p>
        `,
        essential: false
    }
};

// ---------- بيانات المشتبه بهم ----------
const suspectsData = [
    {
        id: "layla",
        name: "ليلى منصور",
        role: "صديقة آدم القديمة",
        description: "تعرف آدم منذ سنوات، لكنها تتحفظ عند الحديث عن الماضي.",
        answers: {
            time: "رأيت آدم قبل اختفائه بفترة، لكنني لا أتذكر الوقت بدقة.",
            photo: "الصورة مألوفة لي، لكنني لا أريد التحدث عن الشخص الآخر.",
            secret: "كان هناك أمر قديم لا يحب آدم الحديث عنه. لم أتوقع أن يعود للظهور."
        }
    },
    {
        id: "fahad",
        name: "فهد السالم",
        role: "زميل آدم في العمل",
        description: "كان على تواصل مع آدم بسبب العمل، ويقول إن علاقتهما كانت عادية.",
        answers: {
            time: "آخر تواصل بيننا كان متعلقًا بالعمل. لا أتذكر متى رأيته آخر مرة.",
            photo: "لم أر هذه الصورة من قبل، أو ربما لم أنتبه إليها.",
            secret: "سمعت أن آدم كان يبحث في موضوع قديم، لكنه لم يخبرني بالتفاصيل."
        }
    },
    {
        id: "noura",
        name: "نورة الحربي",
        role: "معرفة للعائلة",
        description: "تعرف بعض أفراد عائلة آدم، وتبدو حذرة عند الحديث عن اختفائه.",
        answers: {
            time: "لم أقابله مؤخرًا حسب ما أتذكر، لكنني لا أستطيع تأكيد الوقت.",
            photo: "قد يكون المبنى مألوفًا، لكن الصورة وحدها لا تكفي لأتأكد.",
            secret: "هناك أمور من الماضي لم تكن العائلة تتحدث عنها كثيرًا."
        }
    },
    {
        id: "majed",
        name: "ماجد الراشد",
        role: "معرفة سابقة",
        description: "كانت له علاقة سابقة بآدم، وانقطعت الاتصالات بينهما منذ مدة.",
        answers: {
            time: "لم أتحدث مع آدم منذ فترة، ولا أعرف ماذا كان يفعل ليلة اختفائه.",
            photo: "لا أستطيع تأكيد من يظهر في الصورة.",
            secret: "كان آدم يعتقد أن شيئًا لم يُكشف من الماضي، لكنه لم يخبرني بكل شيء."
        }
    }
];

// ---------- حالة اللعبة ----------
const gameState = {
    examined: new Set(),
    interviews: new Set(),
    selectedEvidence: null,
    selectedSuspect: null,
    connections: [],
    currentEvidence: null,
    currentSuspect: null,
    currentQuestion: null,
    caseSolved: false
};

let toastTimer = null;

// ---------- أدوات مساعدة ----------
function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return [...document.querySelectorAll(selector)];
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

function goToScreen(screenId) {
    const target = document.getElementById(screenId);

    if (!target) {
        console.error("الشاشة غير موجودة:", screenId);
        showToast("تعذر فتح الصفحة المطلوبة.");
        return;
    }

    $all(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    target.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (screenId === "roomScreen") updateEvidenceProgress();
    if (screenId === "suspectsScreen") renderSuspects();
    if (screenId === "boardScreen") renderBoard();
    if (screenId === "reviewScreen") renderReview();
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.hidden = false;
}

function closeModal(modal) {
    if (modal) modal.hidden = true;
}

function getSuspect(id) {
    return suspectsData.find(suspect => suspect.id === id);
}

// ---------- التنقل بين الشاشات ----------
function initializeNavigation() {
    $("#brandHome")?.addEventListener("click", () => {
        goToScreen("homeScreen");
    });

    $("#startButton")?.addEventListener("click", () => {
        goToScreen("storyScreen");
    });

    $("#continueButton")?.addEventListener("click", () => {
        goToScreen("storyScreen");
    });

    $("#toInvestigation")?.addEventListener("click", () => {
        goToScreen("roomScreen");
    });

    $("#toSuspectsFromRoom")?.addEventListener("click", () => {
        const essentialCount = Object.keys(evidenceData).filter(id =>
            evidenceData[id].essential && gameState.examined.has(id)
        ).length;

        if (essentialCount < 3) {
            showToast("افحصي الأدلة الأساسية الثلاثة أولًا.");
            return;
        }

        goToScreen("suspectsScreen");
    });

    $("#toBoardButton")?.addEventListener("click", () => {
        if (gameState.interviews.size < suspectsData.length) {
            showToast("استجوبي المشتبه بهم الأربعة أولًا.");
            return;
        }

        goToScreen("boardScreen");
    });

    $("#backToSuspects")?.addEventListener("click", () => {
        goToScreen("suspectsScreen");
    });

    $("#finishAnalysisButton")?.addEventListener("click", () => {
        if (gameState.connections.length === 0) {
            showToast("سجّلي رابطًا واحدًا على الأقل قبل المراجعة.");
            return;
        }

        goToScreen("reviewScreen");
    });

    $("#reviewBoardButton")?.addEventListener("click", () => {
        goToScreen("boardScreen");
    });

    $("#reviewRoomButton")?.addEventListener("click", () => {
        goToScreen("roomScreen");
    });
}

// ---------- فحص الأدلة ----------
function initializeEvidence() {
    $all("[data-evidence]").forEach(button => {
        button.addEventListener("click", () => {
            const evidenceId = button.dataset.evidence;
            const evidence = evidenceData[evidenceId];

            if (!evidence) return;

            gameState.currentEvidence = evidenceId;

            $("#evidenceModalTitle").textContent = evidence.title;
            $("#evidenceModalContent").innerHTML = evidence.description;

            $("#markEvidenceButton").textContent =
                gameState.examined.has(evidenceId)
                    ? "تم فحص هذا الدليل"
                    : "تسجيل فحص الدليل";

            openModal("evidenceModal");
        });
    });

    $("#markEvidenceButton")?.addEventListener("click", () => {
        const id = gameState.currentEvidence;
        if (!id) return;

        gameState.examined.add(id);

        updateEvidenceProgress();

        const status = $(`[data-status="${id}"]`);
        if (status) status.textContent = "تم الفحص ✓";

        const button = $(`[data-evidence="${id}"]`);
        if (button) button.classList.add("examined");

        closeModal($("#evidenceModal"));
        showToast("تم تسجيل فحص الدليل.");
    });

    updateEvidenceProgress();
}

function updateEvidenceProgress() {
    const essentialIds = Object.keys(evidenceData).filter(
        id => evidenceData[id].essential
    );

    const count = essentialIds.filter(
        id => gameState.examined.has(id)
    ).length;

    const progress = $("#evidenceProgress");
    const bar = $("#evidenceProgressBar");

    if (progress) progress.textContent = `${count} / 3 أدلة أساسية`;
    if (bar) bar.style.width = `${(count / 3) * 100}%`;

    $all("[data-evidence]").forEach(button => {
        const id = button.dataset.evidence;
        const status = $(`[data-status="${id}"]`);

        if (status && gameState.examined.has(id)) {
            status.textContent = "تم الفحص ✓";
            button.classList.add("examined");
        }
    });
}

// ---------- المشتبه بهم ----------
function renderSuspects() {
    const grid = $("#suspectsGrid");
    if (!grid) return;

    grid.innerHTML = suspectsData.map(suspect => {
        const interviewed = gameState.interviews.has(suspect.id);

        return `
            <article class="panel suspect-card">
                <span class="file-label">PERSON OF INTEREST</span>
                <h3>${escapeHTML(suspect.name)}</h3>
                <p class="suspect-role">${escapeHTML(suspect.role)}</p>
                <p>${escapeHTML(suspect.description)}</p>
                <p class="interview-status">
                    ${interviewed ? "تم تسجيل المقابلة ✓" : "لم تتم المقابلة"}
                </p>
                <button
                    class="primary-btn full"
                    type="button"
                    data-interview="${suspect.id}">
                    ${interviewed ? "عرض المقابلة" : "بدء الاستجواب"}
                </button>
            </article>
        `;
    }).join("");

    $all("[data-interview]").forEach(button => {
        button.addEventListener("click", () => {
            openSuspectInterview(button.dataset.interview);
        });
    });

    const progress = $("#interviewProgress");

    if (progress) {
        progress.textContent =
            `${gameState.interviews.size} / ${suspectsData.length} مقابلات`;
    }
}

// ---------- الاستجواب ----------
function openSuspectInterview(suspectId) {
    const suspect = getSuspect(suspectId);
    if (!suspect) return;

    gameState.currentSuspect = suspectId;
    gameState.currentQuestion = null;

    $("#suspectModalTitle").textContent = suspect.name;

    $("#suspectModalContent").innerHTML = `
        <p class="file-label">${escapeHTML(suspect.role)}</p>
        <p>${escapeHTML(suspect.description)}</p>
        <p class="muted-note">
            اختاري سؤالًا لمعرفة المزيد. أقوال الشخص لا تعني بالضرورة أنها الحقيقة كاملة.
        </p>
    `;

    $("#followupAnswer").hidden = true;
    $("#followupAnswer").textContent = "";

    $all("[data-question]").forEach(button => {
        button.classList.remove("selected");
    });

    $("#recordInterviewButton").textContent =
        gameState.interviews.has(suspectId)
            ? "تحديث تسجيل المقابلة"
            : "تسجيل المقابلة";

    openModal("suspectModal");
}

function initializeInterrogation() {
    $all("[data-question]").forEach(button => {
        button.addEventListener("click", () => {
            const suspect = getSuspect(gameState.currentSuspect);
            if (!suspect) return;

            const question = button.dataset.question;
            const answer = suspect.answers[question];

            if (!answer) return;

            gameState.currentQuestion = question;

            $all("[data-question]").forEach(item => {
                item.classList.toggle("selected", item === button);
            });

            const answerBox = $("#followupAnswer");
            answerBox.textContent = answer;
            answerBox.hidden = false;
        });
    });

    $("#recordInterviewButton")?.addEventListener("click", () => {
        const suspectId = gameState.currentSuspect;

        if (!suspectId) return;

        if (!gameState.currentQuestion) {
            showToast("اختاري سؤالًا واحدًا على الأقل قبل تسجيل المقابلة.");
            return;
        }

        gameState.interviews.add(suspectId);

        closeModal($("#suspectModal"));
        renderSuspects();

        showToast("تم تسجيل المقابلة بنجاح.");
    });
}

// ---------- لوحة ربط الأدلة ----------
function renderBoard() {
    const evidenceList = $("#boardEvidenceList");
    const suspectList = $("#boardSuspectList");

    if (!evidenceList || !suspectList) return;

    evidenceList.innerHTML = Object.entries(evidenceData).map(([id, item]) => `
        <button
            type="button"
            class="choice-button ${gameState.selectedEvidence === id ? "selected" : ""}"
            data-board-evidence="${id}">
            <strong>${escapeHTML(item.title)}</strong>
            <small>${gameState.examined.has(id) ? "تم فحصه" : "لم يُفحص بعد"}</small>
        </button>
    `).join("");

    suspectList.innerHTML = suspectsData.map(suspect => `
        <button
            type="button"
            class="choice-button ${gameState.selectedSuspect === suspect.id ? "selected" : ""}"
            data-board-suspect="${suspect.id}">
            <strong>${escapeHTML(suspect.name)}</strong>
            <small>${gameState.interviews.has(suspect.id) ? "تم استجوابه" : "لم تتم مقابلته"}</small>
        </button>
    `).join("");

    $all("[data-board-evidence]").forEach(button => {
        button.addEventListener("click", () => {
            gameState.selectedEvidence = button.dataset.boardEvidence;
            renderBoard();
        });
    });

    $all("[data-board-suspect]").forEach(button => {
        button.addEventListener("click", () => {
            gameState.selectedSuspect = button.dataset.boardSuspect;
            renderBoard();
        });
    });

    updateConnectionSummary();
    renderConnections();
}

function updateConnectionSummary() {
    const summary = $("#connectionSummary");
    if (!summary) return;

    const evidence = evidenceData[gameState.selectedEvidence];
    const suspect = getSuspect(gameState.selectedSuspect);

    if (!evidence || !suspect) {
        summary.textContent = "اختاري دليلًا ومشتبهًا به أولًا.";
        return;
    }

    summary.textContent =
        `ربط الدليل «${evidence.title}» بالمشتبه به «${suspect.name}».`;
}

function initializeConnections() {
    $("#saveConnectionButton")?.addEventListener("click", () => {
        const evidenceId = gameState.selectedEvidence;
        const suspectId = gameState.selectedSuspect;

        if (!evidenceId || !suspectId) {
            $("#boardFeedback").textContent =
                "اختاري دليلًا ومشتبهًا به قبل تسجيل الربط.";
            return;
        }

        if (!gameState.examined.has(evidenceId)) {
            $("#boardFeedback").textContent =
                "افحصي الدليل قبل ربطه بالمشتبه به.";
            return;
        }

        if (!gameState.interviews.has(suspectId)) {
            $("#boardFeedback").textContent =
                "استجوبي المشتبه به قبل ربطه بالدليل.";
            return;
        }

        const reason = $("#connectionReason").value.trim();

        const exists = gameState.connections.some(connection =>
            connection.evidenceId === evidenceId &&
            connection.suspectId === suspectId
        );

        if (exists) {
            $("#boardFeedback").textContent =
                "هذا الربط مسجل مسبقًا. اختاري دليلًا أو شخصًا مختلفًا.";
            return;
        }

        gameState.connections.push({
            evidenceId,
            suspectId,
            reason
        });

        $("#connectionReason").value = "";
        $("#boardFeedback").textContent = "تم تسجيل الفرضية بنجاح.";

        renderConnections();
        renderReview();

        showToast("تم حفظ الربط.");
    });
}

function renderConnections() {
    const list = $("#connectionsList");
    if (!list) return;

    if (gameState.connections.length === 0) {
        list.innerHTML = "<p class='muted-note'>لا توجد روابط مسجلة حتى الآن.</p>";
        return;
    }

    list.innerHTML = gameState.connections.map((connection, index) => {
        const evidence = evidenceData[connection.evidenceId];
        const suspect = getSuspect(connection.suspectId);

        return `
            <article class="connection-item">
                <strong>الفرضية ${index + 1}</strong>
                <p>${escapeHTML(evidence.title)} ← ${escapeHTML(suspect.name)}</p>
                <p>${escapeHTML(connection.reason || "لم تتم إضافة سبب لهذا الربط.")}</p>
                <button
                    type="button"
                    class="text-btn"
                    data-remove-connection="${index}">
                    حذف الربط
                </button>
            </article>
        `;
    }).join("");

    $all("[data-remove-connection]").forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.removeConnection);

            gameState.connections.splice(index, 1);

            renderConnections();
            renderReview();

            showToast("تم حذف الربط.");
        });
    });
}

// ---------- مراجعة القضية ----------
function renderReview() {
    const summary = $("#reviewSummary");
    if (!summary) return;

    const essentialCount = Object.entries(evidenceData).filter(
        ([id, item]) => item.essential && gameState.examined.has(id)
    ).length;

    summary.innerHTML = `
        <h3>ملخص القضية 001</h3>

        <div class="review-stat">
            <strong>${essentialCount} / 3</strong>
            <span>الأدلة الأساسية المفحوصة</span>
        </div>

        <div class="review-stat">
            <strong>${gameState.interviews.size} / 4</strong>
            <span>المقابلات المسجلة</span>
        </div>

        <div class="review-stat">
            <strong>${gameState.connections.length}</strong>
            <span>الروابط المسجلة</span>
        </div>

        <p>
            قارني بين الأدلة وأقوال الشخصيات قبل اتخاذ القرار النهائي.
        </p>
    `;

    let finalButton = $("#openFinalConfrontation");

    if (!finalButton) {
        finalButton = document.createElement("button");
        finalButton.id = "openFinalConfrontation";
        finalButton.type = "button";
        finalButton.className = "primary-btn full";
        finalButton.addEventListener("click", openFinalConfrontation);

        summary.insertAdjacentElement("afterend", finalButton);
    }

    const ready =
        essentialCount === 3 &&
        gameState.interviews.size === suspectsData.length &&
        gameState.connections.length > 0;

    finalButton.disabled = !ready;

    finalButton.textContent = ready
        ? "الانتقال إلى المواجهة الأخيرة"
        : "أكملي الأدلة والمقابلات والروابط أولًا";
}

// ---------- أسماء المتهمين والأدلة ----------
const finalSuspectNames = {
    layla: "ليلى منصور",
    fahad: "فهد السالم",
    noura: "نورة الحربي",
    majed: "ماجد الراشد"
};

const finalEvidenceNames = {
    phone: "رسالة آدم الأخيرة",
    photo: "الصورة القديمة",
    paper: "الورقة الغامضة",
    clock: "الساعة المتوقفة",
    key: "المفتاح القديم"
};

// ---------- فتح المواجهة الأخيرة ----------
function openFinalConfrontation() {
    const essentialCount = Object.keys(evidenceData).filter(id =>
        evidenceData[id].essential && gameState.examined.has(id)
    ).length;

    if (essentialCount < 3) {
        showToast("افحصي الأدلة الأساسية الثلاثة أولًا.");
        return;
    }

    if (gameState.interviews.size < suspectsData.length) {
        showToast("أكملي استجواب الشخصيات الأربع أولًا.");
        return;
    }

    if (gameState.connections.length === 0) {
        showToast("سجّلي رابطًا واحدًا على الأقل قبل المواجهة.");
        return;
    }

    goToScreen("finalConfrontation");

    if ($("#finalError")) $("#finalError").hidden = true;
    if ($("#truthEnding")) $("#truthEnding").hidden = true;
}

// ---------- كشف الحقيقة ----------
function revealFinalTruth() {
    const selectedSuspect = $('input[name="finalSuspect"]:checked');

    const selectedEvidence = $all(
        'input[name="finalEvidence"]:checked'
    ).map(input => input.value);

    const error = $("#finalError");
    const ending = $("#truthEnding");

    if (!selectedSuspect || selectedEvidence.length === 0) {
        if (error) {
            error.textContent = "اختاري مشتبهًا به ودليلًا واحدًا على الأقل.";
            error.hidden = false;
        }

        if (ending) ending.hidden = true;
        return;
    }

    if (error) error.hidden = true;
    if (ending) ending.hidden = false;

    const isCorrectSuspect = selectedSuspect.value === "layla";

    const correctEvidenceCount = [
        "phone",
        "photo",
        "paper",
        "key"
    ].filter(id => selectedEvidence.includes(id)).length;

    const solved = isCorrectSuspect && correctEvidenceCount >= 3;

    if (solved) {
        gameState.caseSolved = true;

        $("#endingTitle").textContent =
            "أُغلقت القضية — تم كشف الحقيقة";

        $("#endingText").textContent =
            "كشفت الأدلة أن ليلى منصور أخفت حقيقة علاقتها بالمبنى المهجور. " +
            "اكتشف آدم سرًا قديمًا وواجهها بما عرفه، فوقع بينهما خلاف. " +
            "تركت ليلى آدم محتجزًا داخل غرفة في المبنى وغادرت دون إبلاغ أحد بمكانه. " +
            "قاد الربط بين الصورة القديمة والورقة ورسالة الجوال والمفتاح إلى المكان الصحيح، " +
            "وعُثر على آدم حيًا. وبعد مواجهتها بالأدلة، اعترفت ليلى بأنها تركته هناك. " +
            "انتهى التحقيق بكشف الحقيقة وإغلاق ملف اختفاء آدم.";

        $("#nextCaseMessage").textContent =
            "انتهت القضية 001 بنجاح. أُغلق ملف اختفاء آدم. شكرًا لك على إكمال التحقيق.";

        showToast("نجحتِ في حل القضية وكشف الحقيقة.");

    } else {
        gameState.caseSolved = false;

        $("#endingTitle").textContent =
            "لم تُحسم القضية بعد";

        $("#endingText").textContent =
            "الاختيار الذي قدمتِه لا يكفي لكشف الحقيقة كاملة. " +
            "راجعي الأدلة الأساسية، وتأكدي من ربط الصورة والورقة ورسالة الجوال أو المفتاح " +
            "بالمشتبه به المناسب، ثم عودي إلى المواجهة الأخيرة.";

        $("#nextCaseMessage").textContent =
            "لا يزال ملف القضية 001 مفتوحًا. يمكنك العودة للتحقيق والمحاولة مجددًا.";

        showToast("لم تكتمل الإجابة الصحيحة. راجعي الأدلة وحاولي مجددًا.");
    }

    ending.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

// ---------- إعادة اختيار الاتهام ----------
function resetFinalConfrontation() {
    $all('input[name="finalSuspect"]').forEach(input => {
        input.checked = false;
    });

    $all('input[name="finalEvidence"]').forEach(input => {
        input.checked = false;
    });

    if ($("#finalError")) $("#finalError").hidden = true;
    if ($("#truthEnding")) $("#truthEnding").hidden = true;
}

function initializeFinalConfrontation() {
    $("#revealTruthBtn")?.addEventListener("click", revealFinalTruth);

    $("#restartFinalBtn")?.addEventListener("click", () => {
        if (gameState.caseSolved) {
            const confirmed = window.confirm(
                "هل تريدين إعادة القضية من البداية؟ سيتم مسح تقدم التحقيق."
            );

            if (confirmed) resetGame();
        } else {
            resetFinalConfrontation();
            showToast("تمت إعادة اختيار الاتهام.");
        }
    });
}

// ---------- إغلاق النوافذ المنبثقة ----------
function initializeModals() {
    $all("[data-close-modal]").forEach(button => {
        button.addEventListener("click", () => {
            closeModal(button.closest(".modal-backdrop"));
        });
    });

    $all(".modal-backdrop").forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            $all(".modal-backdrop").forEach(modal => {
                closeModal(modal);
            });
        }
    });
}

// ---------- إعادة اللعبة من البداية ----------
function resetGame() {
    gameState.examined.clear();
    gameState.interviews.clear();
    gameState.connections = [];

    gameState.selectedEvidence = null;
    gameState.selectedSuspect = null;
    gameState.currentEvidence = null;
    gameState.currentSuspect = null;
    gameState.currentQuestion = null;
    gameState.caseSolved = false;

    $all("[data-evidence]").forEach(button => {
        button.classList.remove("examined");
    });

    $all("[data-status]").forEach(status => {
        const id = status.dataset.status;

        status.textContent = evidenceData[id]?.essential
            ? "فحص الدليل ←"
            : "فحص إضافي ←";
    });

    if ($("#connectionReason")) {
        $("#connectionReason").value = "";
    }

    if ($("#boardFeedback")) {
        $("#boardFeedback").textContent = "";
    }

    if ($("#followupAnswer")) {
        $("#followupAnswer").hidden = true;
        $("#followupAnswer").textContent = "";
    }

    resetFinalConfrontation();

    updateEvidenceProgress();
    renderSuspects();
    renderBoard();
    renderReview();

    goToScreen("homeScreen");

    showToast("بدأت القضية من جديد.");
}

function initializeReset() {
    $("#resetGameButton")?.addEventListener("click", () => {
        const confirmed = window.confirm(
            "هل تريدين بدء القضية من جديد ومسح تقدم التحقيق الحالي؟"
        );

        if (confirmed) resetGame();
    });
}

// ---------- تشغيل اللعبة ----------
function initializeGame() {
    initializeNavigation();
    initializeEvidence();
    initializeInterrogation();
    initializeConnections();
    initializeFinalConfrontation();
    initializeModals();
    initializeReset();

    renderSuspects();
    renderBoard();
    renderReview();
    updateEvidenceProgress();

    console.log("LAST MESSAGE | CASE 001: تم تشغيل اللعبة.");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeGame);
} else {
    initializeGame();
}
