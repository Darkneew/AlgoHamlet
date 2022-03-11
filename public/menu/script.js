var changelvl = false;

/* when changing level */
function chooseLevel (lvl) {
    if (changelvl) return;
    document.getElementById("levelInput").value = lvl;
    changelvl = true;
    window.setTimeout(() => {changelvl = false}, 2000)
}

/* when changing skin */
function updateSkin (x) {
    x = parseInt(document.getElementById("cInput").value) + parseInt(x);
    if (x > 6) x = 1;
    if (x < 1) x = 6;
    document.getElementById("skinImg").src = `../assets/previews/c${x}.png`
    document.getElementById("cInput").value = x;
}

window.onload = () => {
    /* setting all values on cookie values */
    var match = document.cookie.match(new RegExp('(^| )infos=([^;]+)'));
    if (!match) return;
    userConfig = JSON.parse(decodeURIComponent(match[2]));
    chooseLevel(userConfig.level);
    document.getElementById("skinImg").src = `../assets/previews/c${userConfig.c}.png`
    document.getElementById("cInput").value = userConfig.c;
}