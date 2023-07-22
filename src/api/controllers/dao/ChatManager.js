import {chatModel} from '../../models/chat.model.js'

class chatManager {
    constructor() {
      this.error = "";
    }
    /**
     * This function get the user and messages from our collection
     */
    getMessages = async () => {
        const messages = await chatModel.find().lean();
        return messages;
    };
    /**
     * This function insert into our collection the user and message
     */
    insertMessage = async (data) => {
      const result = await chatModel.create(data);
      return result
    };
  
  }
  export default chatManager;
