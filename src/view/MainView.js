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
	let colors = ['purple', 'yellow'];
        return this.state.blogs.map((blog, idx) => {
		let magic = (idx + 1) % 2;
                let layout = magic == 0 ? 'rpicDiv' : 'lpicDiv';
                let prefix = magic == 0 ? 'r' : 'l';
            return <div className={layout} onClick={this.goToBlog.bind(this, blog)}>
                <div className={prefix + 'titleDiv'}>
			{blog.title}<br/>
                	{renderHTML(marked(blog.TLDR))}
		</div>
		<div className={prefix + 'picDiv'} style={{ backgroundColor: colors[magic] }}></div>
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

    render() {
        return (<div>
            {this.state.view === "List" ? this.getBlogList() :
                this.state.view === "Content" ? <BlogView blog={this.state.currentBlog} goBack={this.goBackToList} />
                    : <NewBlog saveNewBlog={this.saveNewBlog} />}
            {this.state.view === "List" ? <button onClick={this.goToNewBlog}> New </button> : ""}
        </div>);

    }

}

export default MainView;
