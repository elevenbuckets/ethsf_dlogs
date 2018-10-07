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
        return this.state.blogs.map(blog => {
            return <div onClick={this.goToBlog.bind(this, blog)}>
                <div>{"Title:" + blog.title}</div>
                {renderHTML(marked(blog.TLDR))}
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

    saveNewBlog = (blogTitle, blogContent) => {
        DlogsActions.saveNewBlog(blogTitle, blogContent);
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