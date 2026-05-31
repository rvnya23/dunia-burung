// ============================================
// DATA BURUNG LENGKAP
// ============================================

const birdsData = [
    {
        id: 1,
        name: "Burung Beo",
        latinName: "Gracula religiosa",
        avatar: "🦜",
        habitat: "Hutan Tropis Asia",
        wingSpan: "30-35 cm",
        flightHeight: "500-1000 meter",
        shortDesc: "Burung super pintar yang bisa menirukan suara manusia! 🗣️",
        description: "Burung Beo adalah burung yang sangat cerdas dan terkenal di seluruh dunia karena kemampuannya yang luar biasa dalam menirukan suara manusia. Mereka memiliki bulu berwarna hitam mengkilap dengan sedikit warna kuning di bagian kepala dan leher. Beo hidup di hutan tropis Asia Selatan dan Tenggara, termasuk Indonesia. Mereka adalah hewan sosial yang hidup berkelompok dan bisa belajar banyak kata jika dilatih dengan sabar.",
        funFact: "Beo bisa belajar hingga 100 kata berbeda dan bahkan bisa menirukan suara hewan lain serta suara benda seperti telepon berdering! 📞",
        soundFile: "beo.mp3",
        markerFile: "pattern-beo.png",
        markerPattern: "pattern-beo.patt",
        modelFile: "beo.glb",
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
    }
];

// Data Quiz
const quizData = [
    {
        id: 1,
        question: "Burung apa yang terkenal bisa menirukan suara manusia?",
        emoji: "🗣️",
        options: ["Burung Beo", "Burung Toucan", "Burung Kingfisher", "Burung Elang"],
        correctIndex: 0,
        explanation: "Burung Beo memang terkenal pintar menirukan suara manusia!"
    },
    {
        id: 2,
        question: "Apa nama latin dari Burung Beo?",
        emoji: "📖",
        options: ["Ramphastos toco", "Gracula religiosa", "Alcedo atthis", "Aquila chrysaetos"],
        correctIndex: 1,
        explanation: "Nama latin Burung Beo adalah Gracula religiosa."
    },
    {
        id: 3,
        question: "Burung mana yang memiliki paruh besar dan berwarna cerah?",
        emoji: "🦜",
        options: ["Burung Kingfisher", "Burung Beo", "Burung Toucan", "Burung Merpati"],
        correctIndex: 2,
        explanation: "Burung Toucan terkenal dengan paruh besarnya yang berwarna cerah!"
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
        question: "Apa keistimewaan utama Burung Kingfisher?",
        emoji: "🎣",
        options: ["Bisa bicara seperti manusia", "Paruhnya sangat besar", "Pandai menangkap ikan di air", "Bisa terbang sangat tinggi"],
        correctIndex: 2,
        explanation: "Kingfisher adalah pemancing ulung yang bisa menukik ke air untuk menangkap ikan!"
    }
];