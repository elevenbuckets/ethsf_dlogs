import Reflux from "reflux";
import React from "react";

import DlogsStore from "../store/DlogsStore";
import DlogsAction from "../action/DlogsActions";

import renderHTML from 'react-render-html';
import marked from "marked";


class NewBlog extends Reflux.Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditable: true,
            blogContent: "",
            blogTitle:""
        }

        this.store = DlogsStore;
    }

    getEditView = () => {
        return <form>
        <label >Title</label>
        <textarea onChange={this.udpateBlogTitle} value={this.state.blogTitle}></textarea>
        <textarea onChange={this.udpateBlogContent} value={this.state.blogContent}></textarea>
      </form>
      
    }

    udpateBlogContent = (event) => {
        this.setState({ blogContent: event.target.value })
    }

    udpateBlogTitle = (event) => {
        this.setState({ blogTitle: event.target.value })
    }


    saveNewBlog = () => {
        this.props.saveNewBlog(this.state.blogTitle, this.state.blogContent);
    }

    changeEditable = () => {
        this.setState({ isEditable: !this.state.isEditable })
    }

    getBlogPreview = () =>{
        return <div> {this.state.blogTitle}
        {renderHTML(marked(this.state.blogContent))}
        </div>
    }


    render() {
        return (<div>
            {this.state.isEditable ? this.getEditView() : this.getBlogPreview()}
            <button onClick={this.changeEditable}>{this.state.isEditable ? "Preview" : "Edit"}</button>
            <button onClick={this.saveNewBlog}>Save</button>
        </div>);

    }

}

export default NewBlog;