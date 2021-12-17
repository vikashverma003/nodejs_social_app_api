const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

//const Person = mongoose.model('Person', personSchema);
module.exports = mongoose.model('Person', personSchema);

//module.exports = mongoose.model("Post", PostSchema);
