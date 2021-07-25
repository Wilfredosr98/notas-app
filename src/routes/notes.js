const express = require('express');
const router = express.Router();
const Note = require('../models/Note')
const {isAuthenticated} = require('../helpers/auth')


//Obtiene todas las notas
router.get('/notes', isAuthenticated, async(req, res) => {
	const notes = await Note.find({user:req.user.id})
	.sort({ date: "desc" })
	.lean();	
	res.render('notes/all-notes', { notes })
})

//Añade una nueva nota
router.get('/notes/add',isAuthenticated, (req, res) => {
	res.render('notes/new-note');
});

//Ruta para recibir la nota y luego almacenar en base de datos
router.post('/notes/new-note',isAuthenticated,  async(req, res) =>{
	const { title, description } = req.body;
	const errors = [];
	if (!title) {
		errors.push({ text: "Please Write a Title." });
	}
	if (!description) {
		errors.push({ text: "Please Write a Description" });
	}
	if (errors.length > 0) {
		res.render("notes/new-note", {
			errors,
			title,
			description,
		});
	} else {
		const newNote = new Note({ title, description });
		newNote.user = req.user.id;
		await newNote.save();
		req.flash("success_msg", "Note Added Successfully");
		res.redirect("/notes");
	}
});


router.get("/notes/edit/:id",isAuthenticated, async(req, res) =>{
	const note = await Note.findById(req.params.id)
	.lean();
	res.render('notes/edit-note', { note })
});

router.put('/notes/edit-note/:id',isAuthenticated,  async (req, res) => {
	const { title, description } = req.body;
	await Note.findByIdAndUpdate(req.params.id, { title, description });
	res.redirect("/notes");
});

router.delete('/notes/delete/:id', async (req, res) => {
	await Note.findByIdAndDelete(req.params.id);
	req.flash("success_msg", "Note delete Successfully");
	res.redirect("/notes");
});


module.exports = router;


