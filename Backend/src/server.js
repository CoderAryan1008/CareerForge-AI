const path = require("path");
const connecttodb = require("./config/database");
require("dotenv").config({ path: path.join(__dirname, ".env") }); //for using the .env file 
const app = require("./app");
connecttodb(); //Yeh fn se hum db se connect honge

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port} !!!`);

})

