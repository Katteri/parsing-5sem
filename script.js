document.addEventListener('DOMContentLoaded', () => {
  fetchDataAndRenderVisualizations();
});

async function fetchDataAndRenderVisualizations() {
  try {
    const response = await fetch(`http://localhost:3000/api/articles`);
    const articleData = await response.json();

    renderHistogram(articleData);
    renderWordCloud(articleData);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to render the histogram
function renderHistogram(articleData) {
  const publicationsByYear = articleData.reduce((acc, article) => {
    const year = new Date(article.date).getFullYear();
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
}

// Function to render the word cloud
function renderWordCloud(articleData) {

  const notWords = ['a', 'an', 'on', 'for', 'of', 'with', 'in', 'and', 'the', 'that', 'from', 'to', 'by', 'as', 'at', '', 'is', 'are', 'via', 'its', 'd', 'into', 'after', 'among', 'through', 'under', 'against'];
  const wordArray = articleData.flatMap(article => article.heading.split(' ')).reduce((acc, word) => {
    const normalWord = word.toLowerCase().replace(/[(,-1234567890)]/g, "");
    if (!notWords.includes(normalWord)) {
      acc[normalWord] = (acc[normalWord] || 0) + 1;
    }
    return acc;
  }, {});

  const wordList = Object.keys(wordArray)
    .map(word => [word, Math.round(wordArray[word] / 100)])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100);

  function renderWordCloud() {
    const isBigScreen = window.matchMedia("(min-width: 1100px)").matches;
    const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
    const screenWidth = window.innerWidth;
    let origin;
    let weightFactor = 5;
    let gridSize = 10;
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
}
