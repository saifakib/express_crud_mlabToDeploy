const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = require('../models/Idea');

// Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({user: req.user.id})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    if(idea.user != req.user.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea:idea
      });
    }
    
  });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }

  if(errors.length > 0){
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = new Idea({
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    });
    new newUser.save()
      .then(idea => {
        req.flash('success_msg', 'Video idea added');
        res.redirect('/ideas');
      })
  }
    /*    let errors = [];

      if(!req.body.title){
          errors.push({
              text : 'please add a title'
          })
      }
      if(!req.body.detail){
          errors.push({
              text: 'please add a detail'
          })
      }
      if(errors.length > 0){
          res.render('ideas/add', {
              errors : errors
          });
      }
      else{
          const idea = new Idea({
              title : req.body.title,
              detail : req.body.detail
          });
          idea.save()
              .then(idea =>{
                  res.redirect('/ideas');
              })
              .catch(err => console.log(err));
      }*/
});

// Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
/*      idea ({
          title : req.body.title,
          details : req.body.details
      });*/
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        req.flash('success_msg', 'Video idea updated');
        res.redirect('/ideas');
      })
  });
});
/*router.put('/edit/:id', (req, res, next) =>{
    id = req.params.id;

    const updateIdea = {
        title : req.body.title,
        detail: req.body.detail
    };
    Idea.findByIdAndUpdate(id, {set: updateIdea})
        .then(idea =>{
            console.log(idea);
            res.render('ideas/index');
        })
        .catch(err =>{
            console.log(err)
        })
});*/

// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Video idea removed');
      res.redirect('/ideas');
    });
});

module.exports = router;