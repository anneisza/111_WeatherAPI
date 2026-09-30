const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/lokasi", async (req, res) =>{
    const kota = req.query.kota;

    //ini buat cek input kosong di pencarian berdasar kotanya
    if(!kota){
        return res.status(400).json({
            message: "Lokasi harus diisi"
        });
    }
});