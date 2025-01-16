// script.js

document.addEventListener("DOMContentLoaded", async () => {
    // Initialize elliptic library for key generation (SECP256k1 curve)
    const EC = elliptic.ec;
    const ec = new EC('secp256k1');
    const keyPair = ec.genKeyPair();

    // Generate the private key in hexadecimal format
    const privateKey = keyPair.getPrivate('hex');
    // Generate the public key in hexadecimal format
    const publicKey = keyPair.getPublic('hex');

    // Generate the Bitcoin address from the public key
    const sha256 = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(publicKey));
    const ripemd160 = CryptoJS.RIPEMD160(sha256);
    const address = ripemd160.toString(CryptoJS.enc.Base58);

    // Set the Bitcoin address as a clickable link
    const addressLink = `https://www.coingecko.com/en/coins/bitcoin`; // URL to the Bitcoin page on CoinGecko
    document.getElementById("address").textContent = address;
    document.getElementById("address").setAttribute("href", addressLink);

    // Generate the QR code for the Bitcoin address
    QRCode.toCanvas(document.getElementById("qr-code"), address, {
        width: 150,
    }, function(error) {
        if (error) console.error(error);
        console.log('QR code generated!');
    });

    // Fetch live cryptocurrency prices from a public API
    const cryptoPrices = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd")
        .then(response => response.json())
        .catch(error => console.error('Error fetching prices:', error));

    // Display the fetched cryptocurrency prices
    const bitcoinPrice = cryptoPrices?.bitcoin?.usd || "N/A";
    const ethereumPrice = cryptoPrices?.ethereum?.usd || "N/A";

    document.getElementById("crypto-prices").innerHTML = `
        <p><strong>Bitcoin (BTC):</strong> $${bitcoinPrice}</p>
        <p><strong>Ethereum (ETH):</strong> $${ethereumPrice}</p>
    `;
});
