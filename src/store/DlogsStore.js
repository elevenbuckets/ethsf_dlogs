import Reflux from "reflux";

class DlogsStore extends Reflux.Store {
    constructor() {
        super();

        this.state = {
            blogs: ["# This is Blog 1\n" + "This is the content 1"

                ,
            "# This is Blog 2\n" +

            "This is the content 2"
            ]
        }
    }


}


DlogsStore.id = "DlogsStore"

export default DlogsStore;