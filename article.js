class Article {
    constructor(jsonArticle){
        jsonArticle && Object.assign(this, jsonArticle);
    }
}

class Category {
    constructor(jsonCate){
        jsonCate && Object.assign(this, jsonCate);
    }
}

class User {
    constructor(jsonUsers){
        jsonUsers && Object.assign(this, jsonUsers);
    }
}

class modifArticle {
    constructor(jsonModifArticle){
        jsonModifArticle && Object.assign(this, jsonModifArticle);
    }
}