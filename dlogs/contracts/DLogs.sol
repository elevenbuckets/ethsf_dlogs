pragma solidity ^0.4.15;

contract DLogs {
	mapping (address => string) ipnsLookup;
	mapping (string => address) addrLookup;
	mapping (uint => address) addrlist; // start from uint = 1
	mapping (address => uint) addridx; // start from uint = 1

	uint public itemcount;

   	function DLogs() {
		itemcount = 0;
	}

	function register(address blogger, string ipnsHash) public returns (bool) {
		ipnsLookup[blogger] = ipnsHash;
		addrLookup[ipnsHash] = blogger;
		itemcount = itemcount + 1;

		addrlist[itemcount] = blogger;
		addridx[blogger] = itemcount;

		return true;
	}

	function unregister(address blogger) public returns (bool) {
		require(msg.sender == blogger);

		delete addrLookup[ipnsLookup[blogger]];
		delete ipnsLookup[blogger];

		if (itemcount == 1) {		
			delete addrlist[addridx[blogger]];
			delete addridx[blogger];
		} else {
			addrlist[addridx[blogger]] = addrlist[itemcount];
			addridx[addrlist[itemcount]] = addridx[blogger];
			delete addridx[addrlist[itemcount]];	
			delete addrlist[itemcount];
		}

		itemcount = itemcount - 1;

		return true;
	} 

        function stringToBytes32s(string memory source, uint N) constant returns (bytes32 result) {
            assembly {
                result := mload(add(source, N))
            }
        }

        function hashStrB32(string memory source) constant returns (bytes32[3] result) {
            	uint srclen = bytes(source).length;
            	uint parts;

            	if (srclen <= 32) {
              		parts = 1;
            	} else {
              		uint restpt = srclen % 32;
              		parts = (srclen - restpt) / 32;
              		if (restpt != 0) parts++;
            	}

            	if (parts > 3) parts = 3;

            	for (uint i = 1; i <= parts; i++) {
              		uint N = i * 32;
              		result[i-1] = stringToBytes32s(source, N);
            	}
    	}

	function addr2ipns(address blogger) constant returns (string) {
		return ipnsLookup[blogger];
	}

	function ipns2addr(string ipnsHash) constant returns (address) {
		return addrLookup[ipnsHash];
	}

	function browse(uint start, uint end) constant returns (bytes32[3][] results) {
		require(start >= 0 && end >= 0 && end >= start && itemcount > 0);

	        if (end+1 > itemcount) end = itemcount - 1;

        	uint al = end - start + 1;

		results = new bytes32[3][](al);

		for (uint i=start; i<=end; i++) {
			results[i-start] = hashStrB32(ipnsLookup[addrlist[i+1]]);
			results[i-start][2] = bytes32(addrlist[i+1]);
		}
	
		return results;
	}

	function () payable { revert(); }
}
