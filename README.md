cription
========

Javascript Aes encryption library

A helper library based on the excellent implementation of the AES block cipher: http://point-at-infinity.org/jsaes/

Sample 1:

```javascript
	var myCription = new Cription();
	var encryptionOptions = {
		secret : 	"mySecret",						//required
		key :		"i0sq4mL5Ud6ZF6Qz", 	//optional: will be auto-generated if not set. Keys must be 16,24 or 32 characters long
		store : 	false							//optional: key saved to local storage if true
	};
	myCription.encrypt(encryptionOptions);
	var decryptionOptions = {
		secret : 	[147, 67, 167, 245, 65, 92, 194, 142, 2, 230, 201, 239, 22, 235, 234, 67],
		key : 		"i0sq4mL5Ud6ZF6Qz",				//optional if encryptOptions.store == true
	}
	myCription.decrypt(decryptionOptions);
```

Sample 2:

```javascript
	var myCription = new Cription();
	var encrypted_secret = myCription.encrypt({secret:"mySecret", store:true}); 	//Generates a random key and stores it to "localStorage.key". 
	var decrypted_secret = myCription.decrypt({secret:encrypted_secret});		//decrypts the encrypted secret with key stored in "localStorage.key"
```