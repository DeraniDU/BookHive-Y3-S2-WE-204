const Book = require("../Models/book")

const getAllbooks = async(req, res, next) =>{
  let books ;
   try {
    books = await Book.find();
   }catch(err){
    console.log(err);
   }

   if(!books){
    return res.status(404).json({massage:"book not found"})
   }

   //getallUsers

   return res.status(200).json({books});

   

};

//create book 

const createBook = async (req, res) => {
  const { title, author, userId } = req.body;

  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const book = new Book({ title, author, userId,review });
    await book.save();
    res.status(201).json(book); // success response
  } catch (err) {
    res.status(500).json({ error: err.message }); // error handling
  }
}


exports.getAllbooks = getAllbooks;
exports.createBook = createBook;