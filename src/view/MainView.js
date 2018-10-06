import Reflux from "reflux";
import React from "react";

import DlogsStore from "../store/DlogsStore";
import DlogsAction from "../action/DlogsActions";


class MainView extends Reflux.Component{

    constructor(props){
        super(props);

        this.store = DlogsStore;
    }

    render(){
        return (<div>
                {this.state.blogs}
            </div>);
        
    }

}

export default MainView;