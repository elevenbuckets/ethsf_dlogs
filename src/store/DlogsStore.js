import Reflux from "reflux";
import DlogsActions from "../action/DlogsActions";

class DlogsStore extends Reflux.Store {
    constructor() {
        super();
        this.listenables = DlogsActions

        this.state = {
            blogs: [{
                title: "Blog 1",
                author: "0x...1",
                timeStamp: "123123",
                content: "# This is Blog 1\n" + "This is the content 1"
            },
            {
                title: "Blog 1",
                author: "0x...1",
                timeStamp: "123123",
                content: "# This is Blog 1\n" + "This is the content 1"
            }
            ]
        }
    }

    onSaveNewBlog = (title, content) => {
        let blog = {title, content}
        this.setState({ blogs: [...this.state.blogs, blog] })
    }


}


DlogsStore.id = "DlogsStore"

export default DlogsStore;