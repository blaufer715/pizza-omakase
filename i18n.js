/* English / Hebrew switch for every page.
   - Page text: English is written in the HTML; its Hebrew sits next to it in data-he (inner HTML)
     and data-he-<attr> (placeholder, alt, aria-label, content, title, src).
   - Script-generated text: page scripts call I18N.t("English text", {vars}); Hebrew lives in HE below.
   - Choice order: ?lang=he|en in the URL > saved choice > browser language (Hebrew browsers get Hebrew).
   Load this in <head> (not deferred) so the page direction is set before it paints. */
(function(){
  var KEY = "po-lang";
  var HE = {
    // home: evenings list
    "No evenings scheduled yet.": "עדיין אין ערבים מתוכננים.",
    "Full": "מלא",
    "1 seat left": "נותר מקום אחד",
    "{n} seats left": "נותרו {n} מקומות",
    "{n} seats open": "{n} מקומות פנויים",
    "Seats open": "יש מקומות פנויים",
    "Reserve & pay": "הזמנה ותשלום",
    "per seat": "לאורח",
    "Send request": "שליחת בקשה",
    // shared form messages
    "Please fill in \"{x}\" before sending.": "נא למלא \"{x}\" לפני השליחה.",
    "Sending…": "שולחים…",
    "Thanks! Taking you to payment…": "תודה! מעבירים אתכם לתשלום…",
    "Didn't go through. Please try again.": "השליחה לא הצליחה. נסו שוב.",
    "Send": "שליחה",
    // private evening booking
    "Book Now": "הזמינו עכשיו",
    "Send date request": "שליחת בקשה לתאריך",
    "Selected: {d}": "התאריך שנבחר: {d}",
    "Previous month": "החודש הקודם",
    "Next month": "החודש הבא",
    "No open dates right now. Please request a date below.": "אין כרגע תאריכים פנויים. אפשר לבקש תאריך למטה.",
    // reviews
    "No reviews yet. Been to an evening? Be the first to leave one.": "עדיין אין המלצות. הייתם באחד הערבים? היו הראשונים להשאיר המלצה.",
    "Guest": "אורח",
    "Please choose a star rating before sending.": "נא לבחור דירוג כוכבים לפני השליחה.",
    "Please write your review before sending.": "נא לכתוב את ההמלצה לפני השליחה.",
    "{n} out of 5 stars": "{n} מתוך 5 כוכבים",
    "Thank you! Your review is now on the page.": "תודה! ההמלצה שלכם כבר מופיעה בעמוד.",
    "Send review": "שליחת המלצה",
    // thank-you pages
    "Thanks, the chef has your note.": "תודה, ההערה הגיעה לשף.",
    "Your private evening is booked.": "הערב הפרטי שלכם שמור."
  };

  function pick(){
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "he" || q === "en") { save(q); return q; }
    try { var s = localStorage.getItem(KEY); if (s === "he" || s === "en") return s; } catch(_){}
    return /^(he|iw)\b/i.test(navigator.language || "") ? "he" : "en";
  }
  function save(l){ try { localStorage.setItem(KEY, l); } catch(_){} }

  var lang = pick(), root = document.documentElement;
  function setRoot(){ root.lang = lang; root.dir = lang === "he" ? "rtl" : "ltr"; }
  setRoot();

  var ATTRS = ["placeholder", "alt", "aria-label", "content", "title", "src"];
  function apply(){
    document.querySelectorAll("[data-he]").forEach(function(el){
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      el.innerHTML = lang === "he" ? el.dataset.he : el.dataset.en;
    });
    ATTRS.forEach(function(a){
      document.querySelectorAll("[data-he-" + a + "]").forEach(function(el){
        var k = "data-en-" + a;
        if (!el.hasAttribute(k)) el.setAttribute(k, el.getAttribute(a) || "");
        el.setAttribute(a, lang === "he" ? el.getAttribute("data-he-" + a) : el.getAttribute(k));
      });
    });
    var b = document.getElementById("langToggle");
    if (b) {
      b.textContent = lang === "he" ? "English" : "עברית";
      b.setAttribute("lang", lang === "he" ? "en" : "he");
      b.setAttribute("aria-label", lang === "he" ? "Switch to English" : "מעבר לעברית");
    }
  }

  function addToggle(){
    var nav = document.querySelector("nav.links");
    if (!nav || document.getElementById("langToggle")) return;
    // Sits after the menu, on its own at the far end of the header (see i18n.css).
    var b = document.createElement("button");
    b.type = "button"; b.id = "langToggle"; b.className = "lang-toggle";
    b.addEventListener("click", function(){ I18N.set(lang === "he" ? "en" : "he"); });
    nav.parentNode.insertBefore(b, nav.nextSibling);
  }

  window.I18N = {
    get lang(){ return lang; },
    locale: function(){ return lang === "he" ? "he-IL" : "en-GB"; },
    t: function(key, vars){
      var s = (lang === "he" && HE[key]) || key;
      if (vars) s = s.replace(/\{(\w+)\}/g, function(_, k){ return vars[k]; });
      return s;
    },
    set: function(l){
      if (l === lang) return;
      lang = l; save(l); setRoot(); apply();
      if (new URLSearchParams(location.search).has("lang")) {
        var u = new URL(location.href); u.searchParams.delete("lang"); history.replaceState(null, "", u);
      }
      document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: l } }));
    }
  };

  function init(){ addToggle(); apply(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
