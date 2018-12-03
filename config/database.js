if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI : 'mongodb://<dbuser>:saif@ds111895.mlab.com:11895/vidjot-dev'
    }
}else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}