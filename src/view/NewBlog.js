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
        return <form className="newForm" style={{  width: '100vw', textAlign: 'center'}}>
        <textarea placeholder="Title" style={{width: '80vw', height: '30px', backgroundColor: 'rgba(0,0,0,0)',
    border: '2px solid white', color: 'white'}} onChange={this.udpateBlog.bind(this, "blogTitle")} value={this.state.blogTitle}></textarea>
        <textarea placeholder="TL;DR" style={{width: '86vw', height: '5vh', backgroundColor: 'rgba(0,0,0,0)',
    border: '2px solid white', color: 'white'}} onChange={this.udpateBlog.bind(this, "blogTLDR")} value={this.state.blogTLDR}></textarea>
        <textarea placeholder="Content" style={{width: '86vw', height: '80vh', backgroundColor: 'rgba(0,0,0,0)',
    border: '2px solid white', color: 'white'}} onChange={this.udpateBlog.bind(this, "blogContent")} value={this.state.blogContent}></textarea>
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
        return (<div className="item newDiv" style={{textAlign: 'center'}}>
            {this.state.isEditable ? this.getEditView() : this.getBlogPreview()}
            <input type="button" className="button pbutton" defaultValue={this.state.isEditable ? "Preview" : "Edit"} onClick={this.changeEditable} />
            <input type="button" className="button sbutton" defaultValue="Save" onClick={this.saveNewBlog} />
            <input type="button" className="button bbutton" defaultValue="Back" onClick={this.props.goBack} />
        </div>);

    }

}

export default NewBlog;
