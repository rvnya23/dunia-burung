// ============================================
// DATA BURUNG LENGKAP (v2 - ditambah Dodo & Merpati Putih)
// ============================================

const birdsData = [
    {
        id: 1,
        name: "Burung Lovebird",
        latinName: "Agapornis roseicollis",
        avatar: "🦜",
        habitat: "Padang Rumput & Semak Afrika",
        wingSpan: "20-25 cm",
        flightHeight: "200-500 meter",
        shortDesc: "Burung kecil penuh kasih yang selalu berpasangan! 💕",
        description: "Lovebird adalah burung kecil yang berasal dari Afrika dan terkenal karena ikatan kuat antar pasangannya. Mereka memiliki bulu berwarna cerah dengan kombinasi hijau, merah, kuning, dan biru yang indah. Lovebird sangat sosial dan bisa merasa kesepian jika tidak memiliki teman, itulah mengapa mereka biasanya dipelihara berpasangan. Ukuran tubuhnya kecil (sekitar 13-17 cm) tapi memiliki kepribadian yang besar dan penuh semangat.",
        funFact: "Lovebird mendapat namanya karena pasangan lovebird sering duduk berdekatan dan saling merawat bulu satu sama lain sebagai tanda kasih sayang! 💑",
        soundFile: "lovebird.mp3",
        markerFile: "pattern-lovebird.png",
        markerPattern: "pattern-lovebird.patt",
        modelFile: "lovebird.glb",
        color: "#FF6B6B"
    },
    {
        id: 2,
        name: "Burung Toucan",
        latinName: "Ramphastos toco",
        avatar: "🦜",
        habitat: "Hutan Hujan Amazon",
        wingSpan: "40-50 cm",
        flightHeight: "1000-2000 meter",
        shortDesc: "Burung eksotis dengan paruh besar berwarna cerah yang menakjubkan! 🌈",
        description: "Burung Toucan adalah salah satu burung paling ikonik di dunia dengan paruhnya yang besar dan berwarna cerah. Meskipun paruhnya terlihat berat, sebenarnya sangat ringan karena terbuat dari keratin (seperti kuku manusia) dengan struktur berongga. Toucan hidup di hutan hujan Amerika Selatan, terutama di wilayah Amazon. Mereka menggunakan paruhnya yang besar untuk mengambil buah-buahan dan juga untuk mengatur suhu tubuh.",
        funFact: "Paruh Toucan bisa tumbuh hingga 20 cm dan memiliki pembuluh darah yang membantu mengatur suhu tubuh burung ini di cuaca panas! 🌡️",
        soundFile: "toucan.mp3",
        markerFile: "pattern-toucan.png",
        markerPattern: "pattern-toucan.patt",
        modelFile: "toucan.glb",
        color: "#4ECDC4"
    },
    {
        id: 3,
        name: "Burung Kingfisher",
        latinName: "Alcedo atthis",
        avatar: "🐦",
        habitat: "Dekat Sungai & Danau",
        wingSpan: "25-30 cm",
        flightHeight: "100-500 meter",
        shortDesc: "Burung kecil berwarna biru cerah yang jago memancing ikan! 🎣",
        description: "Burung Kingfisher atau Raja Udang adalah burung kecil dengan bulu berwarna biru metalik dan oranye yang sangat indah. Mereka adalah pemancing ulung yang bisa menukik ke air dengan kecepatan tinggi untuk menangkap ikan kecil. Kingfisher memiliki penglihatan yang sangat tajam dan bisa memperhitungkan pembiasan cahaya di air sehingga selalu tepat menangkap mangsanya. Mereka biasanya hidup di dekat sungai, danau, atau perairan tawar lainnya.",
        funFact: "Kingfisher bisa melihat ikan di dalam air dengan sangat akurat berkat matanya yang memiliki filter khusus untuk mengurangi silau dan memperhitungkan pembiasan cahaya! 👁️",
        soundFile: "kingfisher.mp3",
        markerFile: "pattern-kingfisher.png",
        markerPattern: "pattern-kingfisher.patt",
        modelFile: "kingfisher.glb",
        color: "#3498DB"
    },
    {
        id: 4,
        name: "Burung Dodo",
        latinName: "Raphus cucullatus",
        avatar: "🐦",
        habitat: "Pulau Mauritius (Punah)",
        wingSpan: "Tidak bisa terbang",
        flightHeight: "0 meter (tidak bisa terbang)",
        shortDesc: "Burung legendaris yang sudah punah dari Pulau Mauritius! 🏝️",
        description: "Burung Dodo adalah burung yang tidak bisa terbang dan pernah hidup di Pulau Mauritius di Samudra Hindia. Dodo memiliki tubuh besar dengan berat sekitar 10-18 kg, paruh bengkok, dan sayap kecil yang tidak berfungsi untuk terbang. Sayangnya, Dodo punah sekitar tahun 1681 akibat perburuan manusia dan predator yang dibawa ke pulau tersebut. Dodo menjadi simbol penting dalam pelajaran tentang kepunahan dan pentingnya menjaga kelestarian hewan.",
        funFact: "Dodo tidak takut pada manusia karena di Pulau Mauritius tidak ada predator alami sebelum manusia datang. Sifat jinak inilah yang sayangnya mempercepat kepunahannya! 😢",
        soundFile: "dodo.mp3",
        markerFile: "pattern-dodo.png",
        markerPattern: "pattern-dodo.patt",
        modelFile: "dodo.glb",
        color: "#8B7355"
    },
    {
        id: 5,
        name: "Merpati Putih",
        latinName: "Columba livia domestica",
        avatar: "🕊️",
        habitat: "Seluruh Dunia (Perkotaan & Pedesaan)",
        wingSpan: "60-70 cm",
        flightHeight: "1000-2000 meter",
        shortDesc: "Simbol perdamaian dunia yang bisa navigasi ribuan kilometer! ✌️",
        description: "Merpati Putih adalah salah satu burung yang paling dikenal di seluruh dunia dan menjadi simbol perdamaian, cinta, dan kemurnian dalam banyak budaya. Merpati memiliki kemampuan navigasi yang luar biasa dan dapat menemukan jalan pulang dari jarak ratusan kilometer. Di masa lalu, merpati digunakan sebagai pengantar pesan (merpati pos) karena kemampuan navigasi mereka. Merpati putih sering dilepaskan dalam upacara pernikahan dan perayaan perdamaian.",
        funFact: "Merpati pos pernah digunakan dalam Perang Dunia I dan II untuk mengirim pesan rahasia melintasi garis musuh. Seekor merpati bernama Cher Ami berhasil menyelamatkan 194 prajurit Amerika! 🎖️",
        soundFile: "merpati-putih.mp3",
        markerFile: "pattern-merpati-p.png",
        markerPattern: "pattern-merpati-p.patt",
        modelFile: "merpati-putih.glb",
        color: "#F0F0F0"
    },
    {
        id: 6,
        name: "Burung Robin",
        latinName: "Erithacus rubecula",
        avatar: "🐦",
        habitat: "Hutan, Taman & Kebun Eropa",
        wingSpan: "20-22 cm",
        flightHeight: "100-300 meter",
        shortDesc: "Burung kecil berbulu merah oranye ikonik dari Eropa yang punya suara merdu! 🎵",
        description: "Burung Robin atau European Robin adalah burung kecil yang sangat populer di Eropa, terutama di Inggris di mana ia dianggap sebagai 'burung nasional tidak resmi'. Robin mudah dikenali dari bulu dadanya yang berwarna merah oranye cerah, kontras dengan tubuhnya yang berwarna cokelat zaitun. Robin termasuk burung yang tidak takut pada manusia dan sering mengikuti tukang kebun yang sedang mencangkul tanah untuk mencari cacing. Mereka aktif sepanjang tahun dan sering bernyanyi bahkan di malam hari.",
        funFact: "Robin jantan sangat territorial dan akan bernyanyi dengan keras untuk mempertahankan wilayahnya. Mereka bahkan bisa mengalahkan burung yang jauh lebih besar demi melindungi sarangnya! 🎤",
        soundFile: "robin.mp3",
        markerFile: "pattern-robin.png",
        markerPattern: "pattern-robin.patt",
        modelFile: "robin.glb",
        color: "#E8651A"
    }
];

