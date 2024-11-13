const articleData = [
  { title: "Efficient machine learning based techniques for fault detection and identification in spacecraft reaction wheel", authors: ["T. S. Abdel AzizG. I. SalamaS. Hussein"], publicationDate: "2020-01-15" },
  { title: "Research on altitude adjustment performance of stratospheric airship based on thermodynamic-dynamic-pressure coupled", authors: ["Author B"], publicationDate: "2020-03-12" },
  { title: "A trajectory prediction method for boost phase BM based on adaptive tracking and GPR", authors: ["Author C"], publicationDate: "2021-06-18" },
  { title: "A comparison of adaptive optimizers for nonlinear aerodynamic modeling using flight test data", authors: ["Author D"], publicationDate: "2022-11-01" },
  { title: "Contemporary architecture of the satellite Global Ship Tracking (GST) systems, networks and equipment", authors: ["Author E"], publicationDate: "2022-12-25" }
];

// Publication Trends by Year
const publicationsByYear = articleData.reduce((acc, article) => {
  const year = new Date(article.publicationDate).getFullYear();
  acc[year] = (acc[year] || 0) + 1;
  return acc;
}, {});

const years = Object.keys(publicationsByYear);
const publicationCounts = Object.values(publicationsByYear);

const ctx = document.getElementById('publicationTrendChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: years,
    datasets: [{
      label: 'Number of Publications',
      data: publicationCounts,
      backgroundColor: 'rgba(109, 133, 227, 0.6)',
      borderColor: 'rgba(109, 133, 227, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: { beginAtZero: true },
      x: { title: { display: true, text: 'Year' } }
    }
  }
});

// Word Cloud of Article Titles
const notWords = ['a', 'an', 'on', 'for', 'of', 'with', 'in', 'and', 'the', 'that'];
const wordArray = articleData.flatMap(article => article.title.split(' ')).reduce((acc, word) => {
  const normalWord = word.toLowerCase().replace(/[()]/g, "");
  if (!notWords.includes(normalWord)) {
    acc[normalWord] = (acc[normalWord] || 0) + 1;
  }
  return acc;
}, {});

const wordList = Object.keys(wordArray).map(word => [word, wordArray[word]]);

function renderWordCloud() {
  const isBigScreen = window.matchMedia("(min-width: 1100px)").matches;
  const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
  const screenWidth = window.innerWidth;
  let origin;
  let weightFactor = 20;
  let gridSize = 20;
  if (isBigScreen) {
    origin = [550, 300];
  } else if (isSmallScreen) {
    origin = [screenWidth / 2, 300];
    weightFactor = 15;
    gridSize = 15;
  } else {
    origin = [screenWidth / 2, 300];
  }

  document.getElementById('wordCloud').innerHTML = '';

  WordCloud(document.getElementById('wordCloud'), {
    list: wordList,
    gridSize: gridSize,
    weightFactor: weightFactor,
    color: 'random-dark',
    drawOutOfBound: false,
    shrinkToFit: true,
    origin: origin
  });
}

renderWordCloud();

window.addEventListener('resize', renderWordCloud);