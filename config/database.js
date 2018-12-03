if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI : 'mongodb://saifakib:akib43215@ds123834.mlab.com:23834/vidjot-dev'
    }
}else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}