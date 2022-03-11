window.onload = () => {
    /* reset levels */
    var match = document.cookie.match(new RegExp('(^| )infos=([^;]+)'));
    if (!match) window.location.replace("/menu");
    let userConfig = JSON.parse(decodeURIComponent(match[2]))
    userConfig.level = 1;
    document.cookie = `infos=${encodeURIComponent(JSON.stringify(userConfig))};path=/`;
}