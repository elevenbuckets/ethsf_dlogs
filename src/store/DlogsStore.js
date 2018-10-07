import Reflux from "reflux";
import DlogsActions from "../action/DlogsActions";

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
            .then(() => { return dlogs.connect() })
            .then(() => { return dlogs.init(ipfs) })
            .then((r) => { if (r) console.log(dlogs.web3.eth.blockNumber) })

        this.state = {
            blogs: [{
                title: "Blog 1",
                author: "0x...1",
                timeStamp: "123123",
                content: "# This is Blog 1\n" + "This is the content 1"
            },
            {
                title: "Blog 1",
                author: "0x...1",
                timeStamp: "123123",
                content: "# This is Blog 1\n" + "This is the content 1"
            }
            ],
            following : [],
            displayBlogs:[],
            onlyShowForBlogger : "0x89dc07a2f750cf62e757f909a4985a94a07d6359",

        }
        this.initializeState();
    }

    initializeState = () =>{
        let ipns = this.dlogs.lookUpByAddr(this.state.onlyShowForBlogger);
        this.ipfs.resolve(ipns).then(r =>{return this.ipfs.readPath(r)})
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

    onSaveNewBlog = (title, content) => {
        let blog = { title, content }
        this.setState({ blogs: [...this.state.blogs, blog] })
    }


}


DlogsStore.id = "DlogsStore"

export default DlogsStore;