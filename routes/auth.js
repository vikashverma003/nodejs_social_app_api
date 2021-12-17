const router = require("express").Router();
const User = require("../models/User");
const Person = require("../models/Person");
const Story = require("../models/Story");
const mongoose = require('mongoose');

const bcrypt = require("bcrypt");

// rels

router.get('/rel_data',function(req, res){
  
  const author = new Person({
    _id: new mongoose.Types.ObjectId(),
    name: 'tests',
    age: 80
  });
  
  console.log(req.body);
  author.save(function (err) {
    if (err) return handleError(err);
    console.log("author");

    console.log(author);
  
    const story1 = new Story({
      title: 'test_honda',
      author: author._id    // assign the _id from the person
    });
    console.log("stor");
  
    story1.save(function (err) {
      if (err) return handleError(err);
      console.log("that's it");
      console.log(story1);
      // that's it!
      Story.
      findOne({ title: 'Casino Royale' }).
      populate('author').
      exec(function (err, story) {
        if (err) return handleError(err);
        console.log('The author is %s', story.author.name);

        console.log(story);
        res.json(story);
        // prints "The author is Ian Fleming"
      });


    });
  });

});

// get all the stories of the particular person 
router.get("/stories/:id", async (req, res) => {
  try {
    const story = await Story.find({ author: req.params.id }).populate('author');
    !story && res.status(404).json("story not found");
    console.log(story);
    var data={'asd':'asd','ww':'rrr',story:story};
    console.log(data);
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json(err)
  }
});

// js does not have any assocaitive array
// jsonn response in array format...
router.post("/stories/:id", async (req, res) => {
  try {
     
     var author_id=req.params.id;
     var story_title=req.body.title;
    
     const add_story= new Story({
       title:story_title,
       author:author_id,
     });
     const added=await add_story.save();

    //const story = await Story.find({ author: req.params.id }).populate('author');
    !added && res.status(404).json("story not added found");
    console.log(added);
    console.log("000");
    const get_all_story_particular =await Story.find({ author: req.params.id }).populate('author');
    
    console.log(get_all_story_particular);
   // const get_all_story_particular=await Story.find({author:author_id}).populate('author');
   var data={'new_story':added,'all_story':get_all_story_particular};
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json(err)
  }
});



//REGISTER
router.post("/register", async (req, res) => {
  console.log(req.body);

  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});



//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
