import Reflux from "reflux";
import React from "react";

import DlogsStore from "../store/DlogsStore";
import DlogsActions from "../action/DlogsActions";
import BlogView from "./BlogView";
import NewBlog from "./NewBlog";

import renderHTML from 'react-render-html';
import marked from "marked";


class MainView extends Reflux.Component {

    constructor(props) {
        super(props);
        this.state = {
            view: "List",
            currentBlog: ""
        }

        this.store = DlogsStore;
    }

    getBlogList = () => {
        return this.state.blogs.map((blog, idx) => {
            let magic = (idx + 1) % 2;
            let layout = magic == 0 ? 'rpicDiv' : 'lpicDiv';
            let prefix = magic == 0 ? 'r' : 'l';
            return <div className={layout} onClick={this.goToBlog.bind(this, blog)}>
                <div className={prefix + 'title'} style={{ color: 'rgb(155,155,155,0.85)' }}>
                    <p style={{ fontSize: "28px", color: 'white' }}>{blog.title}</p>
                    {renderHTML(marked(blog.TLDR))}
                </div>
                <div className={prefix + 'pic'}
                    style={{ backgroundColor: 'white', width: '15px', height: '15px' }}>
                </div>
            </div>
        })
    }

    goToBlog = (blog) => {
        DlogsActions.fetchBlogContent(blog.ipfsHash);
        this.setState({ view: "Content", currentBlog: blog });
    }

    goToNewBlog = () => {
        this.setState({ view: "New" })
    }

    goBackToList = () => {
        this.setState({ view: "List", currentBlog: "" })
    }

    saveNewBlog = (blogTitle, blogTLDR, blogContent) => {
        DlogsActions.saveNewBlog(blogTitle, blogTLDR, blogContent);
        this.goBackToList()
    }

    unlock = (event) => {
        if (event.keyCode == 13) {
            let variable = this.refs.ps.value;
            this.refs.ps.value = "";
            DlogsActions.unlock(variable);
        }
    }

    refresh = () =>{
        DlogsActions.refresh();
    }

    render() {
        return (this.state.login ? <div className="item contentxt">
            {this.state.view === "List" ? this.state.blogs.length == 0 ? <div className="item" style={{width: '100vw', height: '80vh'}}><div className='item loader'></div></div>: this.getBlogList() :
                this.state.view === "Content" ? <BlogView blog={this.state.currentBlog} goBack={this.goBackToList} />
                    : <NewBlog saveNewBlog={this.saveNewBlog} goBack={this.goBackToList} />}
            {this.state.view === "List" ? <div className="item mainctr"><input type="button" className="button" defaultValue="New" onClick={this.goToNewBlog} />
                <input type="button" className="button" defaultValue="Refresh" onClick={this.refresh} /></div> : ""}
        </div> : <div className="item contentxt">
            <div className="item login"> <label style={{margin: '10px', alignSelf: "flex-end"}}>Password: </label>
                <input autoFocus style={{alignSelf: 'flex-start'}} type="password" ref="ps" onKeyUp={this.unlock} />
            </div></div>);

    }

}

export default MainView;
