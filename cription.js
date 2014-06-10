var Cription = (function Cription() {
    var _privateVars = {
    	appData : {
	        key : 		null,
	        secret : 	null,
	        error : 	"",
    	},
    	aes : { 
			AES_Sbox : new Array(
			    99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,
			    118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,
			    147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,
			    7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,
			    47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,
			    251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,
			    188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,
			    100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,
			    50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,
			    78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,
			    116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,
			    158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,
			    137,13,191,230,66,104,65,153,45,15,176,84,187,22
			),
			AES_ShiftRowTab : new Array(0,5,10,15,4,9,14,3,8,13,2,7,12,1,6,11),
		    bytesToString: function (bytes) {
		        var bytesAsString = "";
		        for (var i = 0; i < bytes.length; i++) {
		            bytesAsString += String.fromCharCode(bytes[i]);
		        }
		        return bytesAsString;
		    },
		    stringToBytes: function (str) {
		        var ch, st, re = [];
		        for (var i = 0; i < str.length; i++ ) {
		            ch = str.charCodeAt(i);  // get char
		            st = [];                 // set up "stack"
		            do {
		                st.push( ch & 0xFF );  // push byte to stack
		                ch = ch >> 8;          // shift value down by 1 byte
		            } while ( ch );
		            re = re.concat( st.reverse() );
		        }
		        return re;
		    },
		    randomStr : function (m){
		        var m = m || 9; s = '', r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		        for (var i=0; i < m; i++) { s += r.charAt(Math.floor(Math.random()*r.length)); }
		        return s;
		    },
			AES_Init : function () {
			    _privateVars.aes.AES_Sbox_Inv = new Array(256);
			    for(var i = 0; i < 256; i++){
			        _privateVars.aes.AES_Sbox_Inv[_privateVars.aes.AES_Sbox[i]] = i;
			    }
			    _privateVars.aes.AES_ShiftRowTab_Inv = new Array(16);
			    for(var i = 0; i < 16; i++){
			        _privateVars.aes.AES_ShiftRowTab_Inv[_privateVars.aes.AES_ShiftRowTab[i]] = i;
			    }
			    _privateVars.aes.AES_xtime = new Array(256);
			    for(var i = 0; i < 128; i++) {
			        _privateVars.aes.AES_xtime[i] = i << 1;
			        _privateVars.aes.AES_xtime[128 + i] = (i << 1) ^ 0x1b;
			    }
			},
			AES_Done : function () {
			    delete _privateVars.aes.AES_Sbox_Inv;
			    delete _privateVars.aes.AES_ShiftRowTab_Inv;
			    delete _privateVars.aes.AES_xtime;
			}, 
			AES_ExpandKey : function (key) {
			    var kl = key.length, ks, Rcon = 1;
			    switch (kl) {
			        case 16: 
			            ks = 16 * (10 + 1); 
			        break;
			        case 24: 
			            ks = 16 * (12 + 1); 
			        break;
			        case 32: 
			            ks = 16 * (14 + 1); 
			        break;
			        default: 
			            console.log("AES_ExpandKey: Only key lengths of 16, 24 or 32 bytes allowed!");
			    }
			    for(var i = kl; i < ks; i += 4) {
			        var temp = key.slice(i - 4, i);
			        if (i % kl == 0) {
			            temp = new Array(_privateVars.aes.AES_Sbox[temp[1]] ^ Rcon, _privateVars.aes.AES_Sbox[temp[2]], _privateVars.aes.AES_Sbox[temp[3]], _privateVars.aes.AES_Sbox[temp[0]]); 
			            if ((Rcon <<= 1) >= 256){
			            	Rcon ^= 0x11b;
			            }
			        }
			        else if ((kl > 24) && (i % kl == 16)){
			            temp = new Array(_privateVars.aes.AES_Sbox[temp[0]], _privateVars.aes.AES_Sbox[temp[1]], _privateVars.aes.AES_Sbox[temp[2]], _privateVars.aes.AES_Sbox[temp[3]]);
			        }
			        for(var j = 0; j < 4; j++){
			            key[i + j] = key[i + j - kl] ^ temp[j];
			        }
			    }
			},
			AES_Encrypt : function (block, key) {
			    var l = key.length;
			    _privateVars.aes.AES_AddRoundKey(block, key.slice(0, 16));
			    for(var i = 16; i < l - 16; i += 16) {
			        _privateVars.aes.AES_SubBytes(block, _privateVars.aes.AES_Sbox);
			       	_privateVars.aes.AES_ShiftRows(block,_privateVars.aes.AES_ShiftRowTab);
			        _privateVars.aes.AES_MixColumns(block);
			        _privateVars.aes.AES_AddRoundKey(block, key.slice(i, i + 16));
			    }
			   	_privateVars.aes.AES_SubBytes(block, _privateVars.aes.AES_Sbox);
			    _privateVars.aes.AES_ShiftRows(block, _privateVars.aes.AES_ShiftRowTab);
			    _privateVars.aes.AES_AddRoundKey(block, key.slice(i, l));
			},
			AES_Decrypt : function (block, key) {
			    var l = key.length;
			    _privateVars.aes.AES_AddRoundKey(block, key.slice(l - 16, l));
			    _privateVars.aes.AES_ShiftRows(block, _privateVars.aes.AES_ShiftRowTab_Inv);
			    _privateVars.aes.AES_SubBytes(block, _privateVars.aes.AES_Sbox_Inv);
			    for(var i = l - 32; i >= 16; i -= 16) {
			        _privateVars.aes.AES_AddRoundKey(block, key.slice(i, i + 16));
			        _privateVars.aes.AES_MixColumns_Inv(block);
			        _privateVars.aes.AES_ShiftRows(block, _privateVars.aes.AES_ShiftRowTab_Inv);
			        _privateVars.aes.AES_SubBytes(block, _privateVars.aes.AES_Sbox_Inv);
			    }
			    _privateVars.aes.AES_AddRoundKey(block, key.slice(0, 16));
			},
			AES_SubBytes : function (state, sbox) {
			    for(var i = 0; i < 16; i++){
			        state[i] = sbox[state[i]];  
			    }
			},
			AES_AddRoundKey : function (state, rkey) {
			    for(var i = 0; i < 16; i++){
			        state[i] ^= rkey[i];
			    }
			}, 
			AES_ShiftRows : function (state, shifttab) {
			    var h = new Array().concat(state);
			    for(var i = 0; i < 16; i++){
			        state[i] = h[shifttab[i]];
			    }
			},
			AES_MixColumns : function (state) {
			    for(var i = 0; i < 16; i += 4) {
			        var s0 = state[i + 0], s1 = state[i + 1];
			        var s2 = state[i + 2], s3 = state[i + 3];
			        var h = s0 ^ s1 ^ s2 ^ s3;
			        state[i + 0] ^= h ^ _privateVars.aes.AES_xtime[s0 ^ s1];
			        state[i + 1] ^= h ^ _privateVars.aes.AES_xtime[s1 ^ s2];
			        state[i + 2] ^= h ^ _privateVars.aes.AES_xtime[s2 ^ s3];
			        state[i + 3] ^= h ^ _privateVars.aes.AES_xtime[s3 ^ s0];
			    }
			},
			AES_MixColumns_Inv : function (state) {
			    for(var i = 0; i < 16; i += 4) {
			        var s0 = state[i + 0], s1 = state[i + 1];
			        var s2 = state[i + 2], s3 = state[i + 3];
			        var h = s0 ^ s1 ^ s2 ^ s3;
			        var xh = _privateVars.aes.AES_xtime[h];
			        var h1 = _privateVars.aes.AES_xtime[_privateVars.aes.AES_xtime[xh ^ s0 ^ s2]] ^ h;
			        var h2 = _privateVars.aes.AES_xtime[_privateVars.aes.AES_xtime[xh ^ s1 ^ s3]] ^ h;
			        state[i + 0] ^= h1 ^ _privateVars.aes.AES_xtime[s0 ^ s1];
			        state[i + 1] ^= h2 ^ _privateVars.aes.AES_xtime[s1 ^ s2];
			        state[i + 2] ^= h1 ^ _privateVars.aes.AES_xtime[s2 ^ s3];
			        state[i + 3] ^= h2 ^ _privateVars.aes.AES_xtime[s3 ^ s0];
			    }
			}
		},
		validate : {
			isNotEmpty : function (value){
				if(typeof value === 'undefined'||value==""){
					_privateVars.appData.err+='\nA value you have entered is empty: '+value;
					return false;
				}
				else{
			    	return true;
			    }
			},
			isValidKeyLength : function (value){
				if(value.length==16||value.length==24||value.length==32){
					return true;
				}
				_privateVars.appData.err+="\nInvalid key length: "+value.length+": "+value;
				return false;
			},
			isAlphaNumeric : function (value){
				if( /^[a-z0-9]+$/i.test(value)){
					return true;
				}
				_privateVars.appData.err+="\nInvalid key, not alphanumeric: "+value;
				return false;
			},
			isValid : function (test,data){
				_privateVars.appData.err="***INVALID DATA***";
				var valid = false;
				switch(test){
					case "secret":
						if (_privateVars.validate.isNotEmpty(data)){
							valid=true;
						}
					break;
					case "key":
						if (_privateVars.validate.isNotEmpty(data) && _privateVars.validate.isValidKeyLength(data) && _privateVars.validate.isAlphaNumeric(data)){
							valid=true;
						}
					break;
					default:
						console.log("Could not match a switch case");
					break;
				}
				if (!valid){
					console.log(_privateVars.appData.err);
					return false;
				}
				else{
					return true;
				}
			}
		},
		util : {
		    bytesToString: function (bytes) {
		        var bytesAsString = "";
		        for (var i = 0; i < bytes.length; i++) {
		            bytesAsString += String.fromCharCode(bytes[i]);
		        }
		        return bytesAsString;
		    },
		    stringToBytes: function (str) {
		        var ch, st, re = [];
		        for (var i = 0; i < str.length; i++ ) {
		            ch = str.charCodeAt(i);  // get char
		            st = [];                 // set up "stack"
		            do {
		                st.push( ch & 0xFF );  // push byte to stack
		                ch = ch >> 8;          // shift value down by 1 byte
		            } while ( ch );
		            re = re.concat( st.reverse() );
		        }
		        return re;
		    },
		    randomStr : function (m){
		        var m = m || 9; s = '', r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		        for (var i=0; i < m; i++) { s += r.charAt(Math.floor(Math.random()*r.length)); }
		        return s;
		    },
		},
    };
    return function CriptionConstructor() {
        var _this = this; //Cache the `this` keyword
		_this.encrypt = function(options){
			_privateVars.aes.AES_Init();
			if(!options.key){
				var tempKey = _privateVars.util.randomStr(16);
				if (_privateVars.validate.isValid("key",tempKey)){
					console.log("This is your private key, keep it safe: "+tempKey);
					options.key = tempKey;
				}
           	}
       		if(options.store && _privateVars.validate.isValid("key",options.key)){
				localStorage.setItem('key',options.key); 
			}    
			if(_privateVars.validate.isValid("secret",options.secret) && _privateVars.validate.isValid("key",options.key)){
				_privateVars.aes.AES_Init();
				_privateVars.appData.key=_privateVars.util.stringToBytes(options.key);
				_privateVars.appData.secret=_privateVars.util.stringToBytes(options.secret);
				_privateVars.aes.AES_ExpandKey(_privateVars.appData.key);
				_privateVars.aes.AES_Encrypt(_privateVars.appData.secret, _privateVars.appData.key);
				_privateVars.aes.AES_Done();
	  			return _privateVars.appData.secret;
			}
		};
		_this.decrypt=function(options){
			_privateVars.aes.AES_Init();
			if(!options.key){
				if( _privateVars.validate.isValid("key",localStorage.getItem('key')) ){
					options.key = localStorage.getItem('key');
				}
				else{
					return false;
				}
			}
			if(_privateVars.validate.isValid("secret",options.secret) && _privateVars.validate.isValid("key",options.key)){
				_privateVars.appData.secret=options.secret;
				_privateVars.appData.key=_privateVars.util.stringToBytes(options.key);
				_privateVars.aes.AES_ExpandKey(_privateVars.appData.key);
				_privateVars.aes.AES_Decrypt(_privateVars.appData.secret, _privateVars.appData.key);
				_privateVars.appData.secret = _privateVars.util.bytesToString(_privateVars.appData.secret);
				_privateVars.aes.AES_Done();

	  			return _privateVars.appData.secret;
	  		}
		};
		_this.generateKey=function(n){
			var key = _privateVars.util.randomStr(n);
			if( _privateVars.validate.isValid("key",key)){
				return key;
			}
		};
		_privateVars.aes.AES_Init();
    };
}());

