/*
 * Simple wrapper round cryptoJS, to make common use cases easier
 *
 * By Will Voelcker
 *
 * http://www.willv.net
 */


var WV_Encryption = (function() {
	var modules = {}, crypto, passphrase = "";

	function setUp(cryptoJS) {
		crypto = cryptoJS;

		if (typeof crypto.SHA256 == "undefined") {
			throw new Error("Hash function not available");
		}

		if (typeof crypto.AES == "undefined") {
			throw new Error("Two-way AES encryption not available");
		}
	}

	function setPassPhrase(newpassphrase) {
		passphrase = newpassphrase;
	}

	function encrypt(text) {
		checkPassphraseSet();
		return crypto.AES.encrypt(text, passphrase).toString();
	}

	function checkPassphraseSet() {
		if (passphrase === "") {
			throw new Error("No passphrase yet");
		}
	}

	function decrypt(text) {
		checkPassphraseSet();
		return crypto.AES.decrypt(text, passphrase).toString(crypto.enc.Utf8);
	}

	function hash(text) {
		return crypto.SHA256(text).toString();
	}

	function toBase64(text) {
		return crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(text));
	}

	function getHashedPassphrase() {
		checkPassphraseSet();
		return hash(passphrase);
	}

	return {
		"setUp": setUp,
		"encrypt": encrypt,
		"decrypt": decrypt,
		"hash": hash,
		"getHashedPassphrase": getHashedPassphrase,
		"setPassPhrase": setPassPhrase,
		"toBase64": toBase64
	};

}());

// Export the object for use elsewhere
if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		return WV_Encryption;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = WV_Encryption;
} else if (typeof window != "undefined") {
	window.WV_Encryption = WV_Encryption;
}