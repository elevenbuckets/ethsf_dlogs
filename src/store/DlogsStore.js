import Reflux from "reflux";
import DlogsActions from "../action/DlogsActions";

const path = require('path');

class DlogsStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = DlogsActions;
        const remote = require('electron').remote;
        this.ipfs = remote.getGlobal('ipfs');
        const DLogsAPI = require('../../DLogsAPI.js');

        this.dlogs = new DLogsAPI('../.local/config.json');

        this.ipfs.ipfsAPI.id()
            .then((o) => { console.log(JSON.stringify(o, 0, 2)) })
            .then(() => { return this.dlogs.connect() })
            .then(() => { return this.dlogs.init(this.ipfs) })
            .then((r) => { if (r) console.log(this.dlogs.web3.eth.blockNumber);
                this.initializeState(); })

        this.state = {
            blogs: [
            ],
            following : [],
            displayBlogs:[],
            onlyShowForBlogger : "0x89dc07a2f750cf62e757f909a4985a94a07d6359",
            currentBlogContent:""

        }
       
    }

    initializeState = () =>{
        let ipns = this.dlogs.lookUpByAddr(this.state.onlyShowForBlogger);
        this.ipfs.resolve(ipns).then(r =>{return this.ipfs.read(path.basename(r))})
        .then(r=>{
            let metaJSON = JSON.parse(r.toString());
            let blogs = Object.keys(metaJSON.Articles).map(hash =>{
                return {...metaJSON.Articles[hash], ipfsHash : hash}
            })
            this.setState({blogs: blogs})
        })
    }

    refreshBlogs = () =>{
        
    }

    onFetchBlogContent = (ipfsHash) =>{
        this.setState({currentBlogContent : ""});
        this.ipfs.read(ipfsHash).then(r =>{
            this.setState({currentBlogContent : JSON.parse(r.toString()).content});
        })
    }

    onSaveNewBlog = (title, content) => {
        let blog = { title, content }
        this.setState({ blogs: [...this.state.blogs, blog] })
    }


}


DlogsStore.id = "DlogsStore"

export default DlogsStore;