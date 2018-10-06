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
            blog: ""
        }

        this.store = DlogsStore;
    }

    getEditView = () => {
        return <form>
        <textarea onChange={this.udpateBlog} value={this.state.blog}></textarea>
      </form>
      
    }

    udpateBlog = (event) => {
        this.setState({ blog: event.target.value })
    }

    saveNewBlog = () => {
        this.props.saveNewBlog(this.state.blog);
    }

    changeEditable = () => {
        this.setState({ isEditable: !this.state.isEditable })
    }



    render() {
        return (<div>
            {this.state.isEditable ? this.getEditView() : renderHTML(marked(this.state.blog))}
            <button onClick={this.changeEditable}>{this.state.isEditable ? "Preview" : "Edit"}</button>
            <button onClick={this.saveNewBlog}>Save</button>
        </div>);

    }

}

export default NewBlog;