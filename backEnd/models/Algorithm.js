// const mongoose = require("mongoose");
import mongoose from "mongoose";

const algorithmSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String,required :true },
  category : { type: String,required :true },
  difficulty : { type: String,required :true }, 
  slug : {type:String,required:true},
  code : {type:String,required:true}

});

const Algorithms = mongoose.model("Algorithm", algorithmSchema);
export default Algorithms;