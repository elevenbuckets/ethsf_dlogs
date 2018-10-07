import Reflux from "reflux";
import React from "react";

import DlogsStore from "../store/DlogsStore";
import DlogsAction from "../action/DlogsActions";

import renderHTML from 'react-render-html';
import marked from "marked";


class BlogView extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store = DlogsStore;
    }


    render() {
        return (<div className="item reader" style={{color: 'white', padding: "50px"}}>
            <div style={{textAlign: 'center', fontSize: '25px', padding: "35px"}}>{this.props.blog.title}</div>
            {renderHTML(marked(this.state.currentBlogContent))}

            <input type="button" className="button" defaultValue="Back" onClick={this.props.goBack} />
        </div>);

    }

}

export default BlogView;
