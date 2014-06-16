=======
CRIPTION
==========================

Javascript AES Encryption Library. Encrypt and Decrypt messages using an Encryption Key. Based on the implementation of the AES block cipher @: http://point-at-infinity.org/jsaes/

# Cription
> The cription object provides access to the methods.

## Methods

- [cription.encrypt](#criptionencrypt)
- [cription.decrypt](#criptiondecrypt)
- [cription.generateKey](#criptiongeneratekey)

##Cription.encrypt(...)
Encrypts a secret with a key. 
```javascript
var cription = new Cription();
var options = {
	secret : 	"mySecret",						
	key :		"myEncryptionKey1", 			
	store : 	false							
};
var encrypted_secret = cription.encrypt(options);
```
###Parameters
- __secret__: The string that is encrypted.
- __key__: (Optional) The key that encrypts the secret.
- __store__: (Optional) The option to save key `myKey` to localStorage('key'). `Default == false`

###Description
If a key is not provided/valid an automatically generated key will be used.
Keys must be [16,24,32] chars in length and hexadecimal
If `options.store == true` then `localStorage.key == options.key`.

##Cription.decrypt(...)
Decrypts an encrypted secret with a key. 
```javascript
var options = {
	secret : 	encrypted_secret,
	key : 		"myEncryptionKey1",				
};
var decrypted_secret = cription.decrypt(options);
```
###Parameters
- __secret__: The encrypted secret.
- __key__: (Optional) The key that decrypts the secret.

###Description
If a key is not provided/valid then the key saved in localStorage will be used.

##Cription.generateKey(...)
Creates a random, valid key.
```javascript
var myKey = myCription.generateKey(n);
```
###Parameters
- __n__: number of characters. n=[16,24,32];

###Description
Use this if a random, non-customized password is required. If n is not one of 16, 24 or 32 an error is thrown.

# Example
```javascript
var myCription = new Cription();
var encrypted_secret = myCription.encrypt({secret:"mySecret", store:true});	
//Generates a random key and stores it to "localStorage.key". 
//Auto-generated keys will print to console.log on encryption.
var decrypted_secret = myCription.decrypt({secret:encrypted_secret});		
//decrypts the encrypted secret with key stored in "localStorage.key"
console.log(decrypted_secret);//"mySecret"
```





<!-- 
=======
Cription
========

Javascript AES Encryption

A stand-alone library based on the implementation of the AES block cipher @: http://point-at-infinity.org/jsaes/
>>>>>>> da98543d2775312a1b206f898227f35ce169a953

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
	console.log(decrypted_secret);//"mySecret"
```
Sample 2:
```javascript
	var myCription = new Cription();
	var myKey = myCription.generateKey(32);
	//myCription.generateKey(32) creates a key of length 32. Accepts 16, 24 or 32.
	var encrypted_secret = myCription.encrypt({secret:"mySecret",key:myKey});
	var decrypted_secret = myCription.decrypt({secret:encrypted_secret,key:myKey});
	console.log(decrypted_secret);//"mySecret"
```
Sample 3:
```javascript
	var myCription = new Cription();
	var encrypted_secret = myCription.encrypt({secret:"mySecret", store:true});	
	//Generates a random key and stores it to "localStorage.key". 
	//Auto-generated keys will print to console.log on encryption.
	var decrypted_secret = myCription.decrypt({secret:encrypted_secret});		
	//decrypts the encrypted secret with key stored in "localStorage.key"
	console.log(decrypted_secret);//"mySecret"
```
<<<<<<< HEAD
 -->

