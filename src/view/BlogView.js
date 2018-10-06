import Reflux from "reflux";
import React from "react";

import DlogsStore from "../store/DlogsStore";
import DlogsAction from "../action/DlogsActions";

import renderHTML from 'react-render-html';
import marked from "marked";


class BlogView extends Reflux.Component {

    constructor(props) {
        super(props);
        this.state ={
            view: "List",
            currentBlog : ""
        }

        this.store = DlogsStore;
    }


    render() {
        return (<div>
            {renderHTML(marked(this.props.blog))}

            <button onClick = {this.props.goBack}>Back</button>
        </div>);

    }

}

export default BlogView;