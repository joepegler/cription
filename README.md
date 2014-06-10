Cription
========

Javascript AES Encryption

A stand-alone library based on the implementation of the AES block cipher @: http://point-at-infinity.org/jsaes/

Three methods provided:
```javascript
Cription.encrypt(...);
Cription.decrypt(...);
Cription.generateKey(...);
```
Sample 1:
```javascript
	var myCription = new Cription();
	var encryptionOptions = {
		secret : 	"mySecret",						
		key :		"myEncryptionKey1", 			
		store : 	false							
	};
	//encryptionOptions.secret is mandatory
	//encryptionOptions.key is optional.. Will be automated if not provided. 
	//encryptionOptions.key must be 16, 24 or 32 characters long & hexadecimal.
	//encryptionOptions.store is optional and defaults to false. 
	//encryptionOptions.store == true saves the key to localStorage("key").
	var encrypted_secret = myCription.encrypt(encryptionOptions);
	var decryptionOptions = {
		secret : 	encrypted_secret,
		key : 		"myEncryptionKey1",				
	}
	//decryptionOptions.key is optional if encryptionOptions.key has has been stored.
	var decrypted_secret = myCription.decrypt(decryptionOptions);
	console.log(decrypted_secret);//returns "mySecret"
```
Sample 2:
```javascript
	var myCription = new Cription();
	var myKey = myCription.generateKey(32);
	//myCription.generateKey(32) creates a key of length 32. Accepts 16, 24 or 32.
	var encrypted_secret = myCription.encrypt({secret:"mySecret",key:myKey});
	var decrypted_secret = myCription.decrypt({secret:encrypted_secret,key:myKey});
	console.log(decrypted_secret);//returns "mySecret"
```
Sample 3:
```javascript
	var myCription = new Cription();
	var encrypted_secret = myCription.encrypt({secret:"mySecret", store:true});	
	//Generates a random key and stores it to "localStorage.key". 
	//Auto-generated keys will print to console.log on encryption.
	var decrypted_secret = myCription.decrypt({secret:encrypted_secret});		
	//decrypts the encrypted secret with key stored in "localStorage.key"
	console.log(decrypted_secret);//returns "mySecret"
```
