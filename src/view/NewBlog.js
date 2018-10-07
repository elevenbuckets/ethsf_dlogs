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
            blogTitle:"",
            blogTLDR : ""
        }

        this.store = DlogsStore;
    }

    getEditView = () => {
        return <form>
        <label >Title</label>
        <textarea onChange={this.udpateBlog.bind(this, "blogTitle")} value={this.state.blogTitle}></textarea>
        <label >TLDR</label>
        <textarea onChange={this.udpateBlog.bind(this, "blogTLDR")} value={this.state.blogTLDR}></textarea>
        <label >Content</label>
        <textarea onChange={this.udpateBlog.bind(this, "blogContent")} value={this.state.blogContent}></textarea>
      </form>
      
    }

    udpateBlog= (field, event) => {
        this.setState({ [field]: event.target.value })
    }


    saveNewBlog = () => {
        this.props.saveNewBlog(this.state.blogTitle, this.state.blogTLDR, this.state.blogContent);
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
            <button onClick={this.props.goBack}>Back</button>
        </div>);

    }

}

export default NewBlog;