var bodyParser = require("body-parser"),
methodOverride=require("method-override"),
expressSanitizer=require("express-sanitizer"),
mongoose=require("mongoose"),
express=require("express"),
app=express();


mongoose.connect("mongodb://localhost:27017/BlogApp",{
useUnifiedTopology: true,
useNewUrlParser: true,	
 });
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);

//Blog.create({
//	title: "test",
 //	image:"https://lh3.googleusercontent.com/eT_elfRYElfPE4SQ3oOPBGbNJjpusgMS5cD84afcbNgZ4Bo3-_huiLh49DiX0poMdXf7Rcq-T5wAVysNBxepRu1T0V4YVMwEbY3xwCaggT1Q--l86L-v_oAPHs7znSW1_HV2CZqhdC7YGbqhg5nkdK5PNgvmkRLl8sQ1TgMKbTeq3m7YrKqmJs6TI11Em7ycXe0EuF1rJw2VDkOnsHynD5C0SE1j7KbjUGslsar_HuG2Pg7jM1ujxd2nC890Wxp5vy7xqAXV-sRB36mOZPTdAHZLAAm9YGdFec9maXxRd2fpEXC97F76jDq82WnKul3hXcPrdX994LpYcJsypPNF3UwkqeRW543c61LMO7eXckSvCoYWlogW0D5y5PRjmgDVvPbxc7GGgcRecyDkjaes0gTuiyENgpwUldc0eqo8emNqaKI-vIt1Imu3MJXQrhmB4ePNTqgt9tMZ3OL99Y2j-MrBarjbnBXHzk66TMEUOcvRxVbcYxFbPDn8KU3DxwzHEo1hKsmbpQxlgwbE_ParzIH-RI_TAt26azFZsM6nTtn04xeVTAuovcCKFb2Hqnbg1YAXOA4NMEQP18EZzfGG8z6UJ4sxnt3qTtblRXUmtjP5cYcQOt2jmnVEX6X940LLmVbrYoekKiKXFFU408ZKtTP069B8VikCut7QZB9Z4orNs8ci6H8TX1faR8el6Q=w801-h665-no",
 	//body: "hello"
 //});

//Routes

app.get("/",function(req,res) {
	res.redirect("/blogs")
});
app.get("/blogs",function(req,res){
	Blog.find({},function(err, blogs) {
		if(err){
			console.log(err)
		} else {
			res.render("index", {blogs: blogs});
		}
	});
	
});
//NEW ROUTE
app.get("/blogs/new", function(req, res) {
	res.render("new");
});

app.post("/blogs", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

 
app.get("/blogs/:id", function(req,res) {
	 Blog.findById(req.params.id,function (err, foundBlog) {
	 	if(err){
	 		res.redirect("/blogs");
	 	} else {
	 		res.render("show", {blog: foundBlog});
	 	}
	 })
})

//EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs");
        }
    });
});



app.listen(process.env.PORT || 3000, function () {
    console.log("Server has started");
});