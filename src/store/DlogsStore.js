import Reflux from "reflux";
import DlogsActions from "../action/DlogsActions";

class DlogsStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = DlogsActions

        this.state = {
            blogs: ["# This is Blog 1\n" + "This is the content 1"

                ,
            "# This is Blog 2\n" + "This is the content 2"
            ]
        }
    }

    onSaveNewBlog = (blog) => {
        this.setState({blogs : [...this.state.blogs, blog]})
    }


}


DlogsStore.id = "DlogsStore"

export default DlogsStore;