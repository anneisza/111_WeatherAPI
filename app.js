const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/lokasi", async (req, res) =>{
    const kota = (req.query.kota || "").trim();

    //ini buat cek input kosong di pencarian berdasar kotanya
    if(!kota){
        return res.status(400).json({
            message: "Lokasi harus diisi"
        });
    }

    const apiKey = "TmW3n2IbOKaZxkghOoYB";

    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(kota)}.json`;

        try {
            const response = await axios.get(url, {
                params: { key: apiKey, language: "id", limit: 1 }
            });

                console.log(response.data);

                const data = response.data;

        // Mengecek apakah lokasi ditemukan
        if (data.features.length === 0) {
            return res.status(404).json({
                message: "Lokasi tidak ditemukan"
            });
        }

        const feature = data.features[0];

        const [longitude, latitude] = feature.geometry.coordinates;

        const ambil = (jenis) => {
            const item = (feature.context || []).find(c => c.id.startsWith(jenis));
            return item ? item.text : "-";
        };

        res.json({
            lokasi: feature.place_name || feature.text,
            negara: ambil("country"),
            provinsi: ambil("region"),
            kecamatan: ambil("county") !== "-" ? ambil("county") : ambil("municipality"),
            longitude,
            latitude
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Gagal mengambil data dari MapTiler"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});