const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");
const { request } = require("http");
const app = express();

const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Data
const _urlData =
  "mongodb+srv://josias:Electronique1@cluster0.9k8sj.mongodb.net/articleDB";
mongoose.connect(_urlData, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const articleSchema = new mongoose.Schema({
  libelle: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  dateCreation: {
    type: Date,
    required: true,
  },
  dateModification: {
    type: Date,
  },
  numeroSerie: {
    type: String,
    required: true,
  },
  aReparer: {
    type: Boolean,
  },
  archiver: {
    type: Boolean,
  },
  supprimer: {
    type: Boolean,
  },
});

const Article = mongoose.model("Article", articleSchema);

_url = "asset/data.json";
var action = "";
var articleDefaut = {
  libelle: "",
  type: "",
  dateCreation: "",
  dateModification: "",
  numeroSerie: "",
  aReparer: false,
  archiver: false,
  supprimer: false,
};
var Articledef1 = {
  libelle: "Tournevis",
  type: "outillage",
  dateCreation: "2016-04-26",
  dateModification: "1972-08-15",
  numeroSerie: "1",
  aReparer: false,
  archiver: false,
  supprimer: false,
};

app.get("/", function (req, res) {
  action = "Ajouter";
  Article.find(
    {},
    function (err, foundArticleListe) {
      if (foundArticleListe.length === 0) {
        Article.create(Articledef1, function (err) {
          if (err) {
            consol.log(err);
          }
        });
      } else {
        res.render("index", {
          ListeArticles: foundArticleListe,
          article: articleDefaut,
          action: action,
        });
      }
    }
  );
});

app.get("/modifier", function (req, res) {
  action = "Modifier";
  var articlelibelle = req.query["articleLibelle"];
  Article.findOne(
    { libelle: articlelibelle },
    function (err, articleSelectione) {
      res.render("article", { article: articleSelectione, action: action });
    }
  );
});

app.post("/ajouterArticle", function (req, res) {
  let articleAjouter = {
    libelle: req.body.libelle,
    type: req.body.type,
    dateCreation: req.body.dateCreation,
    dateModificationn: req.body.dateModification,
    numeroSerie: req.body.numeroSerie,
    aReparer: req.body.etat,
    archiver: req.body.archiver,
    supprimer: req.body.supprimer,
  };
  console.log("Mon article :", articleAjouter);
  Article.create(articleAjouter, function (err, article) {
    if (err) {
      console.log(err);
    } else {
      console.log("L'article ", article, " a bien ete ajouter ");
    }
  });
  res.redirect("/");
});
app.post("/modifierArticle", function (req, res) {
  let articleAjouter = {
    libelle: req.body.libelle,
    type: req.body.type,
    dateCreation: req.body.dateCreation,
    dateModificationn: req.body.dateModification,
    numeroSerie: req.body.numeroSerie,
    aReparer: req.body.etat,
    archiver: req.body.archiver,
    supprimer: req.body.supprimer,
  };
  console.log("Mon article :", articleAjouter);
  Article.findOneAndUpdate(
    { libelle: req.body.libelle },
    {
      libelle: req.body.libelle,
      type: req.body.type,
      dateCreation: req.body.dateCreation,
      dateModificationn: req.body.dateModification,
      numeroSerie: req.body.numeroSerie,
      aReparer: req.body.etat,
      archiver: req.body.archiver,
      supprimer: req.body.supprimer,
    },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("L'article a bien ete mise a jour ");
      }
    }
  );
  res.redirect("/");
});
app.get("/supprimerArticle", function (req, res) {
  var articlelibelle = req.query["articleLibelle"];
  Article.findOneAndUpdate(
    { libelle: articlelibelle },
    { supprimer: true },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("L'article a bien ete supprimer ");
      }
    }
  );
  res.redirect("/");
});
app.get("/archiverArticle", function (req, res) {
    var articlelibelle = req.query["articleLibelle"];
    Article.findOneAndUpdate(
      { libelle: articlelibelle },
      { archiver: true },
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("L'article a bien ete archiver ");
        }
      }
    );
    res.redirect("/");
});

app.listen(port, function () {
  console.log("Server started at port : " + port + " with success");
});
