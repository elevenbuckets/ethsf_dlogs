import Reflux from "reflux";
import DlogsActions from "../action/DlogsActions";
import { METHODS } from "http";

const fs = require('fs')

class DlogsStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = DlogsActions;
        const remote = require('electron').remote;
        this.dlogs = remote.getGlobal('dlogs');

        this.dlogs.ipfsId()
            .then((o) => { 
		console.log(JSON.stringify(o, 0, 2)) 
                this.initializeState();
            });

        this.state = {
            blogs: [
            ],
            following: [],
            displayBlogs: [],
            onlyShowForBlogger: "",
            currentBlogContent: "",
            login: false,
            account: ""

        }

    }

    initializeState = () => {
        let Max = 0;
        let blogs = [];
        let count = 0;
        this.dlogs.browse(0, Max).then((helper) => {
            helper.map((value, index) => {
                let ipns = value.ipnsHash;
                this.dlogs.pullIPNS(ipns).then(metaJSON => {
                    let tempBlogs = Object.keys(metaJSON.Articles).map(hash => {
                        return { ...metaJSON.Articles[hash], ipfsHash: hash }
                    })
                    blogs = [...blogs, ...tempBlogs];
                    count = count + 1;
                    if (count == helper.length) {
                        this.setState({ blogs: blogs });
                    }
                })
            });
	})
    }

    getBlogOnlyShowForBloger = () => {
        this.dlogs.lookUpByAddr(this.state.onlyShowForBlogger).then((ipns) => {
            this.dlogs.pullIPNS(ipns).then(metaJSON => {
                let blogs = Object.keys(metaJSON.Articles).map(hash => {
                    return { ...metaJSON.Articles[hash], ipfsHash: hash }
                })
                this.setState({ blogs: blogs })
            })
	})
    }


    onFetchBlogContent = (ipfsHash) => {
        this.setState({ currentBlogContent: "" });
        this.dlogs.ipfsRead(ipfsHash).then(r => {
            this.setState({ currentBlogContent: r });
        })
    }

    onSaveNewBlog = (title, TLDR, content) => {
        let tempFile = ".tempBlog";
        let tempIPNSFile = ".ipns.json";

        fs.writeFileSync(tempFile, content, 'utf8');
        this.dlogs.lookUpByAddr(this.dlogs.getAccount()).then((ipns) => {
            this.dlogs.ipfsPut(tempFile).then(r => {
                this.dlogs.pullIPNS(ipns).then(metaJSON => {
                    let newArticle = { title, author: this.dlogs.getAccount(), timestamp: Date.now(), TLDR, };
                    let newJSON = { ...metaJSON };
                    newJSON.Articles = { ...newJSON.Articles, [r[0].hash]: newArticle };
                    fs.writeFileSync(tempIPNSFile, JSON.stringify(newJSON), 'utf8');
                    this.dlogs.ipfsPut(tempIPNSFile).then(r => {
                        this.dlogs.ipnsPublish(r[0].hash).then((rc) => {
                        	fs.unlinkSync(tempFile);
                        	fs.unlinkSync(tempIPNSFile);
			})
                    })
                })
            })
	})
    }

    onDeleteBlog = (ipfsHash) => {
        let tempIPNSFile = ".ipns.json";
        this.dlogs.lookUpByAddr(this.dlogs.getAccount()).then((ipns) => {
            this.dlogs.pullIPNS(ipns).then(metaJSON => {
                let newJSON = { ...metaJSON };
                let articles = newJSON.Articles;
                articles[ipfsHash] = undefined;
                newJSON.Articles = articles;
                fs.writeFileSync(tempIPNSFile, JSON.stringify(newJSON), 'utf8');
                this.dlogs.ipfsPut(tempIPNSFile).then(r => {
                    this.dlogs.ipnsPublish(r[0].hash).then((rc) => {
                    	fs.unlinkSync(tempIPNSFile);
		    })
                })
            })
	})
    }


    onEditBlog = (title, TLDR, content, ipfsHash) => {
        let tempFile = ".tempBlog";
        let tempIPNSFile = ".ipns.json";

        fs.writeFileSync(tempFile, content, 'utf8');
        this.dlogs.lookUpByAddr(this.dlogs.getAccount()).then((ipns) => {
            this.dlogs.ipfsPut(tempFile).then(r => {
                this.dlogs.pullIPNS(ipns).then(metaJSON => {
                    let newArticle = { title, author: this.dlogs.getAccount(), timestamp: Date.now(), TLDR, };
                    let newJSON = { ...metaJSON };
                    let articles = newJSON.Articles;
                    articles[ipfsHash] = undefined;
                    newJSON.Articles = articles;
                    newJSON.Articles = { ...newJSON.Articles, [r[0].hash]: newArticle };
                    fs.writeFileSync(tempIPNSFile, JSON.stringify(newJSON), 'utf8');
                    this.dlogs.ipfsPut(tempIPNSFile).then(r => {
                        this.dlogs.ipnsPublish(r[0].hash).then((rc) => {
                        	fs.unlinkSync(tempFile);
                        	fs.unlinkSync(tempIPNSFile);
			})
                    })
                })
            })
	})
    }

    onUnlock = (pw) => {
	this.dlogs.client.request('unlock', [pw]).then((rc) => {
		if (!rc.result) return false;
		this.dlogs.allAccounts().then((addr) => {
	        	this.dlogs.linkAccount(addr[0]).then(r => {
	            		if (r) {
	                		this.setState({ login: true, account: this.dlogs.getAccount() })
	            		}
	        	})
		})
	})
    }

    onRefresh = () => {
        this.setState({ blogs: [] });
        this.initializeState();
    }


}


DlogsStore.id = "DlogsStore"

export default DlogsStore;
