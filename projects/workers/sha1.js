// Note: onmessage is async only because on line 9, we await for the digest.
// In general, web worker message handlers do NOT have to be marked async.
// Web workers are CONCURRENT by nature, not ASYNCHRONOUS!

onmessage = async function (messageEvent) {
            /////
    const str = messageEvent.data;
    const utf8 = new TextEncoder().encode(str);
    const buffer = await crypto.subtle.digest("SHA-1", utf8);
                   /////
    const sha1hex = Array.from(new Uint8Array(buffer), hex8).join("");
    postMessage({ str, sha1hex });
}

function hex8(x) {
    return "0123456789ABCDEF"[x >>> 4] + "0123456789ABCDEF"[x & 15];
}
