import Reflux from "reflux";
import DlogsActions from "../action/DlogsActions";
import { METHODS } from "http";

const fs = require('fs')

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
            .then((r) => {
                if (r) console.log(this.dlogs.web3.eth.blockNumber);
                this.initializeState();
            });

       

        this.state = {
            blogs: [
            ],
            following: [],
            displayBlogs: [],
            onlyShowForBlogger: "",
            currentBlogContent: "",
            login: ture

        }

    }

    initializeState = () => {
        let Max = 10;
        let helper = this.dlogs.dapp.browse(0, Max);
        let blogs = [];
        helper.reduce((acc, vaule, index) => {
            let ipns = this.dlogs.parseEntry(this.dlogs.dapp.browse(0, Max), index).ipnsHash;
            this.ipfs.pullIPNS(ipns).then(metaJSON => {
                let tempBlogs = Object.keys(metaJSON.Articles).map(hash => {
                    return { ...metaJSON.Articles[hash], ipfsHash: hash }
                })
                blogs = [...blogs, ...tempBlogs];
                if (index == helper.length - 1) {
                    this.setState({ blogs: blogs });
                }
            })

        }, blogs);


    }

    getBlogOnlyShowForBloger = () => {
        let ipns = this.dlogs.lookUpByAddr(this.state.onlyShowForBlogger);
        this.ipfs.pullIPNS(ipns).then(metaJSON => {
            let blogs = Object.keys(metaJSON.Articles).map(hash => {
                return { ...metaJSON.Articles[hash], ipfsHash: hash }
            })
            this.setState({ blogs: blogs })
        })
    }


    onFetchBlogContent = (ipfsHash) => {
        this.setState({ currentBlogContent: "" });
        this.ipfs.read(ipfsHash).then(r => {
            this.setState({ currentBlogContent: r.toString() });
        })
    }

    onSaveNewBlog = (title, TLDR, content) => {
        let tempFile = ".tempBlog";
        let tempIPNSFile = ".ipns.json";
       
        fs.writeFileSync(tempFile, content, 'utf8');
        this.ipfs.put(tempFile).then(r => {
            let ipns = this.dlogs.lookUpByAddr(this.dlogs.getAccount());
            this.ipfs.pullIPNS(ipns).then(metaJSON => {
                let newArticle = {title, author : this.dlogs.getAccount(), timestamp : Date.now(), TLDR,};
                let newJSON = {...metaJSON};
                newJSON.Articles = {...newJSON.Articles, [r[0].hash] : newArticle };
                fs.writeFileSync(tempIPNSFile, JSON.stringify(newJSON), 'utf8');
                this.ipfs.put(tempIPNSFile).then( r =>{
                    this.ipfs.publish(r[0].hash);
                    fs.unlinkSync(tempFile);
                    fs.unlinkSync(tempIPNSFile);
                })

            })
        })
    }


}


DlogsStore.id = "DlogsStore"

export default DlogsStore;
