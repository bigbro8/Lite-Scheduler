const express = require("express");
const path = require("path");

const router = express.Router();

router.get('/create1', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/create1.html'));
});

router.get('/defineG', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/create1.html'));
});

router.get('/create2', (req, res) => {
res.sendFile(path.join(__dirname, '../public/html/create2.html'));
});


router.get('/logicconf', (req, res) =>{
    res.sendFile(path.join(__dirname, '../public/html/logicconf.html'));
});
    
router.get('/loading', (req, res) =>{
    res.sendFile(path.join(__dirname, '../public/html/loading.html'));
});

router.get('/result', (req, res) =>{
    res.sendFile(path.join(__dirname, '../public/html/result.html'));
});
