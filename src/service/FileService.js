'use strict';

import IPFS from 'ipfs';



class FileService {
    constructor() {
        // Create the IPFS node instance
        this.ipfs = new IPFS({ repo: String(Math.random() + Date.now()) });
        console.log("new ipfs");
        this.ipfs.once('ready', () => {
            console.log('IPFS node is ready');
        })
    }

}

const fileService = new FileService();
export default fileService;