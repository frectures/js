function sha1hex(str) {
    const unpadded = new TextEncoder().encode(str);

    const bytes = new Uint8Array((unpadded.length + 1 + 8 + 63) & ~63);
    bytes.set(unpadded);
    bytes[unpadded.length] = 0x80;

    const words = new Uint32Array(bytes.length >>> 2);
    for (let w = 0, b = 0; w < words.length; w += 1, b += 4) {
        words[w] = bytes[b] << 24 | bytes[b + 1] << 16 | bytes[b + 2] << 8 | bytes[b + 3];
    }
    words[words.length - 2] = unpadded.length >>> 29;
    words[words.length - 1] = unpadded.length << 3;

    let h0 = 0x67452301;
    let h1 = 0xEFCDAB89;
    let h2 = 0x98BADCFE;
    let h3 = 0x10325476;
    let h4 = 0xC3D2E1F0;

    const w = new Uint32Array(80);
    for (let chunk = 0; chunk < words.length; chunk += 16) {
        for (let i = 0; i < 16; ++i) {
            w[i] = words[chunk + i];
        }
        for (let i = 16; i < 80; ++i) {
            w[i] = rotateLeft(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
        }

        let a = h0;
        let b = h1;
        let c = h2;
        let d = h3;
        let e = h4;
        let f, k, temp;

        k = 0x5A827999;
        for (let i = 0; i < 20; ++i) {
            f = (b & c) | (~b & d);

            temp = (rotateLeft(a, 5) + f + e + k + w[i]) | 0;
            e = d;
            d = c;
            c = rotateLeft(b, 30);
            b = a;
            a = temp;
        }

        k = 0x6ED9EBA1;
        for (let i = 20; i < 40; ++i) {
            f = b ^ c ^ d;

            temp = (rotateLeft(a, 5) + f + e + k + w[i]) | 0;
            e = d;
            d = c;
            c = rotateLeft(b, 30);
            b = a;
            a = temp;
        }

        k = 0x8F1BBCDC;
        for (let i = 40; i < 60; ++i) {
            f = (b & c) | (b & d) | (c & d);

            temp = (rotateLeft(a, 5) + f + e + k + w[i]) | 0;
            e = d;
            d = c;
            c = rotateLeft(b, 30);
            b = a;
            a = temp;
        }

        k = 0xCA62C1D6;
        for (let i = 60; i < 80; ++i) {
            f = b ^ c ^ d;

            temp = (rotateLeft(a, 5) + f + e + k + w[i]) | 0;
            e = d;
            d = c;
            c = rotateLeft(b, 30);
            b = a;
            a = temp;
        }

        h0 = (h0 + a) | 0;
        h1 = (h1 + b) | 0;
        h2 = (h2 + c) | 0;
        h3 = (h3 + d) | 0;
        h4 = (h4 + e) | 0;
    }

    return hex32(h0) + hex32(h1) + hex32(h2) + hex32(h3) + hex32(h4);
}

function rotateLeft(x, n) {
    return x << n | x >>> -n;
}

function hex32(x) {
    const at = (position) => "0123456789ABCDEF"[(x >>> position) & 15];

    return at(28) + at(24) + at(20) + at(16) + at(12) + at(8) + at(4) + at(0);
}