// Data Quiz (diperluas dengan dodo & merpati putih)
const quizData = [
    {
        id: 1,
        question: "Burung apa yang terkenal selalu hidup berpasangan dan penuh kasih sayang?",
        emoji: "💕",
        options: ["Burung Lovebird", "Burung Toucan", "Burung Kingfisher", "Burung Dodo"],
        correctIndex: 0,
        explanation: "Lovebird mendapat namanya karena selalu berpasangan dan saling merawat satu sama lain!"
    },
    {
        id: 2,
        question: "Apa nama latin dari Burung Lovebird?",
        emoji: "📖",
        options: ["Ramphastos toco", "Agapornis roseicollis", "Alcedo atthis", "Raphus cucullatus"],
        correctIndex: 1,
        explanation: "Nama latin Burung Lovebird adalah Agapornis roseicollis."
    },
    {
        id: 3,
        question: "Burung mana yang memiliki paruh besar dan berwarna cerah?",
        emoji: "🦜",
        options: ["Burung Kingfisher", "Burung Lovebird", "Burung Toucan", "Merpati Putih"],
        correctIndex: 2,
        explanation: "Burung Toucan terkenal dengan paruh besarnya yang berwarna cerah dan bisa tumbuh hingga 20 cm!"
    },
    {
        id: 4,
        question: "Di mana habitat alami Burung Kingfisher?",
        emoji: "🌊",
        options: ["Gurun Pasir", "Dekat Sungai dan Danau", "Pegunungan Tinggi", "Padang Rumput"],
        correctIndex: 1,
        explanation: "Kingfisher hidup di dekat perairan seperti sungai dan danau untuk mencari ikan."
    },
    {
        id: 5,
        question: "Burung Dodo berasal dari pulau mana?",
        emoji: "🏝️",
        options: ["Pulau Bali", "Pulau Kalimantan", "Pulau Mauritius", "Pulau Jawa"],
        correctIndex: 2,
        explanation: "Burung Dodo hidup di Pulau Mauritius di Samudra Hindia sebelum punah sekitar tahun 1681!"
    },
    {
        id: 6,
        question: "Apa keistimewaan utama Merpati Putih?",
        emoji: "✌️",
        options: ["Bisa berbicara seperti manusia", "Navigasi dan menemukan jalan pulang dari jauh", "Paruhnya sangat besar", "Pandai menangkap ikan"],
        correctIndex: 1,
        explanation: "Merpati memiliki kemampuan navigasi luar biasa, bahkan pernah digunakan sebagai pengantar pesan di zaman perang!"
    },
    {
        id: 7,
        question: "Mengapa Burung Dodo menjadi punah?",
        emoji: "😢",
        options: ["Terlalu banyak makan", "Perburuan manusia dan predator baru", "Tidak bisa berenang", "Cuaca yang terlalu panas"],
        correctIndex: 1,
        explanation: "Dodo punah karena perburuan manusia dan predator seperti tikus dan kucing yang dibawa ke Pulau Mauritius."
    },
    {
        id: 8,
        question: "Apa simbol dari Merpati Putih?",
        emoji: "🕊️",
        options: ["Perang dan kekuatan", "Perdamaian dan kemurnian", "Kecepatan dan kebebasan", "Kecerdasan dan misteri"],
        correctIndex: 1,
        explanation: "Merpati Putih adalah simbol perdamaian, cinta, dan kemurnian dalam banyak budaya di seluruh dunia!"
    },
    {
        id: 9,
        question: "Apa ciri khas paling menonjol dari Burung Robin?",
        emoji: "🐦",
        options: ["Paruh panjang berwarna kuning", "Dada berwarna merah oranye", "Ekor berwarna biru cerah", "Kepala berwarna hitam putih"],
        correctIndex: 1,
        explanation: "Burung Robin sangat mudah dikenali dari dadanya yang berwarna merah oranye yang mencolok!"
    },
    {
        id: 10,
        question: "Apa nama latin dari Burung Robin?",
        emoji: "📖",
        options: ["Erithacus rubecula", "Columba livia", "Alcedo atthis", "Turdus merula"],
        correctIndex: 0,
        explanation: "Nama latin Burung Robin adalah Erithacus rubecula. Kata 'rubecula' dalam bahasa Latin berarti 'sedikit merah'!"
    }
];